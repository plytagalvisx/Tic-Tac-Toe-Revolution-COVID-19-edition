import React, {Component} from "react";
import firebase from "../firebaseConfig/firebaseConfig";
import Floater from "react-floater";
import '../PlaySession/MultiplayerSession.css';
import '../Inventory/Item.css';
import SkillIcon from "./SkillIcon";

class Skill extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            description: "",
            image: "",
            damage: 0,
            heal: 0,
            pattern: ""
        };
    }
    async componentDidMount(){
        let skillRef = await firebase.database().ref('/Skill/' + this.props.skill);
        skillRef.on('value', (snap) => {
            let damage = 0;
            let heal = 0;
            if((snap.val() && snap.val().damage)) {
                damage = (snap.val() && snap.val().damage);
            }
            if((snap.val() && snap.val().heal)){
                heal = (snap.val() && snap.val().heal);
            }
            this.setState({
                name: (snap.val() && snap.val().name),
                description: (snap.val() && snap.val().description),
                image: (snap.val() && snap.val().image),
                damage: damage,
                heal: heal,
                pattern: (snap.val() && snap.val().skillPattern)
            });
        });
    }

    createIcon(){
        if(typeof this.state.pattern === 'object' ) {
            return (
                <SkillIcon pattern={this.state.pattern} image={this.state.image} skillSet={this.props.skillSet ? true : false}/>
            )
        }
    }

    render(){
        return(
            <div className="skill">
                <Floater
                    title={this.state.name}
                    content={this.state.description}
                    event="hover"
                    eventDelay={0}
                    styles={{
                        options: {
                            zIndex:2000,
                        }
                    }}
                >
                <div>
                    {this.createIcon()}
                </div>

                </Floater>
            </div>
        )
    }
}

export default Skill;