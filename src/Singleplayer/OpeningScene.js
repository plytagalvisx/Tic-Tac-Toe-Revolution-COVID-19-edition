import React, {Component} from "react";
import firebase from "firebase";
import ScreenBox from "../StoryMode/ScreenBox";
import "../Singleplayer/OpeningScene.css";

class OpeningScene extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpeningScene: true,
        };
    }

    render() {
        return (
            <ScreenBox
                avatarImage={this.props.avatarImage}
                isOpeningScene={this.state.isOpeningScene}
                virus={this.props.virus}
                user={this.props.user}
            />
        );
    }

}

export default OpeningScene;
