import React, {Component} from "react";
import './MultiplayerSession.css';
import firebase from "../firebaseConfig/firebaseConfig";
import freeSpace from "../PlayingField/blankSpace.jpg";
import symbol from "../PlayingField/cross.png";
import symbol2 from "../PlayingField/circle.png";
import PlayingField from "../PlayingField/PlayingField";
import SkillSet from "../Skills/SkillSet";
import hearticon from "../ViewPlay/hearticon.png";
import bolticon from "../ViewPlay/lightningBolt.png";
import shieldicon from "../ViewPlay/silverShield.png";

class MultiplayerSession extends Component {
    constructor(props) {
        super(props);
        this.state = {
            whoTurnIsIt: this.props.whoIsNext,
            nextPlayer: "X",
            winner: null,

            skillsFromDB: [],
            skillSet: [],
            username: "",

            allTiles: [[0,0,0], [0,0,0], [0,0,0]],
            gamePieces: [freeSpace, symbol, symbol2],
            idx: 0,

            turn: 0,
            activeEffects: [],

            count0: 0,
            count1: 0,
            count2: 0,
            count3: 0,
            count4: 0,
            count5: 0,
            count6: 0,
            count7: 0,
            count8: 0,
            count9: 0,

            player1_health: this.props.player1_health,
            player1_max_health: this.props.player1_max_health,
            player1_ap: this.props.player1_ap,
            player1_defense: this.props.player1_defense,

            player2_health: this.props.player2_health,
            player2_max_health: this.props.player2_max_health,
            player2_ap: this.props.player2_ap,
            player2_defense: this.props.player2_defense,
        };
        this.resetGame = this.resetGame.bind(this);
        this.areAllTilesClicked = this.areAllTilesClicked.bind(this);
        this.winnerExists = this.winnerExists.bind(this);
        this.isSkillTriggered = this.isSkillTriggered.bind(this);
        this.skillIsSet = this.skillIsSet.bind(this);
        this.calculateSkillEffects = this.calculateSkillEffects.bind(this);
        this.drawPieceOnTile = this.drawPieceOnTile.bind(this);
        this.checkPlayerSkills = this.checkPlayerSkills.bind(this);
        this.alertSkillTrigger = this.alertSkillTrigger.bind(this);
    }

