import React, {Component, Fragment} from "react";
import {Link} from "react-router-dom";
import "../Styles/stylesheet.css";

class StartGamePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // insert states
        };
    }

    render() {
        return (
          <Fragment>
              <div id ="screen">
                  <Link to="/"><button id="backButton" className="button" type="submit">Go Back</button></Link>
                  <p className="Title">Singleplayer or multiplayer?</p>
                  <div>
                      <Link to="/singleplayer"><button id="selectBtn" className="button" type="submit">Singleplayer</button></Link>
                      <Link to="/multiplayer"><button id="selectBtn" className="button" type="submit">Multiplayer</button></Link>
                  </div>
              </div>
          </Fragment>
        );
    }

}

export default StartGamePage;
