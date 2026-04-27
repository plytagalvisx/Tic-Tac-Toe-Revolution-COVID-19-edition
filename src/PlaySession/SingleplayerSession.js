import React, {Component} from "react";
import './SingleplayerSession.css';
import freeSpace from "../PlayingField/blankSpace.jpg";
import symbol from "../PlayingField/cross.png";
import symbol2 from "../PlayingField/circle.png";
import firebase from "./../firebaseConfig/firebaseConfig";
import {Link} from "react-router-dom";
import PlayingField from "../PlayingField/PlayingField";
import InventoryModal from "../Inventory/InventoryModal";
import "../Styles/stylesheet.css";
import SkillSet from "../Skills/SkillSet";
import hearticon from "../ViewPlay/hearticon.png";
import bolticon from "../ViewPlay/lightningBolt.png";
import shieldicon from "../ViewPlay/silverShield.png";
import Modal from "react-bootstrap/Modal";

class SingleplayerSession extends Component {
    constructor(props) {
        super(props);

        this.state = {
            playerX: "X",
            playerO: "O",
            counterAI: 0,
            player_health: 100,
            virus_health: 100,

            player_max_health: 100,
            virus_max_health: 100,

            skillsFromDB: [],
            player_skillSet: [],
            virus_skillSet: [],

            turn: 0,
            activeEffects: [],

            allTiles: [[0,0,0], [0,0,0], [0,0,0]],
            gamePieces: [freeSpace, symbol, symbol2],

            nextPlayer: true,
            id: "",

            isOpen: false,
            isOpen2: false,

            currentVirus: this.props.virus
        };
        this.skillsArr = [];
        this.activatedSkills = [];
        this.gameover = false;
        this.gameReset = false;
        this.checkEmptyTiles = this.checkEmptyTiles.bind(this);
        this.checkGameWins = this.checkGameWins.bind(this);
        this.getBestMove = this.getBestMove.bind(this);
        this.easyDifficulty = this.easyDifficulty.bind(this);
        this.hardDifficulty = this.hardDifficulty.bind(this);
        this.areAllTilesClicked = this.areAllTilesClicked.bind(this);
        this.minimaxAlgorithm = this.minimaxAlgorithm.bind(this);
        this.drawPieceOnTile = this.drawPieceOnTile.bind(this);
        this.isSkillTriggered = this.isSkillTriggered.bind(this);
        this.calculateSkillEffects = this.calculateSkillEffects.bind(this);
        this.resetGame = this.resetGame.bind(this);
    }

    async componentDidMount() {
        await firebase.database().ref("Skill/").once('value', (snap) => {
            let skills = snap.val();
            for (let skill in skills) {
                this.skillsArr.push({
                    skill: skill,
                    pattern: skills[skill].skillPattern,
                    name: skills[skill].name,
                    description: skills[skill].description,
                    image: skills[skill].image,
                    ap: skills[skill].ap,
                    defense: skills[skill].defense,
                    damage: skills[skill].damage,
                    target: skills[skill].target,
                    turns: skills[skill].turns
                });
            }
        });

        await firebase.database().ref("User/" + this.props.user.uid).once('value', (snap) => {
            let user = snap.val();
            this.setState({
                avatarImage: (user && user.image),
                player_skillSet: (user && user.skillSet),
                player_ap: (user && user.ap),
                player_defense: (user && user.defense),
                player_health: (user && user.health),
                player_max_health: (user && user.health),
                player_name: (user && user.name),
                player_image: (user && user.image),
                player_inventory: (user && user.itemsInInventory),
                player_learnedSkills: (user && user.learnedSkills)
            });
        });

        await firebase.database().ref("Virus/" + this.state.currentVirus).once('value', (snap) => {
            let virus = snap.val();
            this.setState({
                virus_skillSet: (virus && virus.skillSet),
                virus_ap: (virus && virus.ap),
                virus_defense: (virus && virus.defense),
                virus_health: (virus && virus.health),
                virus_max_health: (virus && virus.health),
                virus_name: (virus && virus.name),
                virus_loot: (virus && virus.loot),
                virus_learns: (virus && virus.learns),
                virus_storyText: (virus && virus.storyText),
                virus_image1: (virus && virus.image1),
                virus_image2: (virus && virus.image2),
                virus_image3: (virus && virus.image3)
            });
        });
    }
    componentWillMount(){
        this.aiMove(this.state.nextPlayer);
    }

