import React, {Component, Fragment} from "react";
import {Link} from "react-router-dom";
import "../Styles/stylesheet.css";
import "./SkirmishPage.css";
import Playwindow from "../ViewPlay/Playwindow";
import CreateSkillset from "../Skills/CreateSkillset";

class SkirmishPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            difficulty: ""
        };
        this.easyDifficulty = this.easyDifficulty.bind(this);
        this.mediumDifficulty = this.mediumDifficulty.bind(this);
        this.hardDifficulty = this.hardDifficulty.bind(this);
    }

    easyDifficulty() {
        this.setState({
            difficulty: "easy",
        })
    }

    mediumDifficulty() {
        this.setState({
            difficulty: "medium",
        })
    }

    hardDifficulty() {
        this.setState({
            difficulty: "hard",
        })
    }


    render() {
        return (
            <div>
                {(this.state.difficulty === "easy" || this.state.difficulty === "medium" || this.state.difficulty === "hard") ?
                    <Playwindow difficulty={this.state.difficulty} virus={Math.floor(Math.random()*10)} user={this.props.user}/>
                    :
                    <div id="screen">
                        <Link to="/singleplayer"><button id="backButton" className="button">Go Back</button></Link>
                        <p className="Title">Choose a difficulty</p>
                        <button onClick={this.easyDifficulty} id="selectBtn" className="button">Easy</button>
                        <button onClick={this.mediumDifficulty} id="selectBtn" className="button">Normal</button>
                        <button onClick={this.hardDifficulty} id="selectBtn" className="button">Hard</button>

                        <CreateSkillset/>
                    </div>
                }
            </div>
        );
    }

}

export default SkirmishPage;
