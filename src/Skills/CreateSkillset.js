import React, {Component} from "react";
import Modal from 'react-bootstrap/Modal';
import "bootstrap/dist/css/bootstrap.min.css";
import firebase from "../firebaseConfig/firebaseConfig";
import {auth} from "../firebaseConfig/firebaseConfig";
import LearnedSkills from "./LearnedSkills";
import SkillSet from "./SkillSet";
import './Skill.css';
import "../Styles/stylesheet.css";


class CreateSkillset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: "",
            isOpen: false,
            name: "",
            skillSet: []
        };
    }
    async componentDidMount() {
        await auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    user: user.uid
                });
                firebase.database().ref('/User/' + this.state.user).once('value', (snap) => {
                    this.setState({
                        name: (snap.val() && snap.val().name) + "'s ",
                        skillSet: (snap.val() && snap.val().skillSet)
                    });
                });
            }
        });
    };

    showModal = () => {
        this.setState({isOpen: true});
    };

    hideModal = () => {
        this.setState({isOpen: false});
    };


    render() {
        return(
            <div>
                <button id="selectBtn" className="button" onClick={this.showModal} type="submit">Create Skillset</button>
                <Modal show={this.state.isOpen} onHide={this.hideModal}>
                    <Modal.Header><p class="Title2">{this.state.name}learned skills</p></Modal.Header>
                    <Modal.Body skillset={this.state.skillSet}>
                        <LearnedSkills
                            user={this.state.user}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <button class="button" onClick={this.hideModal}>Close</button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default CreateSkillset;