    aiMove(nextVirus) {
        if(!nextVirus) {
            console.log(this.gameReset);
            setTimeout(() => {
                this.gameReset = false;
                let newArray = this.state.allTiles;
                let newArr = [];
                for (let i = 0; i < newArray.length; i++) { newArr = newArr.concat(newArray[i]); }
                // AI's move
                let bestMove = this.getBestMove(newArr);

                if (bestMove === 0) { this.state.id = "0x0"; }
                if (bestMove === 1) { this.state.id = "0x1"; }
                if (bestMove === 2) { this.state.id = "0x2"; }
                if (bestMove === 3) { this.state.id = "1x0"; }
                if (bestMove === 4) { this.state.id = "1x1"; }
                if (bestMove === 5) { this.state.id = "1x2"; }
                if (bestMove === 6) { this.state.id = "2x0"; }
                if (bestMove === 7) { this.state.id = "2x1"; }
                if (bestMove === 8) { this.state.id = "2x2"; }

                let pos = this.state.id.split("x");
                let rowNumber = parseInt(pos[0], 10);
                let tileNumber = parseInt(pos[1], 10);
                let row = this.state.allTiles[rowNumber];
                if (row[tileNumber] === 0) {
                    newArr[bestMove] = 2;

                    let currentArr = [];
                    let counter = 0;
                    for (let i = 0; i < 3; i++) {
                        currentArr[i] = [];
                        for (let j = 0; j < 3; j++) {
                            currentArr[i][j] = newArr[counter++];
                        }
                    }

                    this.setState({
                        allTiles: currentArr,
                    });

                    document.getElementById(this.state.id).src = this.state.gamePieces[2];

                    this.isSkillTriggered(currentArr);

                    if (this.areAllTilesClicked(currentArr) === true) {
                        this.resetGame();
                        return;
                    }
                }
                this.setState({
                    turn: this.state.turn + 1,
                    nextPlayer: true
                });
            }, this.gameReset ? 0 : 200);
        }
    }

    calculateSkillEffects(winner, skill) {
        if(!(this.activatedSkills.includes(skill))){
            this.activatedSkills.push(skill);
            this.alertSkillTrigger();
            let skillsInDB = this.skillsArr;
            for(let skillInDB in skillsInDB){
                if(skill.name === skillsInDB[skillInDB].name){
                    let ap = 1;
                    let defense = 1;
                    let damage = 0;
                    let turns = 0;
                    if(skillsInDB[skillInDB].ap)
                        ap = skillsInDB[skillInDB].ap;
                    if(skillsInDB[skillInDB].defense)
                        defense = skillsInDB[skillInDB].defense;
                    if(skillsInDB[skillInDB].damage)
                        damage = skillsInDB[skillInDB].damage;
                    if(skillsInDB[skillInDB].turns)
                        turns = skillsInDB[skillInDB].turns;
                    if(winner === "X"){
                        if(skillsInDB[skillInDB].target === 0){
                            let player_health = this.state.player_health - this.state.player_ap * damage;
                            if(player_health > this.state.player_max_health){
                                player_health = this.state.player_max_health;
                            }
                            else if(player_health < 0){
                                player_health = 0;
                            }
                            setTimeout(()=>{
                                this.props.animation(0, 0, player_health, skill.name, 0);
                            }, 200);

                            this.setState({
                                player_health: player_health,
                                player_ap: this.state.player_ap * ap,
                                player_defense: this.state.player_defense * defense,
                            });
                            if(turns !== 0){
                                this.startTimerSkillEffect(turns, ap, defense, "player");
                            }
                        }
                        else{
                            let virus_health = this.state.virus_health - this.state.player_ap/this.state.virus_defense * damage;
                            if(virus_health > this.state.virus_max_health){
                                virus_health = this.state.virus_max_health;
                            }
                            else if(virus_health < 0){
                                virus_health = 0;
                            }

                            setTimeout(()=>{
                                this.props.animation(0, 1, virus_health, skill.name, 0);
                            }, 200);

                            this.setState({
                                virus_health: virus_health,
                                virus_ap: this.state.virus_ap * ap,
                                virus_defense: this.state.virus_defense * defense,
                            });
                            if(turns !== 0){
                                this.startTimerSkillEffect(turns, ap, defense, "virus");
                            }
                        }
                    }
                    else {
                        if(this.skillsArr[skillInDB].target === 0){
                            let virus_health = this.state.virus_health - this.state.virus_ap * damage;
                            if(virus_health > this.state.virus_max_health){
                                virus_health = this.state.virus_max_health;
                            }
                            else if(virus_health < 0){
                                virus_health = 0;
                            }

                            setTimeout(()=>{
                                this.props.animation(1, 1, virus_health, skill.name, 0);
                            }, 200);

                            this.setState({
                                virus_health: virus_health,
                                virus_ap: this.state.virus_ap * ap,
                                virus_defense: this.state.virus_defense * defense,
                            });
                            if(turns !== 0){
                                this.startTimerSkillEffect(turns, ap, defense, "virus");
                            }
                        }
                        else{
                            let player_health = this.state.player_health - this.state.virus_ap/this.state.player_defense * damage;
                            if(player_health > this.state.player_max_health){
                                player_health = this.state.player_max_health;
                            }
                            else if(player_health < 0){
                                player_health = 0;
                            }

                            setTimeout(()=>{
                                this.props.animation(1, 0, player_health, skill.name, 0);
                            }, 200);

                            this.setState({
                                player_health: player_health,
                                player_ap: this.state.player_ap * ap,
                                player_defense: this.state.player_defense * defense,
                            });
                            if(turns !== 0){
                                this.startTimerSkillEffect(turns, ap, defense, "player");
                            }
                        }
                    }
                }
            }
        }
    }

