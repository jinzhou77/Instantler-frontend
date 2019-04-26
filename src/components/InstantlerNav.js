import React, { Component } from 'react';

import {Navbar, Modal, Form,Row,Col} from 'react-bootstrap'
import {Icon,Button, Message} from 'semantic-ui-react'
import axios from 'axios'


class Login extends Component {
  constructor(props){
    super(props);
    var is_restaurant=false, is_common=false;
    if(this.props.usertype=="restaurant"){
      is_restaurant= true;
    } else {
      is_common = true;
    }
    this.state={
      user:{
        username:'',
        password:'',
        is_common: is_common,
        is_restaurant: is_restaurant,
      },
      validate:true
    }
    this.handleCommonUserName=this.handleCommonUserName.bind(this);
    this.handleCommonPassword=this.handleCommonPassword.bind(this);
    this.handle_login = this.handle_login.bind(this);
  }
  handleCommonUserName(e){
    const user = {...this.state.user, "username":e.target.value};
    this.setState({user})
  }
  handleCommonPassword(e){
    const user = {...this.state.user, "password":e.target.value};
    this.setState({user});
  }
  handle_login(){
    axios.post('http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/login/', this.state.user)
    .then((json)=>{
      console.log(json);
      localStorage.setItem('token', json.data.token);
      localStorage.setItem('id', json.data.id);
      this.setState({
        validate:true
      })
      console.log(this.props.usertype);
      if(this.props.usertype==='common'){
        window.location =`${process.env.PUBLIC_URL}/`;
      } else {
        window.location =`${process.env.PUBLIC_URL}/restaurant`;
      }
    })
    .catch((err)=>{
      this.setState({
        validate:false
      })
    })
  }
  render (){
    const user = this.state.user;
    return (
        <Modal className="login"
          {...this.props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              User Log In
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formGroupCommonEmail">
                <Form.Label>username:</Form.Label>
                <Form.Control onChange={this.handleCommonUserName} placeholder="Enter username *" />
              </Form.Group>
              <Form.Group controlId="formGroupCommonPassword">
                <Form.Label>password:</Form.Label>
                <Form.Control onChange={this.handleCommonPassword} type="password" placeholder="Password *" />
              </Form.Group>
              <Form.Control.Feedback type="invalid">
                Invalid username and password!
              </Form.Control.Feedback>
            </Form>
            <Message error hidden={this.state.validate}>
              <Message.Header>
                The username and password is not match to our database.
              </Message.Header>
            </Message>
          </Modal.Body>
          <Modal.Footer>
            <Button inverted color='red' onClick={this.handle_login}>Sign In</Button>
          </Modal.Footer>
        </Modal>
    )
  }
}


class Signup extends Component {
  constructor(props){
    super(props);

    this.state={
      user: {
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        usertype:this.props.usertype,
        preference: []
      },
      isCommon: this.props.usertype=='common',
      verify:true,
      disable:true,
      validate:true,
    }
    this.handleFirstChange = this.handleFirstChange.bind(this);
    this.handleLastChange = this.handleLastChange.bind(this);
    this.handleUserNameChange = this.handleUserNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handle_signup = this.handle_signup.bind(this);
    this.handlePreference = this.handlePreference.bind(this);
    this.handleVerifyPassword = this.handleVerifyPassword.bind(this);
  }
  handleFirstChange(e){
    const user = {...this.state.user, "first_name":e.target.value};
    this.setState({user});
  }
  handleLastChange(e){
    const user = { ...this.state.user, "last_name": e.target.value };
    this.setState({ user });
  }
  handleUserNameChange(e) {
    const user = { ...this.state.user, "username": e.target.value };
    this.setState({ user });
  }
  handleEmailChange(e) {
    const user = { ...this.state.user, "email": e.target.value };
    this.setState({ user });
  }
  handlePasswordChange(e) {
    const user = { ...this.state.user, "password": e.target.value };
    this.setState({ user });
  }

  handleVerifyPassword(e){
    if(e.target.value===this.state.user.password){
      this.setState({
        verify:true,
        disable: false
      });
    } else {
      this.setState({
        verify:false,
        disable:true
      });

    }
  }
  handlePreference(e){
    console.log(e.target.value);
    let user = {...this.state.user}

    if(user.preference.includes(e.target.value)){
      for(let i=0;i<user.preference.length;i++){
        if(user.preference[i]===e.target.value){
          user.preference.splice(i,1);
        }
      }
    }else {
      user.preference.push(e.target.value);
    }
    this.setState({
      user
    })
  }
  handle_signup() {
    console.log(this.state.verify)
    if(this.state.verify){
      axios.post("http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/users/", this.state.user)
        .then((json) => {
          var is_restaurant = false;
          var is_common = false;
          if(this.state.user.usertype==='common'){
            is_common = true;
          } else if(this.state.user.usertype==='restaurant'){
            is_restaurant = true;
          }
          const user={
            username: this.state.user.username,
            password: this.state.user.password,
            is_restaurant: is_restaurant,
            is_common: is_common
          }
          console.log(user);
          axios.post("http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/login/", user)
          .then((res)=>{
            this.setState({
              validate:false
            })
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('id', res.data.id);
            console.log(this.props.usertype);
            if(this.props.usertype==='common'){
              window.location =`${process.env.PUBLIC_URL}/`;
            } else {
              window.location =`${process.env.PUBLIC_URL}/restaurant`;
            }
          })
          .catch((err)=>{
            console.log(err);
          })

        })
        .catch((err)=>{
          console.log(err);
          this.setState({
            validate:false
          })
        })
      }
  }

