import React, { Component } from 'react';
import { ButtonToolbar,
  ButtonGroup,
  Button,
  Modal,
  Form,
  Container,
  Navbar,
  Row, Col,
} from 'react-bootstrap';
import InstantlerNav from '../InstantlerNav.js'
import axios from 'axios'
import { List, Image, Input, Dropdown, Label, Icon, Card, Rating} from 'semantic-ui-react';
const url="http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/"

class UserNavBar extends Component {
  constructor(props){
    super(props);
    this.state={
      login:localStorage.getItem('token')?true:false
    }
    this.signout=this.signout.bind(this);
  }
  componentDidMount(){
    if(this.state.login){
      axios.get(url+"api/users/"+localStorage.getItem('id')+"/?format=json",{
        headers: {
          Authorization: 'Token '+localStorage.getItem('token')
        }
      })
      .then((res)=>{
        this.setState({
          first_name: res.data.first_name
        })
      })
      .catch((err)=>{
        console.log(err);
      })
    }
  }
  signout(){
    localStorage.clear();
    window.location = `${process.env.PUBLIC_URL}/`;
  }
  render(){
    const {login, first_name} = this.state;
    const trigger = (
      <span>
        <Image avatar src="../assets/user.jpg"/> {first_name}
      </span>
    )
    return(
      <>
        {login?
          <Navbar>
            <Icon size="large" name="food" inverted />
            <Navbar.Brand as="a" href='/'>Instantler</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end userName">
              <Dropdown trigger={trigger} className='icon' pointing>
                <Dropdown.Menu>
                  <Dropdown.Item as="a" icon="user" text="User Info"  href="/userInfo"/>
                  <Dropdown.Item  onClick={this.signout} icon="sign-out" text="Sign Out"/>
                </Dropdown.Menu>
              </Dropdown>
            </Navbar.Collapse>
          </Navbar>
          :
          <InstantlerNav usertype="common" />
        }
      </>

    )
  }

}


export default UserNavBar