    startTimerSkillEffect(turns, ap, defense, target){
        let activeEffects = this.state.activeEffects;
        activeEffects.push({turns: turns+1, ap: ap, defense: defense, target: target});
        this.setState({
            activeEffects: activeEffects
        });
    }
    revertSkillEffect(effect){
        if(effect.target === "player"){
            this.setState({
                player_ap: this.state.player_ap / effect.ap,
                player_defense: this.state.player_defense / effect.defense
            });
        }
        else{
            this.setState({
                virus_ap: this.state.virus_ap / effect.ap,
                virus_defense: this.state.virus_defense / effect.defense
            });
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.state.turn !== prevState.turn){
            let activeEffects = this.state.activeEffects;
            for(let i = 0; i < activeEffects.length; i++){
                if(activeEffects[i].turns === 0){
                    this.revertSkillEffect(activeEffects[i]);
                    activeEffects.splice(i, 1);
                }
                else{
                    activeEffects[i].turns--;
                }
            }
            this.setState({
                activeEffects: activeEffects,
            });
        }
        if(this.state.nextPlayer !== prevState.nextPlayer) {
            this.aiMove(this.state.nextPlayer);
        }
    }

    alertSkillTrigger(skill) {
        const selector = document.querySelector('.yourdiv');
        selector.classList.add('magictime', 'vanishOut');
        setTimeout(() => {
            selector.classList.remove('magictime', 'vanishOut');
        },1200)
    }

