import React, { Component } from 'react';
import axios from 'axios';
import {List} from 'semantic-ui-react'
const url='http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/';

class ReservationInfo extends Component {

  constructor(props){
    super(props);
    this.state={
      currentReservation:[]
    }
  }
  componentDidMount(){
    axios.get(url+"reservation/?restaurant="+localStorage.getItem("restId"))
    .then((res)=>{
      console.log(res.data);
      let curr = [];
      for(let i=0;i<res.data.length;i++){
        let info =  {};
        if(res.data[i].dateTime === this.props.dateTime){
          axios.get(url+"table-type/"+res.data[i].type+"/")
          .then((response)=>{
            axios.get(url+'users/'+res.data[i].user)
            .then((res1)=>{
              info.type = response.data.type;
              info.first_name=res.data[i].first_name;
              info.guestNum = res.data[i].guestNum;
              info.email = res1.data.email;
              info.lastname= res1.data.last_name;
              curr.push(info);
            })

          })

        }
      }
      this.setState({
        currentReservation:curr
      })
    })
    .catch((err)=>{
      console.log(err);
    })
  }
  render(){
    const {currentReservation} = this.state;

    console.log(currentReservation);

    let customerList=[];
    for(let i=0;i<currentReservation.length;i++){
      customerList.push(
        <List.Item key={currentReservation[i]} className="reservationUsers">
          <List.Content>
            <List.Header>Name: {currentReservation[i].first_name} {currentReservation[i].last_name}</List.Header>
            <List.Description>{currentReservation[i].email}</List.Description>
          </List.Content>
          <List.Content floated="right">
            <List.Header>Number of Guests: {currentReservation[i].guestNum}</List.Header>
            Table Type: {currentReservation[i].type}
          </List.Content>
        </List.Item>
      )
    }
    return(
      <div>
        <List divided verticalAlign='middle' >
          {customerList.map(i=>{return i})}
        </List>
      </div>
    )
  }
}
export default ReservationInfo
