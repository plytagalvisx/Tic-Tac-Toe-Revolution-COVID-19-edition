import React, {Component} from "react";
import './ScreenBox.css';
import "../Singleplayer/OpeningScene.css";
import Nerdy from '../Images/Nerdy.png';
import BlackScreen from '../Images/blackScreen.jpg';
import Hospital from "../Images/Hospital.png";
import PersonB from "../Images/PersonB.png";
import firebase from "firebase";
import {auth} from "../firebaseConfig/firebaseConfig";

class ScreenBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            continueClicked: 0,
        };

        this.startDialogueBox = this.startDialogueBox.bind(this);
        this.introductionActBox = this.introductionActBox.bind(this);
        this.firstActBox = this.firstActBox.bind(this);
        this.secondActBox = this.secondActBox.bind(this);
        this.thirdActBox = this.thirdActBox.bind(this);
        this.fourthActBox = this.fourthActBox.bind(this);
        this.fifthActBox = this.fifthActBox.bind(this);
        this.sixthActBox = this.sixthActBox.bind(this);
        this.seventhActBox = this.seventhActBox.bind(this);
        this.eighthActBox = this.eighthActBox.bind(this);
        this.ninthActBox = this.ninthActBox.bind(this);
        this.tenthActBox = this.tenthActBox.bind(this);
        this.eleventhActBox = this.eleventhActBox.bind(this);
        this.twelfthActBox = this.twelfthActBox.bind(this);
        this.thirteenthActBox = this.thirteenthActBox.bind(this);
        this.processMessage = this.processMessage.bind(this);
        this.printLetters = this.printLetters.bind(this);
        this.removeContainer = this.removeContainer.bind(this);
    }

    async componentDidMount() {
        window.setTimeout(this.startDialogueBox, 1000);

        await auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({user: user});
            }
        });

        await firebase.database().ref('/User/' + this.state.user.uid).once('value', (snap) => {
            let user = snap.val();
            this.setState({
                avatarImage: (user && user.image)
            });
        });
    }

    printLetters(message) {
        let container = document.getElementsByClassName('container');
        let delayTime = 40;
        let newLetter = "";
        let i = 0;
        let self = this;
        let continueClicked = this.state.continueClicked;

        let iterateThroughLetters = function() {
            if (i < message.length) {
                let letter = message[i];

                if (letter === newLetter) {
                    (document.getElementsByClassName('messageContent'))[0].append('\n');
                } else {
                    (document.getElementsByClassName('messageContent'))[0].append(letter);
                }

                i++;
                setTimeout(iterateThroughLetters, delayTime);

                (container)[0].onclick = () => {
                    switch(continueClicked) {
                        case 1:
                            self.firstActBox();
                            break;
                        case 3:
                            self.secondActBox();
                            break;
                        case 5:
                            self.thirdActBox();
                            break;
                        case 7:
                            self.fourthActBox();
                            break;
                        case 9:
                            self.fifthActBox();
                            break;
                        case 11:
                            self.sixthActBox();
                            break;
                        case 13:
                            self.seventhActBox();
                            break;
                        case 15:
                            self.eighthActBox();
                            break;
                        case 17:
                            self.ninthActBox();
                            break;
                        case 19:
                            self.tenthActBox();
                            break;
                        case 21:
                            self.eleventhActBox();
                            break;
                        case 23:
                            self.twelfthActBox();
                            break;
                        case 25:
                            self.thirteenthActBox();
                            break;
                        default:
                            break;
                    }
                    self.state.continueClicked = continueClicked+1;
                    continueClicked++;
                    for (let i = 0; i < message.length; i++) {
                        iterateThroughLetters();
                    }
                };
            }
        };
        iterateThroughLetters();
    }

    removeContainer() {
        let container = document.querySelector('.container');
        setTimeout(() => {
            container.style.display = "none";
        },3000)
    }

    startDialogueBox() {
        let messages = document.getElementsByClassName('messages');
        messages[0].style.transform = `scale(1)`;
        messages[0].className = "text";

        let dialogueBox = document.getElementsByClassName('messageContent');
        dialogueBox[0].style.background = "black";
        dialogueBox[0].style.boxShadow  = "1px 2vw 7vw -2vw rgba(51, 51, 51, .5)";
        dialogueBox[0].style.border  = "5px solid white";
        dialogueBox[0].style.color  = "white";
        dialogueBox[0].style.opacity = `1`;

        this.introductionActBox();
    }

    introductionActBox() {

        this.processMessage([``, `DOUBLE CLICK TO CONTINUE`]);
        let message;
        if(this.props.isOpeningScene === true) {
            let screen = document.querySelector('.screen');
            let img = document.createElement("img");
            img.src = BlackScreen;
            img.className = "blackImage";
            screen.appendChild(img);
            message = "The world has been corrupted by the virus, people suffer from all kinds of virus, everyone felt hopeless, but there are still people who are fighting...";
        } else {
            let avatarImage = document.querySelector('.avatarImage');
            avatarImage.style.height = "350px";
            avatarImage.style.width = "350px";
            avatarImage.src = this.state.avatarImage;
            message = "You: Uff... I will never get used to this view...";
        }
        this.printLetters(message);
    }

    firstActBox() {
        this.processMessage([``, `DOUBLE CLICK TO CONTINUE`]);
        this.state.continueClicked = this.state.continueClicked+1;
        let message;
        if(this.props.isOpeningScene === true) {
            let avatarImage = document.querySelector('.avatarImage');
            avatarImage.src = PersonB;
            let dialogueBox = document.getElementsByClassName('messageContent');
            dialogueBox[0].style.color = "black";
            dialogueBox[0].style.background = "#eee";
            dialogueBox[0].style.boxShadow  = "1px 2vw 7vw -2vw rgba(51, 51, 51, .5)";
            dialogueBox[0].style.border  = "5px solid black";
            let screen = document.querySelector('.screen');
            let blackScreen = document.querySelector('.blackImage');
            let img = document.createElement("img");
            img.src = Hospital;
            img.style.marginTop = "970px";
            img.style.marginBottom = "-220px";
            screen.removeChild(blackScreen);
            screen.appendChild(img);
            message = "Player! There are more patients coming! All the rooms are occupied! What should we do?";
        } else {
            let avatarImage = document.querySelector('.avatarImage');
            avatarImage.src = this.props.virus_image;
            switch(this.props.virus) {
                case 0: message = this.props.virus_name + ": FOOD...EAT..."; break;
                case 1: message = this.props.virus_name + ": A human? All the way here? I will not let you stop us, this body will be ours!"; break;
                case 2: message = this.props.virus_name + ": What do we have here, another source of nutrition!"; break;
                case 3: message = this.props.virus_name + ": Hehehehe, which part should I start to eat?"; break;
                case 4: message = this.props.virus_name + ": Hiahiahiahia, destroy, DESTROY EVERYTHING!!"; break;
                case 5: message = this.props.virus_name + ": Human, you think you can beat me?"; break;
                case 6: message = this.props.virus_name + ": Shhhhh, you look tasty..."; break;
                case 7: message = this.props.virus_name + ": Nourishment detected, activate devour mode."; break;
                case 8: message = this.props.virus_name + ": A human? Hehehe you’ve come just in time because, I AM HUNGRY!"; break;
                case 9: message = this.props.virus_name + ": Prepare to die, human."; break;
                default: break;
            }
        }
        this.printLetters(message);
    }

    secondActBox() {
        this.processMessage([``, `DOUBLE CLICK TO CONTINUE`]);
        this.state.continueClicked = this.state.continueClicked+1;
        let message;
        if(this.props.isOpeningScene === true) {
            message = "Player! Patient in room 203, 602 and 431 are soon not going to make it, we need to do something, fast!";
        } else {
            let avatarImage = document.querySelector('.avatarImage');
            avatarImage.style.height = "350px";
            avatarImage.style.width = "350px";
            avatarImage.src = this.state.avatarImage;
            message = "You: Alright, let's do this!";
        }
        this.printLetters(message);
    }

    thirdActBox() {
        this.processMessage([``, `DOUBLE CLICK TO CONTINUE`]);
        this.state.continueClicked = this.state.continueClicked+1;
        let message;
        if(this.props.isOpeningScene === true) {
            message = "Player!...";
        } else {
            let avatarImage = document.querySelector('.avatarImage');
            avatarImage.style.display = "none";
            switch(this.props.virus) {
                case 0: message = "Battle 1. You fight against " + this.props.virus_name + " "; break;
                case 1: message = "Battle 2. You fight against " + this.props.virus_name + " "; break;
                case 2: message = "Battle 3. You fight against " + this.props.virus_name + " "; break;
                case 3: message = "Battle 4. You fight against " + this.props.virus_name + " "; break;
                case 4: message = "Battle 5. You fight against " + this.props.virus_name + " "; break;
                case 5: message = "Battle 6. You fight against " + this.props.virus_name + " "; break;
                case 6: message = "Battle 7. You fight against " + this.props.virus_name + " "; break;
                case 7: message = "Battle 8. You fight against " + this.props.virus_name + " "; break;
                case 8: message = "Battle 9. You fight against " + this.props.virus_name + " "; break;
                case 9: message = "Final Battle 10! You fight against " + this.props.virus_name + " "; break;
                default: break;
            }
            this.removeContainer();
        }
        this.printLetters(message);
    }

    fourthActBox() {
        this.processMessage([``, `DOUBLE CLICK TO CONTINUE`]);
        this.state.continueClicked = this.state.continueClicked+1;
        let message;
        if(this.props.isOpeningScene === true) {
            message = "Player!...";
        } else {
            return;
        }
        this.printLetters(message);
    }

    fifthActBox() {
        this.processMessage([``, `DOUBLE CLICK TO CONTINUE`]);
        this.state.continueClicked = this.state.continueClicked+1;
        let message;
        if(this.props.isOpeningScene === true) {
            let avatarImage = document.querySelector('.avatarImage');
            avatarImage.style.height = "350px";
            avatarImage.style.width = "350px";
            avatarImage.src = this.state.avatarImage;
            message = "You: People are suffering, and there' is nothing I can do...";
        } else {
            return;
        }
        this.printLetters(message);
    }

    sixthActBox() {
        this.processMessage([``, `DOUBLE CLICK TO CONTINUE`]);
        this.state.continueClicked = this.state.continueClicked+1;
        let message;
        if(this.props.isOpeningScene === true) {
            message = "You: Is this the end of the world?";
        } else {
            return;
        }
        this.printLetters(message);
    }

    seventhActBox() {
        this.processMessage([``, `DOUBLE CLICK TO CONTINUE`]);
        this.state.continueClicked = this.state.continueClicked+1;
        let message;
        if(this.props.isOpeningScene === true) {
            let avatarImage = document.querySelector('.avatarImage');
            avatarImage.src = Nerdy;
            message = "Nerd Scientist: Finally! I managed to make it! Player! We can cure people now!";
        } else {
            return;
        }
        this.printLetters(message);
    }

    eighthActBox() {
        this.processMessage([``, `DOUBLE CLICK TO CONTINUE`]);
        this.state.continueClicked = this.state.continueClicked+1;
        let message;
        if(this.props.isOpeningScene === true) {
            let avatarImage = document.querySelector('.avatarImage');
            avatarImage.style.height = "350px";
            avatarImage.style.width = "350px";
            avatarImage.src = this.state.avatarImage;
            message = "You: Really? How?";
        } else {
            return;
        }
        this.printLetters(message);
    }

    ninthActBox() {
        this.processMessage([``, `DOUBLE CLICK TO CONTINUE`]);
        this.state.continueClicked = this.state.continueClicked+1;
        let message;
        if(this.props.isOpeningScene === true) {
            let avatarImage = document.querySelector('.avatarImage');
            avatarImage.src = Nerdy;
            message = "Nerd Scientist: By using the shrink machine, you will be able to get into the patient's body and kill all the viruses.";
        } else {
            return;
        }
        this.printLetters(message);
    }

    tenthActBox() {
        this.processMessage([``, `DOUBLE CLICK TO CONTINUE`]);
        this.state.continueClicked = this.state.continueClicked+1;
        let message;
        if(this.props.isOpeningScene === true) {
            let avatarImage = document.querySelector('.avatarImage');
            avatarImage.style.height = "350px";
            avatarImage.style.width = "350px";
            avatarImage.src = this.state.avatarImage;
            message = "You: ...Will this really work?";
        } else {
            return;
        }
        this.printLetters(message);
    }

    eleventhActBox() {
        this.processMessage([``, `DOUBLE CLICK TO CONTINUE`]);
        this.state.continueClicked = this.state.continueClicked+1;
        let message;
        if(this.props.isOpeningScene === true) {
            let avatarImage = document.querySelector('.avatarImage');
            avatarImage.src = Nerdy;
            message = "Nerd Scientist: Sure it will. The only thing we need to test is if we humans really will be able to kill the virus, that's why I need you to try this for me.";
        } else {
            return;
        }
        this.printLetters(message);
    }

    twelfthActBox() {
        this.processMessage([``, `DOUBLE CLICK TO CONTINUE`]);
        this.state.continueClicked = this.state.continueClicked+1;
        let message;
        if(this.props.isOpeningScene === true) {
            message = "Nerd Scientist: Are you in?";
        } else {
            return;
        }
        this.printLetters(message);
    }

    thirteenthActBox() {
        this.processMessage([``, `DOUBLE CLICK TO CONTINUE`]);
        this.state.continueClicked = this.state.continueClicked+1;
        let message;
        if(this.props.isOpeningScene === true) {
            let avatarImage = document.querySelector('.avatarImage');
            avatarImage.style.height = "350px";
            avatarImage.style.width = "350px";
            avatarImage.src = this.state.avatarImage;

            let wrap = document.querySelector('.wrap');
            let effect = document.createElement('div');
            effect.className = "effect";
            wrap.appendChild(effect);

            message = "You: Okay, I will do it.";
        } else {
            return;
        }
        this.printLetters(message);
        setTimeout(() => {
            window.location.href = "/storyMode";
        },6000)
    }


    processMessage(messages) {
        let cycles = messages.length-1;
        let message = document.getElementsByClassName('messageContent');
        message[0].innerHTML = '';

        const messageLine = function(cycle) {
            if (cycle >= 0) {
                let msgContent = messages[cycles-cycle];
                let msg = document.createElement('p');
                msg.className = "message text";
                msg.style.float  = "right";
                msg.innerHTML = msgContent;
                message[0].append(msg);
                window.setTimeout(messageLine,500,cycle-1);
            }
        };
        messageLine(cycles);
    }

    render() {
        console.log("this.state.avatarImage: ",this.state.avatarImage);
        return (
            <div>
                <div className="wrap"></div>
                <div id="openingSceneContainer">
                    <div className="screen">
                        <div className="container containerShare">
                            <img className="avatarImage" alt="" src={""}/>
                            <div>
                                <div>
                                    <div className="messages">
                                        <div className="text" className="messageContent"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ScreenBox;
