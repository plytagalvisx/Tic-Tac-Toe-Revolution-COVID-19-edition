import React, {Component} from "react";
import firebase from "../firebaseConfig/firebaseConfig";

import Floater from "react-floater";
import Modal from "react-bootstrap/Modal";
import './Item.css';
import "../Styles/stylesheet.css";

class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            player_full_health: this.props.player_full_health
        };
        this.useItem = this.useItem.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    async componentDidMount(){
        let itemRef = await firebase.database().ref('/Item/' + this.props.item);
        itemRef.on('value', (snap) => {
            let item = snap.val();
            this.setState({
                name: (item && item.name),
                description: (item && item.description),
                image: (item && item.image),
                ap: (item && item.ap),
                damage: (item && item.damage),
                defense: (item && item.defense),
                target: (item && item.target),
                turns: (item && item.turns)
            });
        });

        this.setState({
            player_full_health: this.props.player_full_health
        });
    }

    showModal = () => {
        this.setState({isOpen: true});
    };

    hideModal = () => {
        this.setState({isOpen: false});
    };

    useItem = () => {
        if(this.state.target === 0 && (this.state.damage < 0) && this.state.player_full_health) {
            alert("Your health is full");
        } else {
            console.log("Item.js your turn: " + this.props.yourTurn);
            if (this.props.yourTurn) {
                let itemsInInventory = this.props.itemsInInventory;
                itemsInInventory.splice(this.props.index, 1);
                firebase.database().ref('/User/' + this.props.user.uid).update({
                    itemsInInventory: itemsInInventory
                });
                this.props.useItem({
                    "target": this.state.target,
                    "ap": this.state.ap,
                    "defense": this.state.defense,
                    "turns": this.state.turns,
                    "damage": this.state.damage,
                    "name": this.state.name
                });
                this.hideModal();
                this.props.update();
            } else {
                alert("not your turn");
            }
        }
    };


    createItem(){
        if(this.props.inGame === true){
            return(
                <div className="item" >
                    <Modal show={this.state.isOpen} onHide={this.hideModal} dialogClassName={"item-modal"}>
                        <Modal.Header><p class="text">Use Item?</p></Modal.Header>
                        <Modal.Body><button class="button" onClick={this.useItem}>Yes</button><button class="button" onClick={this.hideModal}>No</button></Modal.Body>
                    </Modal>
                    <Floater
                        title={this.state.name}
                        content={this.state.description}
                        event="hover"
                        eventDelay={0}
                        styles={{
                            options: {
                                zIndex:2000,
                            }
                        }}
                    >
                        <img src={this.state.image} alt={this.state.name} onClick={this.showModal}/>
                    </Floater>
                </div>
            )
        }
        else{
            return(
            <div className="item">
                <Floater  class="text"
                    title={this.state.name}
                    content={this.state.description}
                    event="hover"
                    eventDelay={0}
                    styles={{
                        options: {
                            zIndex:2000,
                        }
                    }}
                >
                    <img src={this.state.image} alt={this.state.name}/>
                </Floater>
            </div>)
        }
    }

    render(){
        console.log("this.props.player_full_health: ", this.state.player_full_health);
        return(
            this.createItem()
        )
    }
}

export default Item;
