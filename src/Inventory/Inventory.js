import React, {Component} from "react";
import firebase from "../firebaseConfig/firebaseConfig";
import Item from "./Item";
import './Inventory.css';
import "../Styles/stylesheet.css";

class Inventory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name:"",
            image:"",
            itemsInInventory: [],
            output:""
        };
    }
    async componentDidMount(){
        let userRef = await firebase.database().ref('/User/' + this.props.user.uid);
        userRef.once('value', (snap) => {
            this.setState({
                name: (snap.val() && snap.val().name),
                image: (snap.val() && snap.val().image),
                itemsInInventory: (snap.val && snap.val().itemsInInventory),
            });
            this.createInventoryTable();
        });
    }
    createInventoryTable(){
        let table = [];
        let itemsInInventory = this.state.itemsInInventory;
        if(itemsInInventory)
            if(itemsInInventory.length === 0)
                table.push(<h4 class="text" key={"h4" + Math.random()}>You have not collected any items.</h4>);
            else for (let i = 0; i < itemsInInventory.length; i++) {
                table.push(<span key={"span" + Math.random()}><Item key={"inventoryItem" + Math.random()}
                                                                    player_full_health={this.props.player_full_health}
                                                                    yourTurn={this.props.yourTurn}
                                                                    useItem={this.props.useItem}
                                                                    item={this.state.itemsInInventory[i]}
                                                                    inGame={this.props.inGame}
                                                                    itemsInInventory={this.state.itemsInInventory}
                                                                    index={i}
                                                                    user={this.props.user}
                                                                    update={() => this.createInventoryTable()}/></span>);
            }
        else
            table.push(<h4 class="text" key={"h4" + Math.random()}>You have not collected any items.</h4>);
        this.setState({
            output: table
        });
    }
    render(){
        return(
            <div id="inventory">
                {this.state.output}
            </div>
        )
    }
}

export default Inventory;
