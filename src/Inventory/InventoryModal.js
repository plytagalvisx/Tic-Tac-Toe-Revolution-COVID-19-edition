import React, {Component} from "react";
import Modal from 'react-bootstrap/Modal';
import Inventory from "./Inventory";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Styles/stylesheet.css";


class InventoryModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
        };
    }

    showModal = () => {
        this.setState({isOpen: true});
    };

    hideModal = () => {
        this.setState({isOpen: false});
    };

    render(){
        return(
            <div id={"inventoryButton"}>
                <img id="inventoryImage" src="https://firebasestorage.googleapis.com/v0/b/tic-tac-toe-revolution-covid19.appspot.com/o/bag.png?alt=media&token=e918f621-6162-4ba0-bc66-83586d29fc11" type="button" onClick={this.showModal} alt="Inventory"/>
                <Modal show={this.state.isOpen} onHide={this.hideModal}>
                    <Modal.Header><span class="text">Inventory</span></Modal.Header>
                        <Modal.Body>
                            <Inventory
                                user={this.props.user}
                                inGame={this.props.inGame}
                                useItem={this.props.useItem}
                                yourTurn={this.props.yourTurn}
                                player_full_health={this.props.player_full_health}
                            />
                        </Modal.Body>
                    <Modal.Footer>
                        <button class="button" onClick={this.hideModal}>Close</button>
                    </Modal.Footer>
                </Modal>
            </div>

        )
    }
}



export default InventoryModal;
