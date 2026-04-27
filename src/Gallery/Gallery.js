//This is a gallery where the player can see what he has collect and met
import React, {Component, Fragment} from "react";
import {BrowserRouter as Router, Route, Switch, Link} from "react-router-dom";
import "./Gallery.css";
import VirusGallery from "./VirusGallery"

class Gallery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // insert states
        };
    }
    render() {
        return (
            <Fragment>
                <p id="GalleryTitle">Hi this is the gallery XD</p>
                <Link to="/virusGallery"><button>Virus</button></Link>
                <Link to="/skillGallery"><button>Skill</button></Link>
                <Link to="/itemGallery"><button>Item</button></Link>
                <Link to="/storyMode"><button>Go Back</button></Link>
            </Fragment>
        );
    }

}

export default Gallery;
