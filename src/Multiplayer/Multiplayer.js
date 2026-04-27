import React, {Component} from 'react';
import PubNubReact from 'pubnub-react';
import './Multiplayer.css';
import firebase, { auth } from "./../firebaseConfig/firebaseConfig";
import {Link} from "react-router-dom";
import nextId from 'shortid';
import MultiplayerSession from "./../PlaySession/MultiplayerSession";
import "./../PlaySession/MultiplayerSession.css";
import Modal from 'react-bootstrap/Modal';
import "bootstrap/dist/css/bootstrap.min.css";
import LearnedSkills from "./../Skills/LearnedSkills";
import './../Skills/Skill.css';
import { animateScroll } from "react-scroll";
import "../Styles/stylesheet.css";
import SkillSet from "../Skills/SkillSet";
import hearticon from "../ViewPlay/hearticon.png";
import bolticon from "../ViewPlay/lightningBolt.png";
import shieldicon from "../ViewPlay/silverShield.png";
import Playwindow from "../ViewPlay/Playwindow";
import InventoryModal from "../Inventory/InventoryModal";

class Multiplayer extends Component {
    constructor(props) {
        super(props);
        this.pubnub = new PubNubReact({
            publishKey: "pub-c-d04d0096-c592-4131-8959-2c0501c7662f",
            subscribeKey: "sub-c-d3e8f422-74e4-11ea-a82c-c221c809d7fa"
        });

        this.state = {
            status: "LOADING",
            roomChannel: null,
            playChannel: null,
            roomID: null,
            disableButton: false,
            disableButton2: false,
            disableButton3: false,
            displayBoard: false,
            roomJoiner: false,
            roomCreator: false,
            user: "",
            x_User: "",
            o_User: "",
            fieldPiece: "",
            isStartButtonPressed: false,
            whoIsNext: false,
            disableStartButton: false,
            input: null,
            text: "",
            username: "",
            userImage: "",
            x_avatarName: "",
            x_avatarImage: "",
            o_avatarName: "",
            o_avatarImage: "",
            skillSet: [],
            isOpen: false,
            isOpen2: false,
            isOpen3: false,

            player1_health: 100,
            player1_max_health: 100,
            player1_ap: "",
            player1_defense: "",

            player2_health: 100,
            player2_max_health: 100,
            player2_ap: "",
            player2_defense: "",
        };
        this.pressJoinRoomButton = this.pressJoinRoomButton.bind(this);
        this.pressCreateRoomButton = this.pressCreateRoomButton.bind(this);
        //this.pressExitRoomJoinerButton = this.pressExitRoomJoinerButton.bind(this);
        this.pressExitRoomButton = this.pressExitRoomButton.bind(this);
        this.pressStartGameButton = this.pressStartGameButton.bind(this);
        //this.exitRoom = this.exitRoom.bind(this);
        this.startGame = this.startGame.bind(this);
        this.leaveGame = this.leaveGame.bind(this);
        this.handleJoinRoom = this.handleJoinRoom.bind(this);
        this.chatApplication = this.chatApplication.bind(this);
        this.enter = this.enter.bind(this);
        this.printMessage = this.printMessage.bind(this);
        this.openForm = this.openForm.bind(this);
        this.closeForm = this.closeForm.bind(this);
        this.pubnub.init(this);
    }

    enter(event) {
        if (event.charCode === 13) {
            this.pubnub.publish ({
                channel : this.state.roomChannel,
                message: {
                    chat: true,
                    text: this.state.input.value,
                    username: this.state.user,
                    userImage: this.state.user
                },
                x : (this.state.input.value = "")
            });
        }
    }

