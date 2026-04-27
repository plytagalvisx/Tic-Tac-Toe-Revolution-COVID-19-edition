import React, { Component } from "react";
import './PlayingField.css'
import SkillSet from "../Skills/SkillSet";

class PlayingField extends Component{
    constructor(props){
        super(props)
    }

    render() {
        return (
            <div id = "playField">
                <div id="boxBoard">
                    <div id="one">
                        <img id="0x0" onClick={() => this.props.drawPieceOnTile(document.getElementById("one").children[0].id)} src={this.props.gamePieces[0]} alt= "Tile 1" height ="58" width="58"></img>
                    </div>
                    <div id="two">
                        <img id="0x1" onClick={() => this.props.drawPieceOnTile(document.getElementById("two").children[0].id)} src={this.props.gamePieces[0]} alt= "Tile 2" height ="58" width="58"></img>
                    </div>
                    <div id="three">
                        <img id="0x2" onClick={() => this.props.drawPieceOnTile(document.getElementById("three").children[0].id)} src={this.props.gamePieces[0]} alt= "Tile 3" height ="58" width="58"></img>
                    </div>
                    <div id="four">
                        <img id="1x0" onClick={() => this.props.drawPieceOnTile(document.getElementById("four").children[0].id)} src={this.props.gamePieces[0]} alt= "Tile 4" height ="58" width="58"></img>
                    </div>
                    <div id="five">
                        <img id="1x1" onClick={() => this.props.drawPieceOnTile(document.getElementById("five").children[0].id)} src={this.props.gamePieces[0]} alt= "Tile 5" height ="58" width="58"></img>
                    </div>
                    <div id="six">
                        <img id="1x2" onClick={() => this.props.drawPieceOnTile(document.getElementById("six").children[0].id)} src={this.props.gamePieces[0]} alt= "Tile 6" height ="58" width="58"></img>
                    </div>
                    <div id="seven">
                        <img id="2x0" onClick={() => this.props.drawPieceOnTile(document.getElementById("seven").children[0].id)} src={this.props.gamePieces[0]} alt= "Tile 7" height ="58" width="58"></img>
                    </div>
                    <div id="eight">
                        <img id="2x1" onClick={() => this.props.drawPieceOnTile(document.getElementById("eight").children[0].id)} src={this.props.gamePieces[0]} alt= "Tile 8" height ="58" width="58"></img>
                    </div>
                    <div id="nine">
                        <img id="2x2" onClick={() => this.props.drawPieceOnTile(document.getElementById("nine").children[0].id)} src={this.props.gamePieces[0]} alt= "Tile 9" height ="58" width="58"></img>
                    </div>
                </div>
            </div>
        )
    }
}

export default PlayingField;