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
    const restaurant = this.props.restaurant;
    this.state={
      restaurant:{
        user: localStorage.getItem('id'),
        name:restaurant.name,
        address: restaurant.address,
        city: restaurant.city,
        state: restaurant.state,
        price: restaurant.price,
        photo_url: restaurant.photo_url,
        rating: restaurant.rating,
        ratings_count:restaurant.ratings_count,
        phone_num: restaurant.phone_num
      },
      categories:[]
    }
    this.handleNameChange= this.handleNameChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleCityChange = this.handleCityChange.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.handlePhotoURLChange = this.handlePhotoURLChange.bind(this);
    this.updateInfo = this.updateInfo.bind(this);

  }
  componentDidMount(){
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
    const restaurant = {...this.state.restaurant, 'city':e.target.value};
    this.setState({
      restaurant
    })
  }
  handleStateChange(e){
    const restaurant = {...this.state.restaurant, 'state':e.target.value};
    this.setState({
      restaurant
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
    })
    .catch(err=>{
      console.log(err);
    })
  }
  render(){
    const restaurant = this.props.restaurant;
    console.log(restaurant);
    return (
      <div className="updateRestInfo">
        <Form onSubmit={this.updateInfo}>
          <h3>Update Restaurant Information</h3>
          <Form.Row>
              <Form.Group as={Col} controlId="formGridRestName">
                  <Form.Label>Restaurant Name</Form.Label>
                  <Form.Control onChange={this.handleNameChange} placeholder={restaurant.name} />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridRestAddress">
                  <Form.Label>Restaurant Street Address</Form.Label>
                  <Form.Control onChange={this.handleAddressChange} placeholder={restaurant.address} />
              </Form.Group>
          </Form.Row>
          <Form.Row>
              <Form.Group as={Col} controlId="formGridRestCity" >
                  <Form.Label>Restaurant City</Form.Label>
                  <Form.Control as="select" onChange={this.handleCityChange} defaultValue={restaurant.city}>
                      <option>Choose...</option>
                      <option>Chicago</option>
                      <option>Los Angeles</option>
                      <option>New York City</option>
                  </Form.Control>
              </Form.Group>
              <Form.Group as={Col} controlId="formGridRestState">
                  <Form.Label>Restaurant State</Form.Label>
                  <Form.Control as="select" onChange={this.handleStateChange} defaultValue={restaurant.state}>
                      <option>Choose...</option>
                      <option>IL</option>
                      <option>CA</option>
                      <option>NY</option>
                  </Form.Control>
              </Form.Group>
              <Form.Group as={Col} controlId="formGridPrice">
                  <Form.Label>Restaurant Price Range</Form.Label>
                  <Form.Control as="select" onChange={this.handlePriceChange} defaultValue={restaurant.price}>
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
                  <Form.Control onChange={this.handlePhoneChange} placeholder={restaurant.phone_num}/>
              </Form.Group>
              <Form.Group as={Col} controlId="formGridPhoneURL">
                  <Form.Label>Restaurant's Photo URL</Form.Label>
                  <Form.Control onChange={this.handlePhotoURLChange} placeholder={restaurant.photo_url}/>
              </Form.Group>
          </Form.Row>

          <Button type="submit" fluid color="green">
            Update the info
          </Button>
        </Form>


      </div>
    )
  }
}

export default UpdateRestInfo
