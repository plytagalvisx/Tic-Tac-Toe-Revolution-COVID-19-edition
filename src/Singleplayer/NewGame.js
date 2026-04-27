import React, {Component, Fragment} from "react";
import {Link} from "react-router-dom";
import Playwindow from "../ViewPlay/Playwindow";
import Modal from "react-bootstrap/Modal";
import firebase from "firebase";
import OpeningScene from "./OpeningScene";
import ScreenBox from "../StoryMode/ScreenBox";

class NewGame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            difficulty: "",
            startGame: false,
            isOpeningScene: true,
        };
        this.easyDifficulty = this.easyDifficulty.bind(this);
        this.mediumDifficulty = this.mediumDifficulty.bind(this);
        this.hardDifficulty = this.hardDifficulty.bind(this);
        this.startGame = this.startGame.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    easyDifficulty() {
        this.setState({
            difficulty: "easy",
            isOpen: true
        })
    }

    mediumDifficulty() {
        this.setState({
            difficulty: "medium",
            isOpen: true
        })
    }

    hardDifficulty() {
        this.setState({
            difficulty: "hard",
            isOpen: true
        })
    }
    startGame() {
        firebase.database().ref('/User/' + this.props.user.uid).update({
            itemsInInventory: ["healing-potion", "healing-potion"],
            learnedSkills: ["punch", "kick"],
            skillSet: ["punch", "kick"],
            currentVirus: 0,
            ap: 40,
            health: 100,
            defense: 10,
            difficulty: this.state.difficulty
        });
        this.setState({
            startGame: true
        })
    }

    hideModal = () => {
        this.setState({isOpen: false});
    };

    render() {
        return (
            <Fragment>
                {this.state.startGame ?
                    <ScreenBox
                        isOpeningScene={this.state.isOpeningScene}
                        virus={0}
                        user={this.props.user}
                    />
                    :
                    <div>
                        <Modal show={this.state.isOpen} onHide={this.hideModal} dialogClassName={"newGame-modal"}>
                            <Modal.Header><p class="text">This will reset your saved progress.<br/>Are you sure?</p></Modal.Header>
                            <Modal.Body><div><button className="button" onClick={this.startGame}>Yes</button><button class="button" onClick={this.hideModal}>No</button></div></Modal.Body>
                        </Modal>
                        <div id="screen">
                        <Link to="/storyMode"><button id="backButton" className="button" type="submit">Go Back</button></Link>
                        <p className="Title">Choose a difficulty</p>
                        <button onClick={this.easyDifficulty} id="selectBtn" className="button">Easy</button>
                        <button onClick={this.mediumDifficulty} id="selectBtn" className="button">Normal</button>
                        <button onClick={this.hardDifficulty} id="selectBtn" className="button">Hard</button>
                        </div>
                    </div>
                }
            </Fragment>
        );
    }

}

export default NewGame;
