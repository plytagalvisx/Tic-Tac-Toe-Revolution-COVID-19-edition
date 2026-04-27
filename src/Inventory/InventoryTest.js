import React, {Component} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import firebase from "../firebaseConfig/firebaseConfig";
import {auth} from "../firebaseConfig/firebaseConfig";
import InventoryModal from "./InventoryModal";

class InventoryTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: "",
            isOpen: false,
            itemToAdd: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    async componentDidMount() {
        await auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    user: user
                });
            }
        });
    }

    handleChange(e) {
        this.setState({itemToAdd: e.target.value});
    };

    handleSubmit(event) {
        let itemRef = firebase.database().ref('/Item/' + this.state.itemToAdd);
        itemRef.once('value', (snap) => {
            if(snap.val() !== null) {
                let itemsInInventory = [];
                let userRef = firebase.database().ref('/User/' + this.state.user.uid);
                userRef.once('value', (snap) => {
                    if((snap.val() && snap.val().itemsInInventory)) {
                        if ((snap.val() && snap.val().itemsInInventory).length !== 0) {
                            itemsInInventory = (snap.val() && snap.val().itemsInInventory);
                        }
                    }
                    itemsInInventory.push(this.state.itemToAdd);

                    firebase.database().ref('/User/' + this.state.user.uid).update({
                        itemsInInventory: itemsInInventory
                    });
                });
                alert('Item: ' + this.state.itemToAdd + ' was added to your inventory!');
            }
        });
        event.preventDefault();
    }
    addItems = () => {
                let itemsInInventory = [];
                let userRef = firebase.database().ref('/User/' + this.state.user.uid);
                userRef.once('value', (snap) => {
                    if((snap.val() && snap.val().itemsInInventory)) {
                        if ((snap.val() && snap.val().itemsInInventory).length !== 0) {
                            itemsInInventory = (snap.val() && snap.val().itemsInInventory);
                        }
                    }
                    itemsInInventory.push("healing-potion");
                    itemsInInventory.push("anti-virus-attack-kit");
                    itemsInInventory.push("anti-virus-defense-kit");
                    itemsInInventory.push("anti-virus-bomb-defense");
                    itemsInInventory.push("anti-virus-bomb-attack");
                    itemsInInventory.push("immunity-syringe");
                    itemsInInventory.push("testosterone-pill");

                    firebase.database().ref('/User/' + this.state.user.uid).update({
                        itemsInInventory: itemsInInventory
                    });
                });
                alert('Item: ' + this.state.itemToAdd + ' was added to your inventory!');
    };

    render(){
        return(
            <div>
                <InventoryModal inGame={false} user={this.state.user} />
                <button onClick={this.addItems}>Add all items</button>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Item to add:
                        <input
                            type="text"
                            value={this.state.itemToAdd}
                            onChange={e => this.handleChange(e)}
                        />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>

        )
    }
}



export default InventoryTest;