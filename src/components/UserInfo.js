import React, { Component } from 'react';
import EditRest from './RestaurantEnd/EditRest.js'
import {
  Image,
  Icon,
  Dropdown,
  Sidebar,
  Segment,
  Form,
  Message,
  Button,
  Tab,
  List,
  Rating,
  Popup
} from 'semantic-ui-react'
import{
  Navbar,
  MOdal,
} from 'react-bootstrap'
import '../styles/userInfo.css'
import axios from 'axios'

const url = "http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com"
//reder to restaurant

class RestaurantAccount extends Component {
  constructor(props){
    super(props)
    this.state={
      restaurantName: '',
      user:{}
    }
    this.updateUserFirst = this.updateUserFirst.bind(this);
    this.updateUserLast = this.updateUserLast.bind(this);
    this.updateUserEmail = this.updateUserEmail.bind(this);
    this.updateUserInfo = this.updateUserInfo.bind(this);
  }
  componentDidMount(){
    axios.get("http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/restaurants/"+localStorage.getItem('restId'))
    .then((res)=>{
      this.setState({
        restaurantName: res.data.name
      })
    })
    axios.get("http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/users/"+localStorage.getItem("id")+"/?format=json", {
      headers: {
        Authorization: 'Token '+localStorage.getItem('token')
      }
    })
    .then((res)=>{
      this.setState({
        user:res.data
      })
    })
  }


  updateUserFirst(e){
    const user = {...this.state.user, "first_name":e.target.value};
    this.setState({
      user
    })
  }
  updateUserLast(e){
    const user = {...this.state.user, "last_name":e.target.value};
    this.setState({
      user
    })
  }
  updateUserEmail(e){
    const user = {...this.state.user, "email":e.target.value};
    this.setState({
      user
    })
  }
  updateUserInfo(){
    const {user} = this.state;
    axios.put(url+"/api/users/"+localStorage.getItem("id")+"/", this.state.user, {
      headers: {
        Authorization: 'Token '+localStorage.getItem('token')
      }}).then((res)=>{
        window.location =`${process.env.PUBLIC_URL}/userInfo`;
      }).catch((err)=>{
        console.log(err)
      })
  }

  render(){
    const user = this.props.user;
    return(

      <div className="restaurantAccount">
        <Navbar>
          <Icon size="large"  name="food" />
          <Navbar.Brand href="/restaurant" >Instantler</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Dropdown trigger={this.props.trigger} className='icon' pointing>
              <Dropdown.Menu>
                <Dropdown.Item icon="user" text="User Info"  as="a" href="/userInfo"/>
                <Dropdown.Item icon="sign-out" text="Sign Out" onClick={this.props.signout}/>
              </Dropdown.Menu>
            </Dropdown>
          </Navbar.Collapse>
        </Navbar>
        <div className="accountInfo">
          <h1> Edit Restaurant Account Info</h1>
          <Form>
            <Form.Field>
              <label>First Name</label>
              <input onChange={this.updateUserFirst} placeholder={user.first_name} defaultValue={user.first_name} />
            </Form.Field>
            <Form.Field>
              <label>Last Name</label>
              <input onChange={this.updateUserLast} placeholder={user.last_name} defaultValue={user.last_name} />
            </Form.Field>
            <Form.Field>
              <label>Email Address</label>
              <input onChange={this.updateUserEmail} placeholder={user.email} defaultValue={user.email} />
            </Form.Field>
            <Form.Field>
              <Form.Input fluid label='Username' placeholder={user.username} readOnly />
            </Form.Field>
            <Form.Field>
              <Form.Input fluid label='Your Restaurant Name' placeholder={this.state.restaurantName} readOnly />
              {/* <Message compact>
                <Message.Header>To Edit your Restaurant Info</Message.Header>
                <Message.Content>
                  <Button fluid>Edit</Button>
                </Message.Content>
              </Message> */}
            </Form.Field>
            <Button onClick={this.updateUserInfo} fluid color="black">Save</Button>
          </Form>
        </div>
      </div>
    )
  }
}



//render to common User
class EditUserInfo extends Component {
  constructor(props){
    super(props);
    this.state={
        user:{}
    }
    this.updateUserFirst = this.updateUserFirst.bind(this);
    this.updateUserLast = this.updateUserLast.bind(this);
    this.updateUserEmail = this.updateUserEmail.bind(this);
    this.updateUserInfo = this.updateUserInfo.bind(this);
  }
  componentDidMount(){

    axios.get("http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/users/"+localStorage.getItem("id")+"/?format=json", {
      headers: {
        Authorization: 'Token '+localStorage.getItem('token')
      }
    })
    .then((res)=>{
      this.setState({
        user:res.data
      })
    })
  }