  render(){
    console.log(this.state.verify);
    const preference = ["american", "seafood", "steak", "fast", "bar", "finedining", "chinese",  "japanese", "korean", "mexican", "pizza", "breakfast", "noodle", "italian", "mediterranean","french","vegetarian"];
    let preferenceComp = [];
    preference.map((elem)=>{
      preferenceComp.push(
        <Form.Check key={elem} id={elem} type="checkbox" label={elem} value={elem} onClick={this.handlePreference}/>
      )
    })

    return (
      <Modal className="signup"
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Welcome to Instantler
          </Modal.Title>
          </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formGroupFirst">
              <Form.Label>First Name:</Form.Label>
              <Form.Control onChange={this.handleFirstChange} type="text" placeholder="First Name *" />
            </Form.Group>
            <Form.Label>Last Name:</Form.Label>
            <Form.Group controlId="formGroupLast">
              <Form.Control onChange={this.handleLastChange} type="text" placeholder="Last Name *" />
            </Form.Group>
            <Form.Label>UserName: </Form.Label>
            <Form.Group controlId="formGroupUserName">
              <Form.Control onChange={this.handleUserNameChange} type="text" placeholder="Username *" />
            </Form.Group>
            <Form.Label>Email Address: </Form.Label>
            <Form.Group controlId="formGroupEmail">
              <Form.Control onChange={this.handleEmailChange} type="email" placeholder="Enter email *" />
            </Form.Group>
            <Form.Label>Password: </Form.Label>
            <Form.Group controlId="formGroupPassword">
              <Form.Control onChange={this.handlePasswordChange} type="password" placeholder="Password *" />
            </Form.Group>
            <Form.Group controlId="formGroupPassword">
              <Form.Label>Re-type Password: </Form.Label>
              <Form.Control type="password" placeholder="Re-enter Password *" onChange={this.handleVerifyPassword}/>
              <Message negative hidden={this.state.verify}>
                <p>The password you entered did not match</p>
              </Message>
            </Form.Group>
            {
              this.state.isCommon?
              <Form.Group>
                <Form.Label>Preference for restaurants: </Form.Label>
                {preferenceComp.map((i)=>{return i})}
              </Form.Group>
              :null
            }
          </Form>
          <Message negative hidden={this.state.validate}>
            <Message.Header>The username/Email is invalid</Message.Header>
            <p>Might becasue the email format is not correct, or username is already exist. Please check it again</p>
          </Message>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={this.state.disable} inverted color='red' onClick={this.handle_signup}>Create Account</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

class InstantlerNav extends Component{

  constructor(props){
    super(props);
    var state,redirect, usertype;
    if(this.props.usertype=='common'){
      state='Owner of Restaurant?';
      redirect='restaurant';
      usertype='common';
    } else if(this.props.usertype=='restaurant'){
      state='Common User?';
      redirect='';
      usertype='restaurant';
    }
    this.state={
      switchType:state,
      redirect:redirect,
      loginShow:false,
      signupShow:false,
      usertype:usertype,
    }
  }

  render(){
    const loginShow = this.state.loginShow;
    const signupShow = this.state.signupShow;
    let signupClose = () => this.setState({ signupShow: false });
    let loginClose = () => this.setState({ loginShow: false });
    return(
      <div className="instantlerNav">
        <Navbar>
          <Icon size="large" name="food" inverted />
          <Navbar.Brand as="a" href='/'>Instantler</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Button as="a" href={`/${this.state.redirect}`} inverted>{this.state.switchType}</Button>
            <Button onClick={() => { this.setState({ signupShow: true }) }} inverted>Signup</Button>
            <Button onClick={() => { this.setState({ loginShow: true }) }} inverted>Login</Button>
          </Navbar.Collapse>
        </Navbar>
        <Login show={loginShow} onHide={loginClose} usertype={this.state.usertype}/>
        <Signup show={signupShow} onHide={signupClose} usertype={this.state.usertype}/>
      </div>
    )
  }
}
export default InstantlerNav
