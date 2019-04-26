import React, { Component } from 'react';
import {Icon,
    Button,
    Dropdown,
    Image,
    Sidebar,
    Segment,
    Menu,
    List,
    Divider,Breadcrumb
  } from 'semantic-ui-react'
import {Navbar, Modal, Form, Row, Col} from 'react-bootstrap'
import '../../styles/EditRest.css'
import UpdateRestInfo from './UpdateRestInfo.js'
import RestReservation from './RestReservation'
import RestWaitList from './RestWaitList'
import RestaurantHomePage from './RestaurantHomePage'
import RestInfo from './RestInfo.js'
import axios from 'axios'
import {Redirect} from 'react-router-dom'
class EditRest extends Component {
  constructor(props){
    super(props);
    this.state={
      visible:false,
      restId:0,
      first_name:'Did not Login',
    }
    this.handleClick = this.handleClick.bind(this);
    this.signout=this.signout.bind(this);
  }
  signout(){
    localStorage.clear();
    window.location =`${process.env.PUBLIC_URL}/`;
  }
  componentDidMount(){

    axios.get("http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/users/"+localStorage.getItem("id")+"/?format=json", {
      headers: {
        Authorization: 'Token '+localStorage.getItem('token')
      }
    })
    .then((res)=>{
      this.setState({
        first_name:res.data.first_name,
        restId: res.data.restaurant
      })
      localStorage.setItem('restId', res.data.restaurant)
    })
    .catch((err)=>{
      console.log(err);
    })
  }
  handleClick(){
    const visible = this.state.visible;
    if(visible){
      this.setState({
        visible:false,
      })
    } else{
      this.setState({
        visible:true
      })
    }
  }
  render(){
    const trigger = (
      <span className="userName">
        <Image avatar src="../assets/user.jpg"/>   {this.state.first_name}
      </span>
    )
    return(
      <div className="editRest">
        <Navbar>
          <Icon size="large" bordered={true}  name="sidebar" onClick={this.handleClick} />
          <Navbar.Brand href="/restaurant" >Instantler</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end userName">
            <Dropdown trigger={trigger} className='icon' pointing>
              <Dropdown.Menu>
                <Dropdown.Item icon="user" text="User Info"  as="a" href="/userInfo"/>
                <Dropdown.Item icon="sign-out" text="Sign Out" onClick={this.signout}/>
              </Dropdown.Menu>
            </Dropdown>
          </Navbar.Collapse>
        </Navbar>
        <Sidebar.Pushable as={Segment}>
          <Sidebar
            as={Menu}
            animation='overlay'
            inverted
            onHide={this.handleSidebarHide}
            vertical
            visible={this.state.visible}
            width='wide'>
            <Menu.Item as="a" href={`${process.env.PUBLIC_URL}/restaurant/`}>
              <Icon name='building' />
              Your Restaurant
            </Menu.Item>

            <Menu.Item as="a" href={`${process.env.PUBLIC_URL}/restaurant/tableType`}>
              <Icon name='male' />
              Table Type
            </Menu.Item>


            <Menu.Item as="a" href={`${process.env.PUBLIC_URL}/restaurant/reservation`}>
              <Icon name='utensils' />
              Reservation
            </Menu.Item>

            <Menu.Item href={`${process.env.PUBLIC_URL}/restaurant/waitlist`}>
              <Icon name='file alternate' />
              WaitList
            </Menu.Item>
          </Sidebar>

          <Sidebar.Pusher dimmed={this.state.visible}>

            <Segment basic>
               {this.props.page}
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>

      </div>
    );
  }
}

export default EditRest
