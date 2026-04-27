import React, {Component} from "react";
import firebase from "../firebaseConfig/firebaseConfig";
import Skill from "./Skill";
import SkillSet from "./SkillSet";
import "./LearnedSkills.css";

class LearnedSkills extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name:"",
            image:"",
            learnedSkills: [],
            skillSet: [],
            output:""
        };
        this.resetSkillSet = this.resetSkillSet.bind(this);
    }

    async componentDidMount(){
        let userRef = await firebase.database().ref('/User/' + this.props.user);
        userRef.once('value', (snap) => {
            this.setState({
                name: (snap.val() && snap.val().name),
                image: (snap.val() && snap.val().image),
                learnedSkills: (snap.val && snap.val().learnedSkills),
                skillSet: (snap.val && snap.val().skillSet)
            });
            this.createSkillTable();
        });
    }

    createSkillTable(){
        let table = [];
        let learnedSkills = this.state.learnedSkills;
        if(learnedSkills)
            if(learnedSkills.length === 0)
                table.push(<h4 class="text" key={"h4" + Math.random()}>You have not yet learned any skills.</h4>);
            else for (let i = 0; i < learnedSkills.length; i++) {
                if(i % 4 === 0){
                    table.push(<br/>);
                }
                table.push(<span key={'span' + Math.random()} onClick={this.addSkillToSet.bind(this, learnedSkills[i])}>
                    <Skill key={"learnedSkill" + Math.random()}
                           skill={learnedSkills[i]}/></span>);
            }
        else
            table.push(<h4 key={"h4" + Math.random()}>You have not yet learned any skills.</h4>);
        this.setState({
            output: table
        });
    }

    async addSkillToSet(skill){
        console.log("add skill");
        let skillSet = this.state.skillSet;
        let skillSetRef = await firebase.database().ref('/User/' + this.props.user);
        if(!skillSet) {
            skillSet = [];
        }
        if(skillSet.length < 4){
            if (skillSet.includes(skill)) {
            }
            else {
                    skillSet.push(skill);
                    skillSetRef.update({
                        skillSet: skillSet
                    });
                    this.setState({
                        skillSet: skillSet
                    });
                }
            }
    }

    resetSkillSet() {
        firebase.database().ref('/User/' + this.props.user).update({
            skillSet: []
        });
        this.setState({
            skillSet: []
        });
        this.createSkillTable();
    }


    render(){
        return(
            <div id="learnedSkills">
                <div id="learnedSkillsGrid">
                    <h2 class="Title2">Learned Skills:</h2>
                    {this.state.output}
                </div>
                <div>
                    <button class="button" onClick={this.resetSkillSet}>Clear skill set</button>
                    <h2 class="Title2">Skill set(max 4):</h2>
                    <SkillSet key={"SkillSet" + Math.random()} user={this.props.user} skillSet={this.state.skillSet}/>
                </div>
            </div>
        )
    }
}

export default LearnedSkills;
