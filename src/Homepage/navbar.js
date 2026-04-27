import React, {Component} from "react";
import {Nav, NavItem, Navbar, Badge, NavDropdown} from "react-bootstrap";
import Music from "../Music/Music";

class Bar extends Component{
  constructor(props){
    super(props);
    this.state = {
      currentWindow: ""
    }
  }


  getNewPage = () =>{
      var splitURL = window.location.href.split("/")
      var componentPage = splitURL[3];
      return componentPage;
  } 

  render(){
    return(
      <Navbar id ="HeadBar"inverse fixedTop collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="/"><p class="Title2">Tic-Tac-Toe Revolution: COVID-19</p></Navbar.Brand>
          <Navbar.Collapse id="responsive-navbar-nav">
          </Navbar.Collapse>
          <Music currentWindow={this.getNewPage()}/>
        </Navbar>
    );
  }
}
export default Bar;
