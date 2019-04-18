import React, { Component } from 'react';
import {
    ButtonToolbar,
    ButtonGroup,
    Modal,
    Form,
    Container,
    Row, Col,
} from 'react-bootstrap'
import {Input, Button} from 'semantic-ui-react'
import '../../styles/createRes.css';
import axios from 'axios'
import RestInfo from './RestInfo.js'
class CreateRest extends Component { // if the user have existing restaurant, display the restaurant info, otherwise, allow user to create new restaurant
    constructor(props){
      super(props);
      this.state={
        restExist: this.props.restId!=0,
        restId:this.props.restId,
        restaurant:{
          user:localStorage.getItem('id'),
          address:"",
          phone_num:0,
          city:"",
          state:"",
          name:"",
          photo_url:"",
          price:"",
          categories:[],
        }
      }
      this.handleRestNameChange = this.handleRestNameChange.bind(this);
      this.handleAddressChange = this.handleAddressChange.bind(this);
      this.handleCityChange = this.handleCityChange.bind(this);
      this.handleStateChange = this.handleStateChange.bind(this);
      this.handlePriceChange = this.handlePriceChange.bind(this);
      this.handlePhotoURLChange = this.handlePhotoURLChange.bind(this);
      this.handlePhoneChange = this.handlePhoneChange.bind(this);
      this.postCategories = this.postCategories.bind(this);
      this.createNewRest = this.createNewRest.bind(this);
    }
    // componentDidMount(){
    //   axios.get("http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/restaurants/?user="+localStorage.getItem('id'))
    //   .then((res)=>{
    //     console.log(res.data[0])
    //     if(res.data[0].id !== 0){
    //       this.setState({
    //         restExist: true,
    //         restId: res.data[0].id
    //       })
    //       localStorage.setItem('restId',res.data[0].id);
    //     }
    //   })
    //   .catch((err)=>{
    //     console.log(err);
    //   })
    // }
    handleRestNameChange(e){
      const restaurant = {...this.state.restaurant, "name":e.target.value};
      this.setState({
        restaurant
      })
    }
    handleAddressChange(e){
      const restaurant = {...this.state.restaurant, "address":e.target.value};
      this.setState({
        restaurant
      })
    }
    handleCityChange(e){
      const restaurant = {...this.state.restaurant, "city":e.target.value};
      this.setState({
        restaurant
      })
    }
    handleStateChange(e){
      const restaurant = {...this.state.restaurant, "state":e.target.value};
      this.setState({
        restaurant
      })
    }
    handlePriceChange(e){
      const restaurant = {...this.state.restaurant, "price":e.target.value};
      this.setState({
        restaurant
      })
    }
    handlePhoneChange(e){
      const restaurant = {...this.state.restaurant, "phone_num":e.target.value};
      this.setState({
        restaurant
      })
    }
    handlePhotoURLChange(e){
      const restaurant = {...this.state.restaurant, "photo_url":e.target.value};
      this.setState({
        restaurant
      })
    }
    createNewRest(){

      axios.post("http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/restaurants/ ", this.state.restaurant)
      .then((res)=>{
        console.log(res.data);
        localStorage.setItem('restId', res.data.id);
        window.location =`${process.env.PUBLIC_URL}/restaurant`;
        var init_waitList = {
          restaurant: res.data.id,
          waitingNumber: 0,
          servedNumber : 0
        }
        axios.post("http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/wsnumber/", init_waitList)
        .then((res)=>{
          console.log(res);
        })
      })
      .catch((err)=>{
        console.log(err);
      })

    }
    postCategories(e){
      var restaurant = {...this.state.restaurant};
      if(restaurant.categories.includes(e.target.value)){
        for(let i=0; i<restaurant.categories.length; i++){
          if(restaurant.categories[i]==e.target.value){
            restaurant.categories.splice(i,1);
          }
        }
      } else {
        restaurant.categories.push(e.target.value);
      }
      this.setState({
        restaurant
      })
    }
    render(){
      const {login, restaurant, restExist} = this.state
      var categories = ["american", "seafood", "steak", "fast", "bar", "finedining", "chinese",  "japanese", "korean", "mexican", "pizza", "breakfast", "noodle", "italian", "mediterranean","french","vegetarian"];
      return(
          <div className="createRes">
               <Form>
                  <h1>Create Your Restaurant</h1>
                  <p>Technology that drives hospitality</p>
                  <Form.Row>
                      <Form.Group as={Col} controlId="formGridRestName">
                          <Form.Label>Restaurant Name</Form.Label>
                          <Form.Control onChange={this.handleRestNameChange} placeholder="Restaurant Name" />
                      </Form.Group>
                      <Form.Group as={Col} controlId="formGridRestAddress">
                          <Form.Label>Restaurant Street Address</Form.Label>
                          <Form.Control onChange={this.handleAddressChange} placeholder="Restaurant Address" />
                      </Form.Group>
                  </Form.Row>
                  <Form.Row>
                      <Form.Group as={Col} controlId="formGridRestCity" >
                          <Form.Label>Restaurant City</Form.Label>
                          <Form.Control as="select" onChange={this.handleCityChange}>
                              <option>Choose...</option>
                              <option>Chicago</option>
                              <option>Los Angeles</option>
                              <option>New York City</option>
                          </Form.Control>
                      </Form.Group>
                      <Form.Group as={Col} controlId="formGridRestState">
                          <Form.Label>Restaurant State</Form.Label>
                          <Form.Control as="select" onChange={this.handleStateChange}>
                              <option>Choose...</option>
                              <option>IL</option>
                              <option>CA</option>
                              <option>NY</option>
                          </Form.Control>
                      </Form.Group>
                      <Form.Group as={Col} controlId="formGridPrice">
                          <Form.Label>Restaurant Price Range</Form.Label>
                          <Form.Control onChange={this.handlePriceChange} as="select">
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
                          <Form.Label>Restaurant Owner Phone Number</Form.Label>
                          <Form.Control onChange={this.handlePhoneChange} placeholder="Phone Number" />
                      </Form.Group>
                      <Form.Group as={Col} controlId="formGridURL">
                        <Form.Label>Restaurant's Photo URL</Form.Label>
                        <Form.Control onChange={this.handlePhotoURLChange} placeholder="URL" />
                      </Form.Group>
                  </Form.Row>
                  <Form.Label>Restaurant Categories</Form.Label>
                  <div key="custom-inline-radio" className="mb-3">

                  {categories.map((type,index)=>(
                    <Form.Check custom key={type} inline label={`${type}`} value={type} onClick={this.postCategories} id={`custom-inline-radio-${index}`}/>
                  ))}

                  </div>
              </Form>
              <Button onClick={this.createNewRest} fluid color="green">
                Submit
              </Button>
          </div>
      )
    }

}

export default CreateRest
