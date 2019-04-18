import React, { Component } from 'react';
import '../../styles/Reservation.css'
import Calendar from 'react-calendar';

import axios from 'axios'
import ReservationInfo from './ReservationInfo.js'
import {Rating, Label, Message, Form, Image, Tab, Item} from 'semantic-ui-react'
import {Button, ButtonToolbar, Modal} from 'react-bootstrap'
import TableDataInfo from './TableDataInfo.js'
const url='http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/';


class RestReservation extends Component{

  constructor(props){
    super(props);
    const date = new Date();
    var month = 0,dateNum=0;
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
    this.state={
      restaurant:{
      },
      dates:date,
      month:month,
      date:dateNum,
      year:date.getFullYear(),
      categories:[],
      hourMinutes:"",
      show:false
    }
    this.changeDate = this.changeDate.bind(this);
    this.handleClose= this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
  }
  componentDidMount(){
    axios.get(url+'restaurants/'+localStorage.getItem('restId')+"/")
    .then((res)=>{
      this.setState({
        restaurant:res.data
      })
    })
    .catch((err)=>{
      console.log(err);
    })
    axios.get("http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/restaurants-cat/"+localStorage.getItem('restId'))
    .then((response)=>{
      this.setState({
        categories:response.data.categories
      })
    }).catch((err)=>{
      console.log(err);
    })

  }
  changeDate(date){
    var month = 0,dateNum=0;
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
    this.setState({
      dates:date,
      month: month,
      date:dateNum,
      year:date.getFullYear()
    })

  }

  handleClose() {
    this.setState({ show:false });

  }

  handleShow(e) {
    this.setState({
      hourMinutes:e.target.value,
      show:true
    });
  }
  render(){
    const {restaurant, categories,dates, month, date, year,hourMinutes} = this.state;
console.log(categories)
    let timeButton= [];
    for(let i=8;i<=24;i++){
      if(i<10){
        timeButton.push(
          <Button key={`0${i}:00`} value={`0${i}:00`} onClick={this.handleShow}>{i}:00:00</Button>
        );
        timeButton.push(
          <Button key={`0${i}:30`} value={`0${i}:30`} onClick={this.handleShow}>{i}:30:00</Button>
        );
      } else {
        timeButton.push(
          <Button key={`${i}:00`} value={`${i}:00`} onClick={this.handleShow}>{i}:00:00</Button>
        );
        if(i<24){
          timeButton.push(
            <Button key={`0${i}:30`} value={`${i}:30`} onClick={this.handleShow}>{i}:30:00</Button>
          )
        }
      }
    }
    let i=0,timeColumns=[], timeRows=[];
    while(i<timeButton.length){
      for(let j=0;j<3;j++){
        timeColumns.push(timeButton[i]);
        i++;
      }
      timeRows.push(
        <div key={i} className="buttonRows">
          {timeColumns.map(i=>{return i})}
        </div>
      )
      timeColumns =[];
    }
    let dateTime = `${year}-${month}-${date}T${hourMinutes}:00Z`
    const panes = [
      { menuItem: 'Current Reservation Customers', render: () => <Tab.Pane><ReservationInfo dateTime={dateTime}/></Tab.Pane> },
      { menuItem: 'Current Table Type Info', render: () => <Tab.Pane><TableDataInfo dateTime={dateTime}/></Tab.Pane> },
    ]
    return (
      <div className="reservationSys">
        <h1>Reservation System</h1>
        <div className="reservation">

          <div className="reservation-selectDate">
            <Item.Group>
              <Item>
                <Item.Image size="large" src={restaurant.photo_url} />
                <Item.Content>
                  <Item.Header>{restaurant.name}</Item.Header>
                  <Item.Meta>
                    <Rating maxRating={5} rating={parseInt(restaurant.rating)} icon='star' size='huge' disabled/> <br/>
                  </Item.Meta>
                  <Item.Description>
                    {categories.map(i=>(
                      <Label key={i}>
                        {i}
                      </Label>
                    ))} <br/>
                    <b>Address: {restaurant.address}</b> <br/>
                    <b>City: {restaurant.city}</b> <br />
                    <b>State: {restaurant.state}</b><br />
                    <b>Price Range: {restaurant.price}</b><br />
                  </Item.Description>
                </Item.Content>
              </Item>
            </Item.Group>
            <Calendar onChange={this.changeDate} value={dates} />
          </div>
          <div className="reservation-dateButtons">

            <Message
              positive
              attached
              header={`Selected Date: ${month}/${date}/${year}`}
            />
            <Form className="attached fluid segment">
              <h3>Reservation time slots:</h3>
              {timeRows.map(i=>{return i})}
            </Form>
            <Modal
                show={this.state.show}
                onHide={this.handleClose}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                  Current Reservation Info
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Tab panes={panes} />
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </div>
    )
  }
}

export default RestReservation
