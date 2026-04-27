import React, {Component, Fragment} from "react";
import {Link} from "react-router-dom";
import "../Styles/stylesheet.css";

class SingleplayerPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // insert states
        };
    }

    render() {
        return (
          <Fragment>
              <div id="screen" >
                <Link to="/startgame"><button id="backButton" className="button" type="submit" >Go Back</button></Link>
                <p class="Title">Choose a mode</p>
                  <div>
                      <Link to="/storyMode"><button id="selectBtn" className="button" type="submit" >Story Mode</button></Link>
                      <Link to="/skirmish"><button id="selectBtn" className="button" type="submit" >Skirmish</button></Link>
                  </div>
              </div>
          </Fragment>
        );
    }

}

export default SingleplayerPage;