    isSkillTriggered(tiles) {
        this.skillsArr.map((skill) => {
            let newArr = [];
            let newArr2 = [];
            for (let i = 0; i < tiles.length; i++) { newArr = newArr.concat(tiles[i]); }
            for (let i = 0; i < skill.pattern.length; i++) { newArr2 = newArr2.concat(skill.pattern[i]); }
            let [d, e, f] = newArr2;

            let nonZero = (newArr[d] !== 0 && newArr[e] !== 0 && newArr[f] !== 0);
            let aiPattern = (newArr[d] === 2 && newArr[e] === 2 && newArr[f] === 2);
            let playerPattern = (newArr[d] === 1 && newArr[e] === 1 && newArr[f] === 1);
            let playerSkillPattern = (!aiPattern && playerPattern && nonZero && newArr[d] === newArr[e] && newArr[d] === newArr[f] && newArr[e] === newArr[f]);
            let aiSkillPattern = (aiPattern && !playerPattern && nonZero && newArr[d] === newArr[e] && newArr[d] === newArr[f] && newArr[e] === newArr[f]);

            if(playerSkillPattern === true) {
                let winner = "X";
                for(let virus_skill in this.state.player_skillSet){
                    if(this.state.player_skillSet.includes(skill.skill)){
                        this.calculateSkillEffects(winner, skill);
                    }
                }

                if(this.state.virus_health <= 0 && !this.gameover){
                    this.gameover = true;
                    if(this.state.currentVirus < 9) {
                        let itemsInInventory = this.state.player_inventory;
                        itemsInInventory.push(this.state.virus_loot);
                        let learnedSkills = this.state.player_learnedSkills;
                        if(this.state.virus_learns)
                            if(!learnedSkills.includes(this.state.virus_learns))
                                learnedSkills.push(this.state.virus_learns);

                        firebase.database().ref("/User/" + this.props.user.uid).once('value', (snap) => {
                            let user = snap.val();
                                let player_ap = (user && user.ap);
                                let player_defense = (user && user.defense);
                                let player_health = (user && user.health);
                            firebase.database().ref('/User/' + this.props.user.uid).update({
                                currentVirus: this.state.currentVirus + 1,
                                health: player_health + 10,
                                ap: player_ap + 2,
                                defense: player_defense + 1,
                                itemsInInventory: itemsInInventory,
                                learnedSkills: learnedSkills
                            });
                        });
                        setTimeout(() => {
                            let learns = "";
                            if(this.state.virus_learns)
                                learns = ", learned: " + this.state.virus_learns;
                            alert("You won! Received " + this.state.virus_loot + learns);
                        },3000);
                    }
                    else {
                        setTimeout(() => {
                            alert("You have defeated every virus");
                        },3000);
                    }
                    setTimeout(() => {
                        window.location.href = "/storyMode";
                    }, 4000);
                }
            }
            if(aiSkillPattern === true) {
                let winner = "O";
                for(let virus_skill in this.state.virus_skillSet){
                    if(this.state.virus_skillSet.includes(skill.skill)){
                        this.calculateSkillEffects(winner, skill);
                    }
                }
                if(this.state.player_health <= 0 && !this.gameover){
                    this.gameover = true;
                    setTimeout(()=> {
                        alert("You lost");
                    },3000);
                    setTimeout(() => {
                        window.location.href = "/storyMode";
                    }, 4000);
                }
            }
        });
    }

    resetGame() {
        setTimeout(() =>{
            this.gameReset = true;
            this.activatedSkills = [];
            this.setState({
                allTiles: [[0,0,0], [0,0,0], [0,0,0]],
                nextPlayer: !this.state.nextPlayer,
            });
            for(let i = 0; i < 3; i++) {
                for(let j = 0; j < 3; j++) {
                    let tile = document.getElementById("" + i + "x" + j + "");
                    tile.src = this.state.gamePieces[0];
                }
            }
        }, 500);
    }

    checkGameWins(tiles, depth) {
        let skills = this.skillsArr.filter((skill) => this.state.virus_skillSet.includes(skill.skill));
        for(let skill in skills){
            const [a,b,c] = skills[skill].pattern;
            if(tiles[a] === tiles[b] && tiles[c] === tiles[a] && tiles[c] === tiles[b]){
                if(tiles[a] === 2){
                    return 100 - depth;
                }
                else if(tiles[a] === 1){
                    return - 100 + depth;
                }
            }
        }
        return 0;
    }

    checkEmptyTiles(tiles) {
        let emptyTiles = [];
        for (let i = 0; i < tiles.length; i++) {
            if (tiles[i] === 0) {
                return emptyTiles.push(i);
            }
        }
        return null;
    }

     // Minimax is an algorithm used in game theory for minimizing
     // the possible loss for a worst case scenario.
     minimaxAlgorithm(position, depth, maximizingPlayer) {
         if(this.checkEmptyTiles(position) === null) {
             return this.checkGameWins(position, depth);
         }

         if (this.checkGameWins(position, depth) !== 0) {
            return this.checkGameWins(position, depth);
        }

         // Maximizing player O
        if(maximizingPlayer) {
            let maxEval = -100;
            // Loops through each position
            for (let i = 0; i < position.length; i++) {
                // Checks if the tile is available
                if (position[i] === 0) {
                    position[i] = 2;
                    // !maximizingPlayer indicates other player's turn to move
                    let nodeValue = this.minimaxAlgorithm(position, depth-1, false);
                    // Checks which is the greatest between the current max evaluation and the evaluation of the child position
                    maxEval = Math.max(maxEval, nodeValue);
                    position[i] = 0;
                }
            }
            return maxEval;
        }
        // Minimizing player X
        else {
            let minEval = 100;
            // Loops through each position
            for (let i = 0; i < position.length; i++) {
                // Checks if the tile is available
                if (position[i] === 0) {
                    position[i] = 1;
                    let nodeValue = this.minimaxAlgorithm(position, depth-1, true);
                    minEval = Math.min(minEval, nodeValue);
                    position[i] = 0;
                }
            }
            return minEval;
        }
    }

