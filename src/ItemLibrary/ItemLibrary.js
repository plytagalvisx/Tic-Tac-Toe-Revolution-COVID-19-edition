import React, {Component} from "react";
import firebase, {auth, provider} from "../firebaseConfig/firebaseConfig";

class ItemLibrary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemsFromDb: []
        };
    }

    async componentDidMount() {
        const itemsRef = await firebase.database().ref("Item");
        itemsRef.once('value', (snap) => {
            let items = snap.val();
            let newState = [];
            for (let item in items) {
                newState.push({
                    id: item,
                    name: items[item].name,
                });
            }
            this.setState({
                itemsFromDb: newState
            });
        });
    }


    render() {
        let itemsContainer;
        itemsContainer = this.state.itemsFromDb.map((item) => {
            return (
                <div key={item.id}>
                    {item.name}
                </div>
            )
        });
        return (
            <div>Hello
                {itemsContainer}
            </div>
        );
    }

}

export default ItemLibrary;