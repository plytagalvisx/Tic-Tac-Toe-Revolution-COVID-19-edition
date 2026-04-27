import React, {Component, Fragment} from "react";
import {Link} from "react-router-dom";
import firebase from "firebase";
import {auth, provider} from "../firebaseConfig/firebaseConfig";
import "../Styles/stylesheet.css";


class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: "",
        };
        this.logout = this.logout.bind(this);
        this.login = this.login.bind(this);
    }

    async componentDidMount() {
        await auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({user});
            }
        });
    }

    logout() {
        firebase.auth().signOut();
        this.setState({user: null});
    }

    login() {
        auth.signInWithPopup(provider)
            .then((result) => {
                const user = result.user;
                this.setState({user});
            });
    }

    render() {
        return (
            <div>
                <div>
                    <p class="Title">Tic-Tac-Toe Revolution: COVID-19 edition</p>
                </div>
                <div class="title">
                    {this.state.user ?
                        <div>
                            <div class ="Title2">Welcome {this.state.user.displayName}!</div>
                            <div >
                                <button class ="button" onClick={this.logout}>Logout</button>
                            </div>
                        </div>
                        :
                        <div>
                            <button class="button" onClick={this.login}>Login</button>
                        </div>
                    }
                  </div>

                  <div>
                      <Link to="/startgame"><button id="selectBtn" class="button" >START GAME</button></Link>
                      <Link to="/choosePlayer"><button id="selectBtn" class="button" >CREATE AVATAR</button></Link>
                  </div>
            </div>
        );
    }

}

export default Menu;
