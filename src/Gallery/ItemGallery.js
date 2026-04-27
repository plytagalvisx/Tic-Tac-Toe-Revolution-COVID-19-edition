
//Here shows all the items that the player have collect

import React, {Component, Fragment} from "react";
import {BrowserRouter as Router, Route, Switch, Link} from "react-router-dom";
import notFound from '../Images/NotFounded.png';

class ItemGallery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // insert states
        };
    }

    render() {
        return (
          <div className="GalleryTitle">
              <p id="GalleryTitle">Here you can check all the Items that you have collect</p>
              <Link to="/gallery"><button>Go Back</button></Link>
              <div id= "GalleryObject">
                  <img src={notFound} alt="notFound"></img>
                  <p>ID: ??? Name: ???</p>
              </div>
              <div id= "GalleryObject">
                  <img src={notFound} alt="notFound"></img>
                  <p>ID: ??? Name: ???</p>
              </div>
          </div>
        );
    }
}

export default ItemGallery;
