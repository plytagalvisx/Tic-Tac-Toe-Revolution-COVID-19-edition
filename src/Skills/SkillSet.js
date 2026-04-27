import React, {Component} from "react";
import firebase from "../firebaseConfig/firebaseConfig";
import Skill from "./Skill";
import "./Skill.css";
import "./SkillSet.css";

class SkillSet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name:"",
            image:"",
            output:"",
            skillSet: this.props.skillSet
        };
        this.showSkillSetTable = this.showSkillSetTable.bind(this);
    }

    async componentDidMount(){
        let userRef = await firebase.database().ref('/User/' + this.props.user);
        userRef.on('value', (snap) => {
            this.setState({
                name: (snap.val() && snap.val().name),
                image: (snap.val() && snap.val().image),
                skillSet: (snap.val() && snap.val().skillSet),
            });
        });

    }

    showSkillSetTable() {
        let table = [];
        let skillSet = this.state.skillSet;
        if(skillSet) {
            if (skillSet.length === 0)
                table.push(<h4 key={"h4" + Math.random()}>You have not yet created a skill set</h4>);
            else for (let i = 0; i < skillSet.length; i++) {
                table.push(<Skill key={"skillSet" + Math.random()} skill={skillSet[i]} skillSet={true}/>);
            }
        }
        else {
            table.push(<h4 key={'skillSeth4'}>You have not yet created a skill set</h4>);
        }

        return table;
    }

    render() {
        let table = this.showSkillSetTable();
        return (
            <div className={"skillSet"}>
                {table}
            </div>
        )
    }
}

export default SkillSet;