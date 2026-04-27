import React, {Component} from "react";
import firebase, {auth, provider} from "../firebaseConfig/firebaseConfig";
import "bootstrap/dist/css/bootstrap.min.css";

class DatabaseTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: "",
            name: ""
        };
        this.logout = this.logout.bind(this);
        this.login = this.login.bind(this);
        this.writeToDatabase = this.writeToDatabase.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({user});
            }
        });

    }

    logout() {
        firebase.auth().signOut();
        this.setState({user: null});
    }

    handleChange(event) {
        this.setState({name: event.target.value});
    };

    handleSubmit(event) {
        this.writeToDatabase();
        event.preventDefault();
    }

    writeToDatabase() {
        if(this.state.user.uid) {
            if (firebase.database().ref('/User/' + this.state.user.uid)) {
                firebase.database().ref('/User/' + this.state.user.uid).set({
                    name: this.state.name,
                });
            }
        }
    }

    login() {
        auth.signInWithPopup(provider)
            .then((result) => {
                const user = result.user;
                this.setState({user});
            });
    }

    render() {
        console.log("User: ", this.state.user);
        if(this.state.user) {
            console.log("uid: ", this.state.user.uid);
            console.log("database: ", firebase.database().ref('/User/' + this.state.user.uid));
        }
        return (
            <div>
                <div className="title">
                    <p>Tic-Tac-Toe Revolution: COVID-19 edition</p>
                </div>

                <div>
                    {this.state.user ?
                        <div>
                            <div>Welcome {this.state.user.displayName}!</div>
                            <div >
                                <button onClick={this.logout}>Logout</button>
                                <form onSubmit={this.handleSubmit}>
                                    <label>
                                        Name:
                                        <input type="text" value={this.state.name} onChange={this.handleChange} />
                                    </label>
                                    <input type="submit" value="Write To Database" />
                                </form>
                            </div>
                        </div>
                        : <button onClick={this.login}>Login</button>
                    }
                </div>
            </div>
        );
    }

}



export default DatabaseTest;