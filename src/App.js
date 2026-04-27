import React, {Component} from "react";
import './App.css';
import {Route, Switch} from "react-router-dom";
import Multiplayer from "./Multiplayer/Multiplayer";
import ChoosePlayer from "./ChoosePlayer";
import AboutUs from "./AboutUs/AboutUs";
import SkillGallery from "./Gallery/SkillGallery";
import StartGamePage from "./Homepage/StartGamePage";
import SingleplayerPage from "./Singleplayer/SingleplayerPage";
import StoryModePage from "./Singleplayer/StoryModePage";
import SkirmishPage from "./Singleplayer/SkirmishPage";
import Gallery from "./Gallery/Gallery";
import VirusGallery from "./Gallery/VirusGallery";
import ItemGallery from "./Gallery/ItemGallery";
import InventoryTest from "./Inventory/InventoryTest";
import MultiplayerSession from "./PlaySession/MultiplayerSession";
import SkillsTest from "./Skills/SkillsTest";
import Menu from "./Homepage/Menu";
import SingleplayerSession from "./PlaySession/SingleplayerSession";
import Navbar from "./Homepage/navbar";
import ScreenBox from "./StoryMode/ScreenBox";
import Inventory from "./Inventory/Inventory";
import {auth} from "./firebaseConfig/firebaseConfig";
import NewGame from "./Singleplayer/NewGame";
import NextLevel from "./Singleplayer/NextLevel";
import Music from "./Music/Music";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: ""
        };
    }

    async componentDidMount() {
        await auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({user: user});
            }
        });
    }

    render() {
        return (
            <div className="App">
                <Navbar />
                <section>
                    <Switch>
                        <Route exact path="/" component={Menu}/>
                        <Route exact path="/gallery" component={Gallery}/>
                        <Route exact path="/virusGallery" component={VirusGallery}/>
                        <Route exact path="/skillGallery" component={SkillGallery}/>
                        <Route exact path="/itemGallery" component={ItemGallery}/>
                        <Route exact path="/startgame" component={StartGamePage}/>
                        <Route exact path="/singleplayer" component={SingleplayerPage}/>
                        <Route exact path="/playSession" component={MultiplayerSession}/>
                        <Route exact path="/screenBox" component={ScreenBox}/>
                        <Route exact path="/skillsTest" component={SkillsTest}/>
                        <Route exact path="/choosePlayer" component={ChoosePlayer}/>
                        <Route exact path="/multiplayer" component={Multiplayer}/>
                        <Route exact path="/inventoryTest" component={InventoryTest}/>
                        <Route exact path="/inventory" component={Inventory}/>
                        <Route exact path="/aboutus" component={AboutUs}/>

                        <Route
                            exact path="/storyMode"
                            render={() => <StoryModePage user={this.state.user}/>}
                        />

                        <Route
                            exact path="/newGame"
                            render={() => <NewGame user={this.state.user}/>}
                        />

                        <Route
                            exact path="/newGame/nextVirus"
                            render={() => <NextLevel user={this.state.user}/>}
                        />

                        <Route
                            path="/singleplayer"
                            render={() => <SingleplayerSession user={this.state.user}/>}
                        />

                        <Route
                            path="/skirmish"
                            render={() => <SkirmishPage user={this.state.user}/>}
                        />

                    </Switch>
                </section>
            </div>
        );
    }
}

export default App;
