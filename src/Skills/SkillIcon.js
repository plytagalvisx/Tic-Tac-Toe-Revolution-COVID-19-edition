import React, {Component} from "react";
import './SkillIcon.css';

class SkillIcon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: Math.random()
        };
    }

    componentDidMount(){
        for(let i = 0; i < this.props.pattern.length; i++){
            this.drawCross(this.props.pattern[i]);
        }
    }

    drawCross(pos){
        let id = this.state.id + "skillicon" + pos;
        document.getElementById(id).innerHTML +=
        `<line x1=${0} y1=${0} x2=${1} y2=${1} /><line x1=${0} y1=${1} x2=${1} y2=${0} />`;
    }

    render(){
        return(
            <div className={this.props.skillSet ? "skillSetIcon" : "skillIcon"}>
                <div>
                    <img src={this.props.image}/>
                </div>
                <table id={this.state.id}>
                    <thead/>
                    <tbody>
                        <tr>
                            <td><svg viewBox="0 0 1 1" id={this.state.id+"skillicon0"}/></td>
                            <td><svg viewBox="0 0 1 1" id={this.state.id+"skillicon1"}/></td>
                            <td><svg viewBox="0 0 1 1" id={this.state.id+"skillicon2"}/></td>
                        </tr><tr>
                            <td><svg viewBox="0 0 1 1" id={this.state.id+"skillicon3"}/></td>
                            <td><svg viewBox="0 0 1 1" id={this.state.id+"skillicon4"}/></td>
                            <td><svg viewBox="0 0 1 1" id={this.state.id+"skillicon5"}/></td>
                        </tr><tr>
                            <td><svg viewBox="0 0 1 1" id={this.state.id+"skillicon6"}/></td>
                            <td><svg viewBox="0 0 1 1" id={this.state.id+"skillicon7"}/></td>
                            <td><svg viewBox="0 0 1 1" id={this.state.id+"skillicon8"}/></td>
                        </tr>
                    </tbody>
                    <tfoot/>
                </table>

            </div>
        )
    }
}

export default SkillIcon;