    async componentDidMount() {
        await firebase.database().ref("Skill/").once('value', (snap) => {
            let skills = snap.val();
            let skillsArr = [];
            for (let skill in skills) {
                skillsArr.push({
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
                this.setState({
                    skillsFromDB: skillsArr,
                });
            }
        });

        const usersRef = await firebase.database().ref("User/" + this.props.user.uid);
        usersRef.once('value', (snap) => {
            let users = snap.val();
            this.setState({
                skillSet: (users && users.skillSet),
                username: (users && users.username),
            });
        });

        this.props.pubnub.getMessage(this.props.playChannel, (data) => {
            if (data.message.nextPlayer === this.props.fieldPiece) {
                document.getElementById(data.message.index).src = this.state.gamePieces[data.message.idx];
                this.state.nextPlayer = (data.message.piece === symbol)? "O" : "X";

                this.setState({
                    allTiles: data.message.newArray,
                    whoTurnIsIt: !this.state.whoTurnIsIt,
                    idx: data.message.idx,
                });
            }
            if (data.message.resetGame) {
                for(let i = 0; i < 3; i++) {
                    for(let j = 0; j < 3; j++) {
                        let tile = document.getElementById("" + i + "x" + j + "");
                        tile.src = this.state.gamePieces[0];
                    }
                }

                this.setState({
                    allTiles: [[0,0,0], [0,0,0], [0,0,0]],
                    winner: null,
                    count0: 0,
                    count1: 0,
                    count2: 0,
                    count3: 0,
                    count4: 0,
                    count5: 0,
                    count6: 0,
                    count7: 0,
                    count8: 0,
                    count9: 0
                });
            }
            if (data.message.skillIsSet) {
                console.log("data.message.skill.name: ", data.message.skill.name);
                if(data.message.skill.name === "Boiling Water") { this.state.count0 = this.state.count0 + 1; }
                if(data.message.skill.name === "Vaccine Shot") { this.state.count1 = this.state.count1 + 1; }
                if(data.message.skill.name === "Rest") { this.state.count2 = this.state.count2 + 1; }
                if(data.message.skill.name === "Sanitizer") { this.state.count3 = this.state.count3 + 1; }
                if(data.message.skill.name === "Adrenaline Injection") { this.state.count4 = this.state.count4 + 1; }
                if(data.message.skill.name === "Punch") { this.state.count5 = this.state.count5 + 1; }
                if(data.message.skill.name === "Kick") { this.state.count6 = this.state.count6 + 1; }
                if(data.message.skill.name === "Anti-Virus Shield") { this.state.count7 = this.state.count7 + 1; }
                if(data.message.skill.name === "Dry Ice Cage") { this.state.count8 = this.state.count8 + 1; }

                this.calculateSkillEffects(data.message.winner, data.message.skill);
            }
            if(data.message.someoneWon) {
                if(data.message.winner === "O") {
                    if(this.props.roomJoiner) {
                        setTimeout(()=> {
                            alert("You won");
                        },1000)
                    }
                    if(this.props.roomCreator) {
                        setTimeout(()=> {
                            alert("You lost");
                        },1000)
                    }
                }
                else {
                    if(this.props.roomCreator) {
                        setTimeout(()=> {
                            alert("You won");
                        },1000)
                    }
                    if(this.props.roomJoiner) {
                        setTimeout(()=> {
                            alert("You lost");
                        },1000)
                    }
                }
            }
        });
    }

    calculateSkillEffects(winner, skill) {
        this.alertSkillTrigger();
        let skillsInDB = this.state.skillsFromDB;
            for (let skillInDB in skillsInDB) {
                if (skill.name === skillsInDB[skillInDB].name) {
                    let ap = 1;
                    let defense = 1;
                    let damage = 0;
                    let turns = 0;
                    if (skillsInDB[skillInDB].ap)
                        ap = skillsInDB[skillInDB].ap;
                    if (skillsInDB[skillInDB].defense)
                        defense = skillsInDB[skillInDB].defense;
                    if (skillsInDB[skillInDB].damage)
                        damage = skillsInDB[skillInDB].damage;
                    if (skillsInDB[skillInDB].turns)
                        turns = skillsInDB[skillInDB].turns;
                    if (winner === "X") {
                        if (skillsInDB[skillInDB].target === 0) {
                            let player1_health = this.state.player1_health - this.state.player1_ap * damage;
                            if (player1_health > this.state.player1_max_health) {
                                player1_health = this.state.player1_max_health;
                            } else if (player1_health < 0) {
                                player1_health = 0;
                            }
                            setTimeout(() => {
                                this.props.animation(0, 0, player1_health, skill.name, 0);
                            }, 200);

                            this.setState({
                                player1_health: player1_health,
                                player1_ap: this.state.player1_ap * ap,
                                player1_defense: this.state.player1_defense * defense,
                            });
                            if (turns !== 0) {
                                this.startTimerSkillEffect(turns, ap, defense, "player1");
                            }
                        } else {
                            let player2_health = this.state.player2_health - this.state.player1_ap / this.state.player2_defense * damage;
                            if (player2_health > this.state.player2_max_health) {
                                player2_health = this.state.player2_max_health;
                            } else if (player2_health < 0) {
                                player2_health = 0;
                            }

                            setTimeout(() => {
                                this.props.animation(0, 1, player2_health, skill.name, 0);
                            }, 200);

                            this.setState({
                                player2_health: player2_health,
                                player2_ap: this.state.player2_ap * ap,
                                player2_defense: this.state.player2_defense * defense,
                            });
                            if (turns !== 0) {
                                this.startTimerSkillEffect(turns, ap, defense, "player2");
                            }
                        }
                    } else {
                        if (this.state.skillsFromDB[skillInDB].target === 0) {
                            let player2_health = this.state.player2_health - this.state.player2_ap * damage;
                            if (player2_health > this.state.player2_max_health) {
                                player2_health = this.state.player2_max_health;
                            } else if (player2_health < 0) {
                                player2_health = 0;
                            }

                            setTimeout(() => {
                                this.props.animation(1, 1, player2_health, skill.name, 0);
                            }, 200);

                            this.setState({
                                player2_health: player2_health,
                                player2_ap: this.state.player2_ap * ap,
                                player2_defense: this.state.player2_defense * defense,
                            });
                            if (turns !== 0) {
                                this.startTimerSkillEffect(turns, ap, defense, "player2");
                            }
                        } else {
                            let player1_health = this.state.player1_health - this.state.player2_ap / this.state.player1_defense * damage;
                            if (player1_health > this.state.player1_max_health) {
                                player1_health = this.state.player1_max_health;
                            } else if (player1_health < 0) {
                                player1_health = 0;
                            }

                            setTimeout(() => {
                                this.props.animation(1, 0, player1_health, skill.name, 0);
                            }, 200);

                            this.setState({
                                player1_health: player1_health,
                                player1_ap: this.state.player1_ap * ap,
                                player1_defense: this.state.player1_defense * defense,
                            });
                            if (turns !== 0) {
                                this.startTimerSkillEffect(turns, ap, defense, "player1");
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

    revertSkillEffect(effect) {
        console.log(effect.target);
        if(effect.target === "player1"){
            this.setState({
                player1_ap: this.state.player1_ap / effect.ap,
                player1_defense: this.state.player1_defense / effect.defense
            });
        }
        else{
            this.setState({
                player2_ap: this.state.player2_ap / effect.ap,
                player2_defense: this.state.player2_defense / effect.defense
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
                activeEffects: activeEffects
            })
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

        if (count === 9) {
            return true
        } else {
            return false
        }
    }

    winnerExists(winner) {
        // Does a winner exists?
        if(winner !== null) {
            return true;
        } else {
            return false;
        }
    }

    alertSkillTrigger() {
        const selector = document.querySelector('.yourdiv');
        selector.classList.add('magictime', 'vanishOut');
        setTimeout(() => {
            selector.classList.remove('magictime', 'vanishOut');
        },1200)
    }

    checkPlayerSkills(winner, skill) {
        if (this.state.skillSet.includes(skill.skill = "boiling-water") && skill.name === "Boiling Water" && this.state.count0 < 1) {
            this.skillIsSet(winner, skill);
        }
        if(this.state.skillSet.includes(skill.skill = "vaccine-shot") && skill.name === "Vaccine Shot" && this.state.count1 < 1) {
            this.skillIsSet(winner, skill);
        }
        if (this.state.skillSet.includes(skill.skill = "rest") && skill.name === "Rest" && this.state.count2 < 1) {
            this.skillIsSet(winner, skill);
        }
        if(this.state.skillSet.includes(skill.skill = "sanitizer") && skill.name === "Sanitizer" && this.state.count3 < 1) {
            this.skillIsSet(winner, skill);
        }
        if(this.state.skillSet.includes(skill.skill = "adrenaline-injection") && skill.name === "Adrenaline Injection" && this.state.count4 < 1) {
            this.skillIsSet(winner, skill);
        }
        if(this.state.skillSet.includes(skill.skill = "punch") && skill.name === "Punch" && this.state.count5 < 1) {
            this.skillIsSet(winner, skill);
        }
        if(this.state.skillSet.includes(skill.skill = "kick") && skill.name === "Kick" && this.state.count6 < 1) {
            this.skillIsSet(winner, skill);
        }
        if(this.state.skillSet.includes(skill.skill = "anti-virus-shield") && skill.name === "Anti-Virus Shield" && this.state.count7 < 1) {
            this.skillIsSet(winner, skill);
        }
        if(this.state.skillSet.includes(skill.skill = "dry-ice-cage") && skill.name === "Dry Ice Cage" && this.state.count8 < 1) {
            this.skillIsSet(winner, skill);
        }
    }

    isSkillTriggered(tiles) {
        this.state.skillsFromDB.map((skill) => {
                let newArr = [];
                let newArr2 = [];
                for (let i = 0; i < tiles.length; i++) { newArr = newArr.concat(tiles[i]); }
                for (let i = 0; i < skill.pattern.length; i++) { newArr2 = newArr2.concat(skill.pattern[i]); }
                let [d, e, f] = newArr2;

                let nonZero = (newArr[d] !== 0 && newArr[e] !== 0 && newArr[f] !== 0);
                let playerO_Pattern = (newArr[d] === 2 && newArr[e] === 2 && newArr[f] === 2);
                let playerX_Pattern = (newArr[d] === 1 && newArr[e] === 1 && newArr[f] === 1);
                let certainSkillPattern = ((playerO_Pattern || playerX_Pattern) && nonZero && newArr[d] === newArr[e] && newArr[d] === newArr[f] && newArr[e] === newArr[f]);
                if (certainSkillPattern === true && this.state.username) {
                    let whoIsWinner = newArr[d];
                    let winner;
                    if (whoIsWinner === 1) {
                        winner = "X";
                    } else if (whoIsWinner === 2) {
                        winner = "O";
                    }
                    this.state.winner = winner;

                    this.checkPlayerSkills(winner, skill);
                }

            if(this.areAllTilesClicked(tiles) === true) {
                this.resetGame();
            }
        });
    };

    whoWon(winner) {
        this.props.pubnub.publish({
            message: {
                someoneWon: true,
                winner: winner,
            },
            channel: this.props.playChannel
        });
    }

    skillIsSet(winner, skill) {
        this.props.pubnub.publish({
            message: {
                skillIsSet: true,
                winner: winner,
                skill: skill
            },
            channel: this.props.playChannel
        });
    }

    resetGame() {
        this.props.pubnub.publish({
            message: {
                resetGame: true
            },
            channel: this.props.playChannel
        });
    }

    drawPieceOnTile = (id) => {
        // Extracts the row number and tile position
        let pos = id.split("x");
        let rowNumber = parseInt(pos[0], 10);
        let tileNumber = parseInt(pos[1], 10);
        let row = this.state.allTiles[rowNumber];
        let newArray = this.state.allTiles;
        if (row[tileNumber] === 0 && this.state.nextPlayer === this.props.fieldPiece) {
            newArray[rowNumber][tileNumber] = (this.state.nextPlayer === "X") ? 1 : 2;

            this.setState({
                allTiles: newArray,
                whoTurnIsIt: !this.state.whoTurnIsIt
            });

            this.state.nextPlayer = (this.state.nextPlayer === "X") ? "O" : "X";

            if(this.state.idx === 0) {
                this.state.idx = this.state.idx + 1;
            } else if (this.state.idx === 1) {
                this.state.idx = this.state.idx + 1;
            } else if (this.state.idx === 2) {
                this.state.idx = this.state.idx - 1;
            }
            let piece = document.getElementById(id).src = this.state.gamePieces[this.state.idx];
            this.props.pubnub.publish({
                message: {
                    index: id,
                    fieldPiece: this.props.fieldPiece,
                    nextPlayer: this.state.nextPlayer,
                    idx: this.state.idx,
                    piece: piece,
                    newArray: newArray,
                },
                channel: this.props.playChannel
            });

            this.isSkillTriggered(newArray);
        }
        else if (row[tileNumber] !== 0) {
            //alert("There is already a piece on this tile.")
        }
    };

    render() {
        if(this.state.player1_health <= 0 || this.state.player2_health <= 0 && this.state.count9 < 1) {
            this.setState({
                count9: this.state.count9 + 1
            });
            this.whoWon(this.state.winner);   // BUG: whoWon() is called twice
            setTimeout(()=> {
                this.state.player1_health = 100;
                this.state.player2_health = 100;
            },1000);
            setTimeout(()=> {
                this.resetGame();
            },2000);
        }
        let turnStatus = "Next player: " + ((this.state.nextPlayer === "X") ? this.props.userX : this.props.userO);
        return (
            <div>
                <div className="status" class="text">{turnStatus}</div>
                <div className="text" style={{width: "200px", border: "2px solid brown", float: "left"}}>
                    <div style={{marginRight: "110px"}}><img alt="" style={{height: "20px", width: "20px", display: "inline", marginLeft: "5px"}} src={hearticon}/><p style={{display: "inline", marginLeft: "5px"}}>Hp: {this.state.player1_health}</p></div>
                    <div style={{marginRight: "110px"}}><img alt="" style={{height: "30px", width: "30px", display: "inline"}} src={bolticon}/><p style={{display: "inline"}}>Ap: {this.state.player1_ap}</p></div>
                    <div style={{marginRight: "110px"}}><img alt="" style={{height: "20px", width: "30px", display: "inline"}} src={shieldicon}/><p style={{display: "inline"}}>Def: {this.state.player1_defense}</p></div>
                </div>
                <div className="text" style={{width: "200px", border: "2px solid brown", float: "right"}}>
                    <div style={{marginRight: "110px"}}><img alt="" style={{height: "20px", width: "20px", display: "inline", marginLeft: "5px"}} src={hearticon}/><p style={{display: "inline", marginLeft: "5px"}}>Hp: {this.state.player2_health}</p></div>
                    <div style={{marginRight: "110px"}}><img alt="" style={{height: "30px", width: "30px", display: "inline"}} src={bolticon}/><p style={{display: "inline"}}>Ap: {this.state.player2_ap}</p></div>
                    <div style={{marginRight: "110px"}}><img alt="" style={{height: "20px", width: "30px", display: "inline"}} src={shieldicon}/><p style={{display: "inline"}}>Def: {this.state.player2_defense}</p></div>
                </div>
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
            </div>
        );
    }
}
export default MultiplayerSession;