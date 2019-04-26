import React, { Component } from 'react';

import {
  Form,
  Row,
  Col,
  Modal,
} from 'react-bootstrap'
import axios from 'axios'
import {Button} from 'semantic-ui-react'
class UpdateRestInfo extends Component{
  constructor(props){
    super(props);
    const restaurant = {...this.props.restaurant};
    this.state={
      restaurant:{},
      categories:[]
    }
    this.handleNameChange= this.handleNameChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleCityChange = this.handleCityChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.handlePhotoURLChange = this.handlePhotoURLChange.bind(this);
    this.updateInfo = this.updateInfo.bind(this);

  }

  componentDidMount(){

    axios.get("http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/restaurants/"+localStorage.getItem("restId")+"/")
    .then((res)=>{
        this.setState({
          restaurant:res.data
        })
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
  handleNameChange(e){
    const restaurant = {...this.state.restaurant, 'name':e.target.value};
    this.setState({
      restaurant
    })
  }
  handleAddressChange(e){
    const restaurant = {...this.state.restaurant, 'address':e.target.value};
    this.setState({
      restaurant
    })
  }
  handleCityChange(e){
    const value = e.target.value;
    var restaurant = {...this.state.restaurant};
    if(value=='Chicago'){
      restaurant.city="Chicago";
      restaurant.state="IL";
    } else if(value=="New York"){
      restaurant.city="New York";
      restaurant.state="NY";
    } else if(value=="Los Angeles"){
       restaurant.city="Los Angeles";
       restaurant.state="CA";
    }
    this.setState({
      restaurant:restaurant
    })
  }

  handlePriceChange(e){
    const restaurant = {...this.state.restaurant, 'price':e.target.value};
    this.setState({
      restaurant
    })
  }
  handlePhoneChange(e){
    const restaurant = {...this.state.restaurant, 'phone_num':e.target.value};
    this.setState({
      restaurant
    })
  }
  handlePhotoURLChange(e){
    const restaurant = {...this.state.restaurant, 'photot_url':e.target.value};
    this.setState({
      restaurant
    })
  }

  updateInfo(){
    const restaurant = {...this.state.restaurant, "categories":this.state.categories};
    console.log(restaurant);
    axios.put("http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/restaurants/"+localStorage.getItem('restId')+"/", restaurant)
    .then((res)=>{
      console.log(res);
      window.location =`${process.env.PUBLIC_URL}/restaurant`;
    })
    .catch(err=>{
      console.log(err);
    })
  }
  render(){
    const restaurant = this.state.restaurant;
    console.log(this.props.restaurant);
    console.log(restaurant);
    return (
      <div className="updateRestInfo">
        <Form>
          <h3>Update Restaurant Information</h3>
          <Form.Row>
              <Form.Group as={Col} controlId="formGridRestName">
                  <Form.Label>Restaurant Name</Form.Label>
                  <Form.Control onChange={this.handleNameChange} placeholder={this.props.restaurant.name} />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridRestAddress">
                  <Form.Label>Restaurant Street Address</Form.Label>
                  <Form.Control onChange={this.handleAddressChange} placeholder={this.props.restaurant.address} />
              </Form.Group>
          </Form.Row>
          <Form.Row>
              <Form.Group as={Col} controlId="formGridRestCity" >
                  <Form.Label>Restaurant City</Form.Label>
                  <Form.Control as="select" onChange={this.handleCityChange} defaultValue={this.props.restaurant.city}>
                      <option>Choose...</option>
                      <option value="Chicago">Chicago</option>
                      <option value="Los Angeles">Los Angeles</option>
                      <option value="New York">New York</option>
                  </Form.Control>
              </Form.Group>
              <Form.Group as={Col} controlId="formGridPrice">
                  <Form.Label>Restaurant Price Range</Form.Label>
                  <Form.Control as="select" onChange={this.handlePriceChange} defaultValue={this.props.restaurant.price}>
                    <option>Choose...</option>
                    <option>$</option>
                    <option>$$</option>
                    <option>$$$</option>
                    <option>$$$$</option>
                  </Form.Control>
              </Form.Group>
          </Form.Row>
          <Form.Row>
              <Form.Group as={Col} controlId="formPhone">
                  <Form.Label>Owner's Phone Number</Form.Label>
                  <Form.Control onChange={this.handlePhoneChange} placeholder={this.props.restaurant.phone_num}/>
              </Form.Group>
              <Form.Group as={Col} controlId="formGridPhoneURL">
                  <Form.Label>Restaurant's Photo URL</Form.Label>
                  <Form.Control onChange={this.handlePhotoURLChange} placeholder={this.props.restaurant.photo_url}/>
              </Form.Group>
          </Form.Row>
        </Form>
        <Button onClick={this.updateInfo} fluid color="green">
          Update the info
        </Button>

      </div>
    )
  }
}

export default UpdateRestInfo