  updateUserFirst(e){
    const user = {...this.state.user, "first_name":e.target.value};
    this.setState({
      user
    })
  }
  updateUserLast(e){
    const user = {...this.state.user, "last_name":e.target.value};
    this.setState({
      user
    })
  }
  updateUserEmail(e){
    const user = {...this.state.user, "email":e.target.value};
    this.setState({
      user
    })
  }
  updateUserInfo(){
    const {user} = this.state;
    axios.put(url+"/api/users/"+localStorage.getItem("id")+"/", this.state.user, {
      headers: {
        Authorization: 'Token '+localStorage.getItem('token')
      }}).then((res)=>{
        window.location =`${process.env.PUBLIC_URL}/userInfo`;
      }).catch((err)=>{
        console.log(err);
      })
  }
  render(){
    const user = this.props.user

    return (
      <Form>
        <Form.Field>
          <label>First Name</label>
          <input onChange={this.updateUserFirst} placeholder={user.first_name} defaultValue={user.first_name} />
        </Form.Field>
        <Form.Field>
          <label>Last Name</label>
          <input onChange={this.updateUserLast} placeholder={user.last_name} defaultValue={user.last_name} />
        </Form.Field>
        <Form.Field>
          <label>Email Address</label>
          <input onChange={this.updateUserEmail} placeholder={user.email} defaultValue={user.email} />
        </Form.Field>
        <Form.Field>
          <Form.Input fluid label='Username' placeholder={user.username} readOnly />
        </Form.Field>
        <Button onClick={this.updateUserInfo}>Update</Button>
      </Form>

    )
  }
}
class UpcomingEvent extends Component {
  constructor(props){
    super(props)
    this.state={
      reservationExist: this.props.upcoming.length>0,
      reservationList:[]
    }
  }
  render(){
    const {reservationExist, reservationList} = this.state
    return (
      <div className="upcomingEvent">
        <h3>Upcoming Reservation of today</h3>
        {reservationExist?
          <List celled>
            {this.props.upcoming.map(i=>{
              return i
            })}
          </List>
          :
          <p>No upcoming reservation for today</p>
        }
      </div>
    )
  }
}
class PastEvent extends Component {
  constructor(props){
    super(props);
    this.state={
      pastEvent:[]
    }
    this.rateActivate = this.rateActivate.bind(this);
  }
  rateActivate(event,data){
    var info ={
      restaurant:data.restid,
      user:localStorage.getItem('id'),
      description:"gooo",
      rated:true,
      rating:data.rating
    }
    axios.put(url+"/api/review/"+data.value+'/', info)
    .then((res)=>{
      window.location =`${process.env.PUBLIC_URL}/userInfo`;
    })
    .catch((err)=>{
      console.log(err);
    })
  }

