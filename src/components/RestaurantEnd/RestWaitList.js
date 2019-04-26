import React, { Component } from 'react';
import axios from 'axios'


import {Button, Message, Segment, Header, Label, Rating,Item, List} from 'semantic-ui-react'
import '../../styles/waitList.css'
import EditRest from './EditRest.js'

class RestWaitList extends Component{
  constructor(props){
    super(props);
    this.state={
      restaurant:{},
      waitingNumber:0,
      servedNumber:0,
      currentWaitingUsers:[],
      wsID:0
    }
    this.updateWaitList = this.updateWaitList.bind(this);
    this.serve = this.serve.bind(this);
  }
  componentDidMount(){
    //in here request restaurant infos from API
    const url="http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/"
    axios.get(url+"restaurants/"+localStorage.getItem('restId'))
    .then((res)=>{
      this.setState({
        restaurant:res.data
      })
    }).catch((err)=>{
      console.log(err);
    })
    let wsListCom = [];
    axios.get("http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/wsnumber/?restaurant="+localStorage.getItem("restId"))
    .then((res)=>{
      this.setState({
        wsID: res.data[0].id,
        waitingNumber:res.data[0].waitingNumber,
        servedNumber: res.data[0].servedNumber
      })
      if(res.data[0].waitingNumber>0){
        axios.get("http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/waiting-user/?restaurant="+localStorage.getItem("restId"))
        .then((response)=>{
          console.log(response.data);
          for(let i=0;i<response.data.length;i++){
            axios.get("http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/users/"+response.data[i].user+"/")
            .then((user)=>{
              console.log(user);
              if(i==0){
                wsListCom.push(
                  <List.Item key={user.data.id}>
                    <List.Content>
                      <List.Header>First Name:{user.data.first_name}</List.Header>
                      <List.Description>Last Name: {user.data.last_name}</List.Description>
                    </List.Content>
                    <List.Content>
                      <List.Header>WaitingNumber: {response.data[i].myNumber}</List.Header>
                      <List.Description>username:{user.data.username}</List.Description>
                    </List.Content>
                    <Button value={response.data[i].id} onClick={this.serve}>Click to serve</Button>
                  </List.Item>
                )
              } else {
                wsListCom.push(
                  <List.Item key={user.data.id}>
                    <List.Content>
                      <List.Header>First Name:{user.data.first_name}</List.Header>
                      <List.Description>Last Name: {user.data.last_name}</List.Description>
                    </List.Content>
                    <List.Content>
                      <List.Header>WaitingNumber: {response.data[i].myNumber}</List.Header>
                      <List.Description>username:{user.data.username}</List.Description>
                    </List.Content>
                    <Button disabled>Click to serve</Button>
                  </List.Item>
                )
              }
              this.setState({
                currentWaitingUsers:wsListCom
              })
              console.log(this.state.currentWaitingUsers)
            })
          }
        });
      } else {
        this.setState({
          currentWaitingUsers:[]
        })
      }
    })
  }
  serve(e){
    let tempServed = this.state.servedNumber+1;
    this.setState({
      servedNumber:tempServed
    })
    let wuID = e.target.value;
    var info = {
      "restaurant": localStorage.getItem("restId"),
      "waitingNumber": this.state.waitingNumber,
      "servedNumber": tempServed
    }
    axios.put('http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/wsnumber/'+localStorage.getItem("restId")+"/", info)
    .then((res)=>{
      axios.delete("http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/waiting-user/"+wuID+"/")
      .then((res)=>{
        window.location =`${process.env.PUBLIC_URL}/restaurant`;
      })
      .catch((err)=>{
        console.log(err);
      })
    }).catch((err)=>{
      console.log(err);
    })
  }
  updateWaitList(){
    let info = {
      restaurant: localStorage.getItem('restId'),
      waitingNumber:this.state.waitingNumber,
      servedNumber: this.state.servedNumber+1
    }
    axios.put("http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/wsnumber/"+this.state.wsID+"/", info)
    .then((res)=>{
      console.log('successfully updated')
    }).catch((err)=>{
      console.log(err);
    })
  }
  render(){
    const {currentWaitingUsers, restaurant} = this.state

    return (
      <EditRest page={
        <div className="restWaitList">
          <h1>Restaurant WaitList Information</h1>
          <div className="waitListHeader">
            <div className="restWSnum">
              <Item.Group>
                <Item>
                  <Item.Image size="large" src={restaurant.photo_url} />
                  <Item.Content>
                    <Item.Header>{restaurant.name}</Item.Header>
                    <Item.Meta>
                      <Rating maxRating={5} rating={parseInt(restaurant.rating)} icon='star' size='huge' disabled/> <br/>
                    </Item.Meta>
                    <Item.Description>
                      <b>Address: {restaurant.address}</b> <br/>
                      <b>City: {restaurant.city}</b> <br />
                      <b>State: {restaurant.state}</b><br />
                      <b>Price Range: {restaurant.price}</b><br />
                      <Message compact negative>
                        <Message.Content>
                          Current Waiting Number:<b>{this.state.waitingNumber}</b>
                        </Message.Content>
                      </Message> <br />
                      <Message compact positive>
                        <Message.Content>
                          Current Serving Number:<b>{this.state.servedNumber}</b>
                        </Message.Content>
                      </Message>
                    </Item.Description>
                  </Item.Content>
                </Item>
              </Item.Group>

            </div>
            <div className="resList">
              <h1>Wait List</h1>
              <List divided celled>
                {
                  currentWaitingUsers.map((i)=>{return i})
                }
              </List>
            </div>
          </div>
        </div>
      } />
    )
  }
}

export default RestWaitList
