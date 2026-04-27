import React, {Component} from "react";
import Modal from 'react-bootstrap/Modal';
import "bootstrap/dist/css/bootstrap.min.css";
import firebase from "../firebaseConfig/firebaseConfig";
import {auth} from "../firebaseConfig/firebaseConfig";
import LearnedSkills from "./LearnedSkills";
import SkillSet from "./SkillSet";
import './Skill.css';

class SkillsTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: "",
            isOpen: false,
            skillToAdd: '',
            name: "",
            skillSet: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

    handleChange(event) {
        this.setState({skillToAdd: event.target.value});
    };

    handleSubmit(event) {
        let skillRef = firebase.database().ref('/Skill/' + this.state.skillToAdd);
        skillRef.once('value', (snap) => {
            if(snap.val() !== null) {
                let learnedSkills = [];
                let userRef = firebase.database().ref('/User/' + this.state.user);
                userRef.once('value', (snap) => {
                    if((snap.val() && snap.val().learnedSkills))
                    if((snap.val() && snap.val().learnedSkills).length !== 0) {
                        learnedSkills = (snap.val() && snap.val().learnedSkills);
                    }
                    learnedSkills.push(this.state.skillToAdd);

                    firebase.database().ref('/User/' + this.state.user).update({
                        learnedSkills: learnedSkills
                    });
                });
                alert('Skill: ' + this.state.skillToAdd + ' was added to your learned skills!');
            }
        });
        event.preventDefault();
    }

    render() {
        return(
            <div>
                <div type="button" onClick={this.showModal} style={{backgroundColor: "green", width:"100px", margin:"auto", padding:"4px"}}>Learned Skills</div>
                <Modal show={this.state.isOpen} onHide={this.hideModal}>
                    <Modal.Header>{this.state.name}learned skills</Modal.Header>
                    <Modal.Body skillset={this.state.skillSet}>
                        <LearnedSkills
                            user={this.state.user}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <button class="button" onClick={this.hideModal}>Close</button>
                    </Modal.Footer>
                </Modal>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Skill to add:
                        <input
                            id="skillToAdd"
                            type="text"
                            value={this.state.skillToAdd}
                            onChange={e => this.handleChange(e)}
                            placeholder="Insert a skill of your liking"
                        />
                    </label>
                    <input type="submit" value="Submit" />
                </form>

                <SkillSet
                    key={"SkillSet" + Math.random()}
                    user={this.state.user}
                    skillSet={this.state.skillSet}
                />
            </div>
        )
    }
}

export default SkillsTest;
