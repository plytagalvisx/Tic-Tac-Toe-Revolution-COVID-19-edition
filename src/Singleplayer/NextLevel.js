import React, {Component, Fragment} from "react";
import Playwindow from "../ViewPlay/Playwindow";
import Modal from "react-bootstrap/Modal";
import firebase from "firebase";

class NextLevel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startGame: false,
            disableButton: true
        };
        this.startGame = this.startGame.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            firebase.database().ref("User/" + this.props.user.uid).once('value', (snap) => {
                let user = snap.val();
                this.setState({
                    currentVirus: (user && user.currentVirus),
                    difficulty: (user && user.difficulty)
                });
            });
        },1000)

        setTimeout(() => {
            this.setState({
                disableButton: false
            });
        },2000)

    }

    startGame() {
        firebase.database().ref('/User/' + this.props.user.uid).update({
            itemsInInventory: ["healing-potion", "healing-potion"],
            learnedSkills: ["punch", "kick"],
            skillSet: ["punch", "kick"],
            currentVirus: this.state.currentVirus,
            ap: 40,
            health: 100,
            defense: 10,
            difficulty: this.state.difficulty
        });
        this.setState({
            startGame: true
        })
    }

    render() {
        return (
            <Fragment>
                {this.state.startGame ?
                    <Playwindow difficulty={this.state.difficulty} virus={this.state.currentVirus} user={this.props.user}/>
                    :
                    <div>
                        <Modal show={true} dialogClassName={"newGame-modal"}>
                            <Modal.Header><p class="text">Click Continue</p></Modal.Header>
                            <Modal.Body><div><button className="button" disabled={this.state.disableButton} onClick={this.startGame}>Continue</button></div></Modal.Body>
                        </Modal>
                    </div>
                }
            </Fragment>
        );
    }

}

export default NextLevel;