    areAllTilesClicked(tiles) {
        // Indicates number of clicked/filled tiles
        let count = 0;
        tiles.forEach(function (tile) {
            for(let i = 0; i < 3; i++) {
                if (tile[i] !== 0) {
                    count = count + 1;
                }
            }
        });

        this.state.counterAI = count;
        if(count === 9) {
            return true
        } else {
            return false
        }
    }

    easyDifficulty(currentPosition) {
        let possibleMoves = [];
        for(let i = 0; i < currentPosition.length; ++i) {
            if(currentPosition[i] === 0) {
                possibleMoves.push(i);
            }
        }
        let randomPosition = Math.floor(Math.random()*possibleMoves.length);

        return possibleMoves[randomPosition];
    }

    hardDifficulty(currentPosition) {
        let bestMove = -1000;
        let bestValue = -1;
        for (let i = 0; i < currentPosition.length; i++) {
            if (currentPosition[i] === 0) {
                currentPosition[i] = 2;
                let move = this.minimaxAlgorithm(currentPosition, 0, false);
                currentPosition[i] = 0;
                if (move > bestMove) {
                    bestMove = move;
                    bestValue = i;
                }

            }
        }
        // returns the best move position
        return bestValue;
    }

    getBestMove(tiles) {
        // Difficulty Selection:
        if (this.props.difficulty === "easy") {
            return this.easyDifficulty(tiles);
        }
        else if (this.props.difficulty === "medium") {
            if (this.state.counterAI < 5) {
                return this.hardDifficulty(tiles);
            }
            else {
                return this.easyDifficulty(tiles);
            }
        }
        else if (this.props.difficulty === "hard") {
            return this.hardDifficulty(tiles);
        }
    }

    drawPieceOnTile = (id) => {
        // Extracts the row number and tile position
        if(this.state.nextPlayer) {
            let pos = id.split("x");
            let rowNumber = parseInt(pos[0], 10);
            let tileNumber = parseInt(pos[1], 10);
            let row = this.state.allTiles[rowNumber];
            let newArray = this.state.allTiles;
            if (row[tileNumber] === 0) {

                newArray[rowNumber][tileNumber] = 1;

                document.getElementById(id).src = this.state.gamePieces[1];

                this.setState({
                    allTiles: newArray,
                });

                this.isSkillTriggered(newArray);

                if (this.areAllTilesClicked(newArray) === true) {
                    this.resetGame();
                    return;
                }
                this.gameReset = false;
                this.setState({
                    turn: this.state.turn + 1,
                    nextPlayer: false
                });

            } else if (row[tileNumber] !== 0) {
                console.log("There is already a piece on this tile.");
            }
        }
    };

    useItem = (item) => {
        if(item.target === 0){
            let player_health = this.state.player_health - item.damage;
            if(player_health > this.state.player_max_health) {
                player_health = this.state.player_max_health;
            }
            else if(player_health < 0){
                player_health = 0;
            }

            setTimeout(()=>{
                this.props.animation(0, 0, player_health, item.name, 1);
            }, 200);
            this.setState({
                player_ap: this.state.player_ap * item.ap,
                player_defense: this.state.player_defense * item.defense,
                player_health: player_health
            });

            if(item.turns !== 0){
                this.startTimerSkillEffect(item.turns, item.ap, item.defense, "player");
            }
        }
        else{
            let virus_health = this.state.virus_health - item.damage;
            if(virus_health > this.state.virus_max_health) {
                virus_health = this.state.virus_max_health;
            }
            else if(virus_health < 0){
                virus_health = 0;
            }

            setTimeout(()=>{
                this.props.animation(0, 1, virus_health, item.name, 1);
            }, 200);

            this.setState({
                virus_ap: this.state.virus_ap * item.ap,
                virus_defense: this.state.virus_defense * item.defense,
                virus_health: virus_health
            });
            if(item.turns !== 0){
               this.startTimerSkillEffect(item.turns, item.ap, item.defense, "virus");
            }
        }
    };

    showModal = () => {
        this.setState({isOpen: true});
    };

    showModal2 = () => {
        this.setState({isOpen2: true});
    };

    hideModal = () => {
        this.setState({isOpen: false});
    };

    hideModal2 = () => {
        this.setState({isOpen2: false});
    };

