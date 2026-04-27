import React, {Component} from "react";
import { withRouter, matchPath, useHistory } from "react-router-dom";
import battleTheme from './Wild Pokemon Battle Pokemon Ruby & Sapphire Music.mp3';
import menuTheme from './Pokemon Ruby & Sapphire - Title Screen Music Extended.mp3';
import pause from './Icons/iconfinder_004_-_Pause_2949910.png';
import play from './Icons/iconfinder_001_-_play_2949893.png';
import volUp from './Icons/iconfinder_014_-_Volume_2949902.png';
import volDown from './Icons/iconfinder_016_-_Volume_2949900.png';
import mute from './Icons/iconfinder_015_-_Mute_2949901.png';
import './Music.css';

class Music extends Component{
    constructor(props){
        super(props);
        this.playPause = this.playPause.bind(this)
        this.decreaseVolume = this.decreaseVolume.bind(this)
        this.increaseVolume = this.increaseVolume.bind(this)
        this.state = {
            tracks: [menuTheme, battleTheme], 
            volume: 0.01,
            currentWindow: " ", 
            musicStatus: [play, pause],
            idx: 1,
            trackNumber: 0,
            musicState: "menu"
        }
    }

    componentDidMount(){
        this.getPage();
        document.getElementById("bgm").volume = this.state.volume;
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.currentWindow !== this.state.currentWindow){
            if (nextProps.currentWindow == "playWindow" || nextProps.currentWindow == "skirmish"|| nextProps.currentWindow == "storyMode"|| nextProps.currentWindow == "singleplayer") {
                this.setState({
                    trackNumber: 1,
                    musicState: "battle"
                })
            }

            else if(nextProps.currentWindow == " "){
                this.setState({
                    trackNumber: 0,
                    musicState: "menu"
                })
            }
        }
    }
 


   routerTest = () =>{
       console.log()
   }

   playPause = (song) =>{
          if(song.paused || song.muted){
              this.setState({
                  idx: 1
              })
              song.muted = false;
              song.volume = this.state.volume;
              song.play();
          }

          else{
              this.setState({
                  idx: 0
              })
              song.pause();
          }
    } 

    increaseVolume = (song) =>{
         if(!song.paused && song.volume < 0.95){
             this.state.volume = this.state.volume + 0.01
             song.volume = this.state.volume;
             console.log("volume: ", song.volume);
        }
    }

    decreaseVolume = (song) =>{
            if(!song.paused && song.volume > 0.01){
                this.state.volume = this.state.volume - 0.01
                song.volume = this.state.volume;
                console.log("volume: ", song.volume);
            }
    }

    mute = (song) =>{
        song.muted = true;
        alert("Song has been muted")
        console.log("volume: ", song.volume);
        this.setState({
            idx: 0
        })
    }

    getPage = () =>{
        var splitURL = window.location.href.split("/")
        var componentPage = splitURL[3];
        this.setState({
            currentWindow: componentPage
        }, function () {})
    }
    render(){
        console.log("volume: ", this.state.volume);
        this.routerTest();
        return(
                <div id="musicPlayer">
                    <audio id="bgm" preload="auto" loop autoPlay>
                        <source src={this.state.tracks[this.state.trackNumber]} type="audio/mpeg"/>
                    </audio>
                    <img id="mute" alt="Mute Button" onClick={() => this.mute(document.getElementById("bgm"))} src={mute} height = "60" width = "60"></img> 
                    <img id="volumeDown" alt="Decrease Volume" onClick={() => this.decreaseVolume(document.getElementById("bgm"))} src={volDown} height = "60" width = "60"></img>
                    <img id="playPauseButton" alt="Music State" onClick={() => this.playPause(document.getElementById("bgm"))} src={this.state.musicStatus[this.state.idx]}  height = "60" width = "60"></img>
                    <img id="volumeUp" alt="Increase Volume" onClick={() => this.increaseVolume(document.getElementById("bgm"))} src={volUp} height = "60" width = "60"></img>
                </div>                  
        )
    }
}

export default withRouter(Music);