  componentDidMount(){
    var pastCom=[];
    axios.get(url+"/api/review/?user="+localStorage.getItem("id"))
    .then((res)=>{
        for(let i = 0; i<res.data.length; i ++){
          axios.get(url+"/api/restaurants/"+res.data[i].restaurant+"/")
          .then((response) => {
            pastCom.push(
              <List.Item>
                <List.Content >
                  <List.Header>Restaurant Name: {response.data.name}</List.Header>
                  <List.Description>Address:{response.data.address}</List.Description>
                  <List.Description>City:{response.data.city}</List.Description>
                </List.Content>
                <List.Content >
                  <List.Header>Phone:{response.data.phone_num}</List.Header>
                  <List.Description>Price:{response.data.price}</List.Description>
                </List.Content>
                <List.Content className="content2">
                  {res.data[i].rated?
                    <List.Description><Rating maxRating={5} restid={res.data[i].restaurant} disabled rating={res.data[i].rating}/></List.Description>
                    :
                    <Popup
                      trigger={<Button color="google plus">Rate</Button>}
                      content={<Rating value={res.data[i].id} restid={res.data[i].restaurant} onRate={this.rateActivate} maxRating={5}/>}
                      on="click"
                      hideOnScroll
                    />
                  }
                </List.Content>
              </List.Item>
            )
            this.setState({
              pastEvent:pastCom
            })
          })
        }
    })
  }
  render(){
    const {pastEvent} = this.state;
    return (
      <div className="passEvent">
        <h3>Past Reservation</h3>
        <List celled>
          {(this.state.pastEvent).map((i)=>{return i})}
        </List>

      </div>
    )
  }
}
class CommonAccount extends Component {
  constructor(props){
    super(props)
    this.state={
      upcomingEvent: []
    }
  }
  componentDidMount(){
    const date = new Date();
    var month = 0,dateNum=0, year = 0;
    if((date.getMonth()+1)<10){
      month= "0"+(date.getMonth()+1).toString();
    } else {
      month = date.getMonth()+1;
    }
    if(date.getDate()<10){
      dateNum = "0"+date.getDate();
    } else {
      dateNum = date.getDate();
    }
    year = date.getFullYear();
    axios.get("http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/reservation/?user="+localStorage.getItem('id'))
    .then((res)=>{
      let resYear, resMonth, resDate;
      var tempEvent = [];

      for(let i=0;i<res.data.length;i++){
        resYear = res.data[i].dateTime.slice(0,4);
        resMonth = res.data[i].dateTime.slice(5,7);
        resDate = res.data[i].dateTime.slice(8,10);
        if(resYear == year && resDate == dateNum && resMonth == month){
            tempEvent.push(res.data[i]);
        }
      }

      let componentList=[];
      for(let i=0;i<tempEvent.length;i++){
        axios.get('http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/restaurants/'+tempEvent[i].restaurant+'/')
        .then((res1)=>{
          componentList.push(
            <List.Item key={tempEvent[i].id}>
              {/* <List.Icon name='marker' /> */}
              <List.Content>
                <List.Header>
                  Restaurant Name: {res1.data.name}
                </List.Header>
                <List.Description>
                  Address1: {res1.data.address}
                </List.Description>
                <List.Description>
                  Address2: {res1.data.city}, {res1.data.state}
                </List.Description>
              </List.Content>
              <List.Content>
                <List.Header>Reservation Time: {tempEvent[i].dateTime.slice(11,19)}</List.Header>
                <List.Description>Phone Number: {res1.data.phone_num}</List.Description>
              </List.Content>
              <List.Content>
                <List.Header>
                  Name: {tempEvent[i].first_name}
                </List.Header>
                <List.Description>
                  Number of people: {tempEvent[i].guestNum}
                </List.Description>
              </List.Content>
            </List.Item>
          )
        })
      }
      this.setState({
        upcomingEvent:componentList
      })
    });

  }


  render(){
    const panes = [
      { menuItem: 'Edit User Info', render: () => <Tab.Pane><EditUserInfo user={this.props.user}/> </Tab.Pane> },
      { menuItem: 'Past Reservation', render: () => <Tab.Pane><PastEvent user={this.props.use} /></Tab.Pane> },
      { menuItem: 'Upcoming Reservation', render: () => <Tab.Pane><UpcomingEvent upcoming={this.state.upcomingEvent}/></Tab.Pane> },
    ]
    return(
      <div className="commonAccount">
        <Navbar>
          <Icon size="large"  name="food" inverted/>
          <Navbar.Brand href="/" >Instantler</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Dropdown trigger={this.props.trigger} className='icon' pointing>
              <Dropdown.Menu>
                <Dropdown.Item icon="user" text="User Info"  as="a" href="/userInfo"/>
                <Dropdown.Item icon="sign-out" text="Sign Out" onClick={this.props.signout}/>
              </Dropdown.Menu>
            </Dropdown>
          </Navbar.Collapse>
        </Navbar>
        <div className="accountInfo">
          <h1>Common User Info</h1>
          <Tab menu={{ fluid: true, vertical: true, tabular: true }} panes={panes} />
        </div>
      </div>
    )
  }
}



class UserInfo extends Component {
  constructor(props){
    super(props);
    this.state={
      user:{},
      isRestaurant: localStorage.getItem("restId")?true:false
    }
    this.signout = this.signout.bind(this);
  }
  componentDidMount(){

    axios.get("http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/users/"+localStorage.getItem("id")+"/?format=json", {
      headers: {
        Authorization: 'Token '+localStorage.getItem('token')
      }
    })
    .then((res)=>{
      this.setState({
        user:res.data
      })
    })
  }
  signout(){
    localStorage.clear();
    window.location =`${process.env.PUBLIC_URL}/`;
  }

  render(){
    const {user, isRestaurant} = this.state;
    const trigger = (
      <span className="userName">
        <Image avatar src="../assets/user.jpg"/>   {user.first_name}
      </span>
    )
    return (
      <>
        {isRestaurant?
          <RestaurantAccount user={user} trigger={trigger} signout={this.signout}/>
          :
          <CommonAccount user={user} trigger={trigger} signout={this.signout}/>
        }
      </>
    )
  }
}
export default UserInfo
