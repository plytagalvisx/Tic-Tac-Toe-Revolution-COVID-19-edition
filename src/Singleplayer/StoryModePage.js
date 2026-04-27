import React, {Component, Fragment} from "react";
import {Link} from "react-router-dom";
import firebase, {auth} from "../firebaseConfig/firebaseConfig";
import Playwindow from "../ViewPlay/Playwindow";
import CreateSkillset from "../Skills/CreateSkillset";
import "../Styles/stylesheet.css";

class StoryModePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            continue: false
        };
        this.continue = this.continue.bind(this);
    }

    async componentDidMount(){
        await auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    user: user.uid
                });
            }
        });

        setTimeout(() => {
                firebase.database().ref('/User/' + this.state.user).once('value', (snap) => {
                    let user = snap.val();
                    this.setState({
                    difficulty: (user && user.difficulty),
                    virus: (user && user.currentVirus)
                });
            });
        },1000)
    }

    continue() {
        this.setState({
            continue: true,
        })
    }
    render() {
        return (
            <Fragment>
                {(this.state.continue && (this.state.virus !== undefined)) ?
                    <Playwindow difficulty={this.state.difficulty} virus={this.state.virus} user={this.props.user}/>
                    :
                    <div id="screen">
                        <Link to="/"><button id="backButton" className="button" type="submit">Go Back</button></Link>
                        <p class="Title">Tic-Tac-Toe Revolution: COVID-19 edition</p>
                        <Link to="/newGame">
                            <button id="selectBtn" className="button" type="submit">New Game</button>
                        </Link>
                        <button onClick={this.continue} id="selectBtn" className="button" type="submit">Continue</button>
                        <CreateSkillset/>
                    </div>
                }
            </Fragment>
        );
    }

}

export default StoryModePage;
