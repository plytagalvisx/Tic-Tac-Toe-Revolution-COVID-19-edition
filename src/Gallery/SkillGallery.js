
//Here shows all the skills that the player have learned

import React, {Component, Fragment} from "react";
import {BrowserRouter as Router, Route, Switch, Link} from "react-router-dom";
import notFound from '../Images/NotFounded.png';

class SkillGallery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // insert states
        };
    }

    render() {
        return (
            <div className="GalleryTitle">
                <p id="GalleryTitle">Here you can check all the skills that you have learned</p>
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

export default SkillGallery;
