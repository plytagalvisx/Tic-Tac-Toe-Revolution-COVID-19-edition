
//Here shows all the viruses that the player have met
import React, {Component, Fragment} from "react";
import {BrowserRouter as Router, Route, Switch, Link} from "react-router-dom";
import toscana from '../Images/toscana.1.png';
import lassa from '../Images/lassa.1.png';
import notFound from '../Images/NotFounded.png';

class VirusGallery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // insert states
        };
    }
    render() {
        return (
            <Fragment>
                <div className="GalleryTitle">
                    <p id="GalleryTitle">Here you can check all the virus that you have met</p>
                </div>
                <Link to="/gallery"><button>Go Back</button></Link>
                <div id="Gallery">
                    <div id= "GalleryObject">
                        <img src={toscana} alt="virus11"></img>
                        <p>ID: 1 Name: Green Sun</p>
                    </div>
                    <div id= "GalleryObject">
                        <img src={lassa} alt="virus21"></img>
                        <p>ID: 2 Name: Purple Twin</p>
                    </div>
                    <div id= "GalleryObject">
                        <img src={notFound} alt="notFound"></img>
                        <p>ID: ??? Name: ???</p>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default VirusGallery;
