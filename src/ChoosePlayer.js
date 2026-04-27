import React, {Component} from "react";
import {Link} from "react-router-dom";
import './ChoosePlayer.css';
import firebase, {auth} from "./firebaseConfig/firebaseConfig";
import PlayerBoy1 from './Sprites/PlayerBoy1.png';
import PlayerGirl1 from './Sprites/PlayerGirl1.png';
import "./Styles/stylesheet.css";

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: "",
            image: "",
            isPlayerChosen: false,
            playersFromDB: [],
            name: ""
        };
        this.choosePlayerBoy = this.choosePlayerBoy.bind(this);
        this.choosePlayerGirl = this.choosePlayerGirl.bind(this);
        this.writeToDatabase = this.writeToDatabase.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    async componentDidMount() {
        await auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({user});
            }
        });

        const playerChoiceRef = await firebase.database().ref("User/");
        playerChoiceRef.once('value', (snap) => {
            let players = snap.val();
            let newState = [];
            for (let player in players) {
                newState.push({
                    id: player,
                    playerImage: players[player].image,
                    playerName: players[player].name,
                    user: players[player].username,
                });

            }
            this.setState({
                playersFromDB: newState
            });
        });
    }

    async choosePlayerBoy() {
        if(this.state.user.uid) {
            if (firebase.database().ref('/User/' + this.state.user.uid)) {
                firebase.database().ref('/User/' + this.state.user.uid).update({
                    image: PlayerBoy1,
                    username: this.state.user.displayName
                });
            }
        }

        this.setState({
            isPlayerChosen: !this.state.isPlayerChosen,
        });

        this.componentDidMount();
    }

    async choosePlayerGirl() {
        if(this.state.user.uid) {
            if (firebase.database().ref('/User/' + this.state.user.uid)) {
                firebase.database().ref('/User/' + this.state.user.uid).update({
                    image: PlayerGirl1,
                    username: this.state.user.displayName
                });

            }
        }

        this.setState({
            isPlayerChosen: !this.state.isPlayerChosen,
        });

        this.componentDidMount();
    }

    handleChange(event) {
        this.setState({name: event.target.value});
    };

    writeToDatabase(e) {
        if (this.state.user.uid) {
            if (firebase.database().ref('/User/' + this.state.user.uid)) {
                firebase.database().ref('/User/' + this.state.user.uid).update({
                    name: this.state.name,
                    itemsInInventory: ["healing-potion", "healing-potion"],
                    learnedSkills: ["punch", "kick"],
                    skillSet: ["punch", "kick"],
                    currentVirus: 0,
                    ap: 40,
                    health: 100,
                    defense: 10,
                    difficulty: "easy"
                });
            }
        }
        e.preventDefault();
        this.componentDidMount();
    }

    render() {
        let userDisplayName = this.state.user ? this.state.user.displayName : " ";
        let players;

        players = this.state.playersFromDB.map(player => (
            <div key={player.id}>
                {(player.user === userDisplayName) ?
                    <div>
                        <div>
                            <p class="text"><b>You have chosen an avatar:</b></p>
                            <div class="text">You are {player.playerName} now!</div>
                            <img className=
                                     {
                                         (player.playerImage === PlayerGirl1 ? "playerGirl" : "") +
                                         (player.playerImage === PlayerBoy1 ? "playerBoy"  : "")
                                     }
                                 src={player.playerImage} alt={"Choose Character"}></img>
                        </div>

                    </div>
                    : ""}
            </div>
        ));
        return (
            <div>
                <div id="screen">
                    <Link to="/"><button id="backButton" class="button">Go Back</button></Link>
                    <div>
                        {this.state.user ?
                            <div>
                                <p class="Title">Choose player:</p>
                                <div>
                                    <a onClick={this.choosePlayerBoy}><img className="playerBoy" src={PlayerBoy1} alt="PlayerBoy1"></img></a>
                                    <a onClick={this.choosePlayerGirl}><img className="playerGirl" src={PlayerGirl1} alt="PlayerGirl1"></img></a>
                                </div>
                                <form>
                                    <label>
                                        <span class="text">Name:</span>
                                        <input type="text" value={this.state.name} onChange={e => this.handleChange(e)}/>
                                    </label>
                                    <button class="button"onClick={this.writeToDatabase}>Add new name</button>
                                </form>
                                {(this.state.isPlayerChosen === true) ?
                                    <div>{players}</div>
                                    :
                                    <div>{players}</div>
                                }
                            </div>
                            : <p class="Title">Please Login</p>
                        }
                    </div>
                </div>
            </div>
        );
    }

}

export default Menu;