    render() {
        return (
            <div id="screen">
                <Link><button onClick={this.showModal} id="backButton" className="button" style={{float: "left", marginTop: "-60px"}}>Stats</button></Link>
                <div>
                    <div className="text" style={{width: "200px", border: "2px solid brown", float: "left", backgroundColor:"white"}}>
                        <div style={{marginRight: "110px"}}><img alt="" style={{height: "30px", width: "30px", display: "inline"}} src={bolticon}/><p style={{display: "inline"}}>Ap: {Math.ceil(this.state.player_ap)}</p></div>
                        <div style={{marginRight: "110px"}}><img alt="" style={{height: "20px", width: "30px", display: "inline"}} src={shieldicon}/><p style={{display: "inline"}}>Def: {Math.ceil(this.state.player_defense)}</p></div>
                    </div>
                    <div className="text" style={{width: "200px", border: "2px solid brown", float: "right", backgroundColor:"white"}}>
                        <div style={{marginRight: "110px"}}><img alt="" style={{height: "30px", width: "30px", display: "inline"}} src={bolticon}/><p style={{display: "inline"}}>Ap: {Math.ceil(this.state.virus_ap)}</p></div>
                        <div style={{marginRight: "110px"}}><img alt="" style={{height: "20px", width: "30px", display: "inline"}} src={shieldicon}/><p style={{display: "inline"}}>Def: {Math.ceil(this.state.virus_defense)}</p></div>
                    </div>
                </div>

                <Modal show={this.state.isOpen} onHide={this.hideModal} className={"modalClass2"}>
                    <Modal.Header><span class="text" style={{margin: "auto"}}>STATS</span></Modal.Header>
                    <Modal.Body className={"modalClass"}>
                        <div>
                            <div className="text" style={{marginLeft: "50px"}}>Player: {this.state.avatarName}</div>
                            <div style={{float: "left", width: "100px", height: "100px", marginRight: "10px"}}><img alt="" style={{float: "left", marginRight: "5px", display: "inline", height: "200px", width: "200px"}} src={this.state.avatarImage}/></div>
                            <div style={{float: "left", width: "100px", height: "100px", marginRight: "10px"}}><div style={{margin: "unset", marginRight: "5px", marginLeft: "100px", marginTop: "100px"}}>
                                <InventoryModal user={this.props.user}/>
                            </div></div>

                            <div style={{float: "left", width: "100px", height: "100px", marginRight: "10px"}}><div style={{float: "left", marginRight: "5px"}}><button onClick={this.showModal2}>Your Skills</button></div></div>
                            <Modal show={this.state.isOpen2} onHide={this.hideModal2}>
                                <Modal.Header>Skill Set</Modal.Header>
                                <Modal.Body skillset={this.state.player_skillSet}>
                                    <SkillSet user={this.props.user.uid}/>
                                </Modal.Body>
                                <Modal.Footer>
                                    <button class="button" onClick={this.hideModal2}>Close</button>
                                </Modal.Footer>
                            </Modal>

                        </div>

                        <div className="text" style={{marginTop: "220px", width: "200px", border: "2px solid brown"}}>
                            <div><img alt="" style={{height: "20px", width: "20px", display: "inline", marginLeft: "5px"}} src={hearticon}/><p style={{display: "inline", marginLeft: "5px"}}>Hp: {this.state.player_max_health}</p></div>
                            <div><img alt="" style={{height: "30px", width: "30px", display: "inline"}} src={bolticon}/><p style={{display: "inline"}}>Ap: {Math.ceil(this.state.player_ap)}</p></div>
                            <div><img alt="" style={{height: "20px", width: "30px", display: "inline"}} src={shieldicon}/><p style={{display: "inline"}}>Def: {Math.ceil(this.state.player_defense)}</p></div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button class="button" onClick={this.hideModal}>Close</button>
                    </Modal.Footer>
                </Modal>
                <div className="yourdiv">
                    <PlayingField
                        drawPieceOnTile={this.drawPieceOnTile}
                        gamePieces={this.state.gamePieces}
                        user={this.props.user}
                    />
                </div>
                <div>
                    <SkillSet
                        user={this.props.user.uid}
                    />
                </div>
                <InventoryModal
                    useItem={this.useItem}
                    inGame={true}
                    user={this.props.user}
                    yourTurn={this.state.nextPlayer}
                    player_full_health={this.state.player_health >= this.state.player_max_health}
                />
            </div>
        );
    }

}

export default SingleplayerSession;
