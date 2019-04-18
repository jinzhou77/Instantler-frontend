import React, { Component } from 'react';
import '../../styles/userHome.css';
import { ButtonToolbar,
  ButtonGroup,
  Button,
  Modal,
  Form,
  Container,
  Navbar,
  Row, Col,
} from 'react-bootstrap';
// import InstantlerNav from '../InstantlerNav.js'
import UserNavBar from './UserNavBar.js'
import { List, Image, Input, Dropdown, Label, Icon, Card, Rating} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Search from '../Search.js'


class UserHome extends Component {

  constructor(props){
    // super(...args);
    super(props);
    this.state= {
      value:'',
      login:localStorage.getItem('token')? true:false,
    }
  }


  render() {
    const login = this.state.login;
    const user = ""
    return (
      <div className="userHome">
        <UserNavBar/>
        <Search login={this.state.login} isCommon={true}/>
      </div>
    );
    }
}

export default UserHome