    async componentDidMount() {
        await auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    user,
                });
            }
        });

        setTimeout(() => {
            firebase.database().ref("/User/" + this.state.user.uid).once('value', (snap) => {
                let users = snap.val();
                this.setState({
                    avatarImage: (users && users.image),
                    avatarName: (users && users.name),
                    skillSet: (users && users.skillSet),

                    player_ap: (users && users.ap),
                    player_defense: (users && users.defense),
                    player_health: (users && users.health),
                    player_max_health: (users && users.health),
                });
            });
        },1000);


        this.pubnub.subscribe({
            channels: [this.state.roomChannel],
            withPresence: true
        });

        if (this.state.roomChannel != null) {
            this.pubnub.getMessage(this.state.roomChannel, (data) => {
                console.log(data.message.avatarImage);
                if (data.message.roomCreator) {
                    this.setState({
                        status: "LOADED",
                        displayBoard: true,
                        x_User: data.message.user,
                        x_avatarName: data.message.avatarName,
                        x_avatarImage: data.message.avatarImage,
                        player1_health: data.message.player1_health,
                        player1_ap: data.message.player1_ap,
                        player1_max_health: data.message.player1_max_health,
                        player1_defense: data.message.player1_defense
                    });
                }
                else if (data.message.roomJoiner) {
                    this.state.playChannel = "playChannel: " + this.state.roomID;

                    this.pubnub.subscribe({
                        channels: [this.state.playChannel]
                    });

                    this.setState({
                        status: "LOADED",
                        displayBoard: true,
                        //o_UserLeft: false,
                        disableStartButton: false,
                        o_User: data.message.user,
                        o_avatarName: data.message.avatarName,
                        o_avatarImage: data.message.avatarImage,
                        player2_health: data.message.player2_health,
                        player2_ap: data.message.player2_ap,
                        player2_max_health: data.message.player2_max_health,
                        player2_defense: data.message.player2_defense
                    });
                }
                /*else if (data.message.exitRoom) {
                    this.exitRoom();
                }*/
                else if (data.message.startGame) {
                    this.startGame();
                }
                else if (data.message.leaveGame) {
                    this.leaveGame();
                }
                else if (data.message.chat) {
                    this.setState({
                        text: data.message.text,
                        username: data.message.username.displayName,
                        userImage: data.message.userImage.photoURL
                    });
                    this.printMessage();
                }
            });
        }
    }

    handleJoinRoom(e) {
        this.setState({roomID: e.target.value}, this.componentDidMount);
    }

    // Join a room channel
    pressJoinRoomButton() {
        if (this.state.roomID) {
            this.state.roomChannel = 'roomChannel: ' + this.state.roomID;

            this.pubnub.hereNow({
                channels: [this.state.roomChannel],
                includeUUIDs: true,
                includeState: true
            }, (_, response) => {
                if (response.totalOccupancy < 2) {
                    this.pubnub.subscribe({
                        channels: [this.state.roomChannel],
                        withPresence: true
                    });

                    this.setState({
                        status: "LOADING",
                        fieldPiece: "O",
                        roomJoiner: true,
                        disableStartButton: false,
                        whoIsNext: false,
                    });

                    this.pubnub.publish({
                        message: {
                            roomJoiner: true,
                            user: this.state.user.displayName,
                            avatarName: this.state.avatarName,
                            avatarImage: this.state.avatarImage,
                            player2_ap: this.state.player_ap,
                            player2_health: this.state.player_health,
                            player2_max_health: this.state.player_max_health,
                            player2_defense: this.state.player_defense
                        },
                        channel: this.state.roomChannel
                    });

                } else {
                    this.setState({
                        displayBoard: false
                    });
                    alert("This room is taken. Try another.");
                }
            });
        }
        this.componentDidMount();
    };

    // Create a room channel
    pressCreateRoomButton() {
        this.state.roomID = nextId();
        this.state.roomChannel = 'roomChannel: ' + this.state.roomID;

        this.pubnub.subscribe({
            channels: [this.state.roomChannel],
            withPresence: true
        });

        alert(this.state.roomID);

        this.setState({
            status: "LOADING",
            disableButton: true,
            fieldPiece: "X",
            whoIsNext: true,
            roomCreator: true,
        });

        this.pubnub.publish({
            message: {
                roomCreator: true,
                user: this.state.user.displayName,
                avatarName: this.state.avatarName,
                avatarImage: this.state.avatarImage,
                player1_ap: this.state.player_ap,
                player1_health: this.state.player_health,
                player1_max_health: this.state.player_max_health,
                player1_defense: this.state.player_defense
            },
            channel: this.state.roomChannel
        });

        this.componentDidMount();
    };

    pressStartGameButton() {
        this.pubnub.publish({
            message: {
                startGame: true
            },
            channel: this.state.roomChannel
        });
    }

    pressExitRoomButton() {
        this.pubnub.publish({
            message: {
                leaveGame: true
            },
            channel: this.state.roomChannel
        });
    };

    startGame() {
        if (this.state.o_User !== "") {
            this.setState({
                isStartButtonPressed: true,
            });

            this.pubnub.subscribe({
                channels: [this.state.roomChannel]
            });

            this.componentDidMount();
        }
        else if (this.state.o_User === "") {
            alert("Player 2 is missing.");
            this.setState({
                disableStartButton: true
            });
        }
    }

    leaveGame() {
        this.setState({
            roomChannel: null,
            roomID: null,
            disableButton: false,
            disableButton2: false,
            disableButton3: false,
            displayBoard: false,
            roomJoiner: false,
            roomCreator: false,
            playChannel: null,
            user: "",
            x_User: "",
            o_User: "",
            isStartButtonPressed: false,
            fieldPiece: "",
            whoIsNext: false,
            disableStartButton: false,
            input: null,
            text: "",
            username: "",
            userImage: "",
            x_avatarName: "",
            x_avatarImage: "",
            o_avatarName: "",
            o_avatarImage: "",
            status: "LOADING",
            skillSet: [],
            isOpen: false,
            isOpen2: false,
            isOpen3: false
        });

        this.pubnub.unsubscribe({
            channels: [this.state.roomChannel, this.state.playChannel]
        });

        this.componentDidMount();
    }

    componentWillUnmount() {
        this.pubnub.unsubscribe({
            channels: [this.state.roomChannel, this.state.playChannel]
        });
    }

    chatApplication(e) {
        let input = document.getElementById("chatInput");

        this.pubnub.subscribe({
            channels: [this.state.roomChannel]
        });

        this.state.input = input;
        input.addEventListener('keypress', this.enter);
    }

    printMessage() {
        let box = document.getElementById("chatBox");
        let div = document.createElement("div");
        div.className = "containerChat darker";

        let span = document.createElement("span");
        span.className = "time-left";
        span.innerHTML = this.state.username + ": ";

        let p = document.createElement("p");
        p.innerHTML = this.state.text;

        let img = document.createElement("img");
        img.className = "right userImg";
        img.src = this.state.userImage;

        div.appendChild(img);
        div.appendChild(span);
        div.appendChild(p);
        box.appendChild(div);

        this.scrollToBottom();
    }

    scrollToBottom() {
        animateScroll.scrollToBottom({
            containerId: "chatBox"
        });
    }

    openForm() {
        document.getElementById("myForm").style.display = "block";
        document.getElementById("openButton").style.display = "none";
    }

    closeForm() {
        document.getElementById("myForm").style.display = "none";
        document.getElementById("openButton").style.display = "block";
    }

    showModal = () => {
        this.setState({isOpen: true});
    };

    showModal2 = () => {
        this.setState({isOpen2: true});
    };

    showModal3 = () => {
        this.setState({isOpen3: true});
    };

    hideModal = () => {
        this.setState({isOpen: false});
    };

    hideModal2 = () => {
        this.setState({isOpen2: false});
    };

    hideModal3 = () => {
        this.setState({isOpen3: false});
    };

    render() {
        if(this.state.roomCreator) {
            this.state.disableButton2 = false;
            this.state.disableButton3 = true;
        }
        if(this.state.roomJoiner) {
            this.state.disableButton2 = true;
            this.state.disableButton3 = false;
        }
        let text = null;
        let loader = null;
        switch (this.state.status) {
            case "LOADING":
                loader =
                    <div className="outer-loader">
                        <div className="spinner"/>
                        <div className="overlay-loader"/>
                    </div>;
                break;
            case "LOADED":
                text = <div>
                    {(this.state.displayBoard === true && this.state.avatarName) ?
                        <div id="display">
                            <div>
                                <Modal show={this.state.isOpen2} onHide={this.hideModal2} className={"modalClass2"}>
                                    <Modal.Header><span class="text" style={{margin: "auto"}}>STATS</span></Modal.Header>
                                    <Modal.Body className={"modalClass"}>
                                        <div>
                                            <div className="text" style={{marginLeft: "50px"}}>Player: {this.state.avatarName}</div>
                                            <div style={{float: "left", width: "100px", height: "100px", marginRight: "10px"}}><img alt="" style={{float: "left", marginRight: "5px", display: "inline", height: "200px", width: "200px"}} src={this.state.avatarImage}/></div>
                                            <div style={{float: "left", width: "100px", height: "100px", marginRight: "10px"}}><div style={{margin: "unset", marginRight: "5px", marginLeft: "100px", marginTop: "100px"}}>
                                                <InventoryModal user={this.state.user}/>
                                            </div></div>

                                            <div style={{float: "left", width: "100px", height: "100px", marginRight: "10px"}}><div style={{float: "left", marginRight: "5px"}}><button onClick={this.showModal3}>Your Skills</button></div></div>
                                            <Modal show={this.state.isOpen3} onHide={this.hideModal3}>
                                                <Modal.Header>Skill Set</Modal.Header>
                                                <Modal.Body skillset={this.state.skillSet}>
                                                    <SkillSet user={this.state.user.uid}/>
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <button class="button" onClick={this.hideModal3}>Close</button>
                                                </Modal.Footer>
                                            </Modal>

                                        </div>

                                        <div className="text" style={{marginTop: "220px", width: "200px", border: "2px solid brown"}}>
                                            <div><img alt="" style={{height: "20px", width: "20px", display: "inline", marginLeft: "5px"}} src={hearticon}/><p style={{display: "inline", marginLeft: "5px"}}>Hp: {this.state.player_max_health}</p></div>
                                            <div><img alt="" style={{height: "30px", width: "30px", display: "inline"}} src={bolticon}/><p style={{display: "inline"}}>Ap: {this.state.player_ap}</p></div>
                                            <div><img alt="" style={{height: "20px", width: "30px", display: "inline"}} src={shieldicon}/><p style={{display: "inline"}}>Def: {this.state.player_defense}</p></div>
                                        </div>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <button class="button" onClick={this.hideModal2}>Close</button>
                                    </Modal.Footer>
                                </Modal>
                                {/*
                                <div className="avatarLeft">
                                    <div class="text">Avatar X: {this.state.x_avatarName}</div>
                                    <button style={{border: "none", background: "none"}} onClick={this.showModal2} disabled={this.state.disableButton2}><img alt="" className="userImg playerImg" src={this.state.x_avatarImage}/></button>
                                </div>

                                <div className="avatarRight">
                                    <div class="text">Avatar O: {this.state.o_avatarName}</div>
                                    <button style={{border: "none", background: "none"}} onClick={this.showModal2} disabled={this.state.disableButton3}><img alt="" className="right userImg playerImg flipImg" src={this.state.o_avatarImage} /></button>
                                </div>
*/}
                            </div>
                            <div class="text">Player X: {this.state.x_User}</div>
                            <div class="text">Player O: {this.state.o_User}</div>
                            <div class="text">{this.state.roomChannel}</div>
                            <div>
                                {(this.state.isStartButtonPressed === false) ?
                                    <div>
                                        <div className="chatApp">
                                            <button id="openButton" className="open-button"onClick={this.openForm}>Chat</button>
                                            <div className="chat-popup" id="myForm">
                                                <p class="text">Enter message and press enter.</p>
                                                <label htmlFor="msg"><b>Chat Input</b></label>
                                                <div>
                                                    <input id="chatInput" type="text" placeholder="Your Message Here" onClick={e => this.chatApplication(e)}/>
                                                </div>
                                                <p><b>Chat Output:</b></p>
                                                <div id="chatBox"></div>
                                                <button type="button" style={
                                                    {backgroundColor: "darkred",
                                                        padding: "16px 20px",
                                                        width: "100%",
                                                        marginBottom: "10px",
                                                        opacity: 0.8,
                                                        cursor: "pointer" }}
                                                        className="cancelBtn" onClick={this.closeForm}>Close
                                                </button>
                                            </div>
                                        </div>
                                        <div id="screen">
                                            <button id="selectBtn" className="button" type="submit" disabled={this.state.disableStartButton} onClick={this.pressStartGameButton}>Start Game</button>
                                            <button id="selectBtn" className="button" type="submit" onClick={this.showModal}>Choose Skillset</button>
                                            <Modal show={this.state.isOpen} onHide={this.hideModal}>
                                                <Modal.Header><p class="text">{this.state.avatarName}'s learned skills</p></Modal.Header>
                                                <Modal.Body skillset={this.state.skillSet}>
                                                    <LearnedSkills
                                                        user={this.state.user.uid}
                                                        displayUserName={this.state.user.displayName}
                                                    />
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <button class="button" onClick={this.hideModal}>Close</button>
                                                </Modal.Footer>
                                            </Modal>
                                            <div><button id="selectBtn" className="button" type="submit" onClick={this.pressExitRoomButton}>Exit Room</button></div>
                                        </div>
                                    </div>
                                    :
                                    <div>
                                        <Playwindow
                                            otherPlayer_o={this.state.o_avatarImage}
                                            otherPlayer_x={this.state.x_avatarImage}
                                            Multiplayer={true}
                                            user={this.state.user}
                                            playChannel={this.state.playChannel}
                                            pubnub={this.pubnub}
                                            userX={this.state.x_User}
                                            userO={this.state.o_User}
                                            fieldPiece={this.state.fieldPiece}
                                            whoIsNext={this.state.whoIsNext}
                                            roomJoiner={this.state.roomJoiner}
                                            roomCreator={this.state.roomCreator}
                                            player1_health={this.state.player1_health}
                                            player1_max_health={this.state.player1_max_health}
                                            player1_ap={this.state.player1_ap}
                                            player1_defense={this.state.player1_defense}
                                            player2_health={this.state.player2_health}
                                            player2_max_health={this.state.player2_max_health}
                                            player2_ap={this.state.player2_ap}
                                            player2_defense={this.state.player2_defense}
                                        />
                                        <Link><button onClick={this.pressExitRoomButton} id="backButton" className="button" style={{float: "left", marginTop: "-60px"}}>Exit Room</button></Link>
                                        <Link><button onClick={this.showModal2} id="backButton" className="button" style={{float: "left", marginTop: "-60px", marginLeft: "150px"}}>Stats</button></Link>
                                        {/*<div><button id="selectBtn" className="button" type="submit" onClick={this.pressExitRoomButton}>Exit Room</button></div>*/}
                                        <div className="chatApp">
                                            <button id="openButton" className="open-button"onClick={this.openForm}>Chat</button>
                                            <div className="chat-popup" id="myForm">
                                                <p>Enter message and press enter.</p>
                                                <label class="text" htmlFor="msg"><b>Chat Input</b></label>
                                                <div>
                                                    <input id="chatInput" type="text" placeholder="Your Message Here" onClick={e => this.chatApplication(e)}/>
                                                </div>
                                                <p class="text"><b>Chat Output:</b></p>
                                                <div id="chatBox"></div>
                                                <button type="button" style={
                                                    {backgroundColor: "red",
                                                        padding: "16px 20px",
                                                        width: "100%",
                                                        marginBottom: "10px",
                                                        opacity: 0.8,
                                                        cursor: "pointer" }}
                                                        className="cancelBtn" onClick={this.closeForm}>Close
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                        : ''}
                </div>
                break;
            default:
                text =
                    <div>
                        Error
                    </div>;
                break;
        }

        return (
            <div>
                {(this.state.displayBoard === false) ?
                      <div id="screen">
                          <Link to="/startgame"><button id="backButton" className="button" type="submit">Go Back</button></Link>
                          <p class="Title">Multiplayer</p>
                          <div>
                              <form>
                                  <input
                                      defaultValue={this.state.roomID}
                                      className="input2"
                                      type="text"
                                      name="joinRoom"
                                      placeholder="Insert room ID to join a room"
                                      onChange={e => this.handleJoinRoom(e)}>
                                  </input>
                              </form>
                          </div>
                          <button id="selectBtn" className="button" type="submit" onClick={this.pressJoinRoomButton}>Join Room</button>
                          <button id="selectBtn" className="button" disabled={this.state.disableButton} onClick={this.pressCreateRoomButton}>Create Room</button>
                      </div>
                   : ''}
                <div>
                    <div>{text}</div>
                </div>
            </div>
        );
    }
}

export default Multiplayer;
