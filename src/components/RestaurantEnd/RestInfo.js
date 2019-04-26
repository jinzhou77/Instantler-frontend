import React, { Component } from 'react';
import "../../styles/createRes.css";
import axios from 'axios'
import {Rating, List, Card, Image, Button, Transition, Divider, Label} from 'semantic-ui-react'
import {Modal, Form} from 'react-bootstrap'
import UpdateRestInfo from './UpdateRestInfo.js'
const url="http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/";
class RestInfo extends Component {
  constructor(props){
    super(props);
    this.state={
      restaurant:{
      },
      categories:[],
      show:false
    }
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleUpdateCategories = this.handleUpdateCategories.bind(this);
    this.postCategories = this.postCategories.bind(this);
  }
  postCategories(e){
    var categories = [...this.state.categories];
    if(categories.includes(e.target.value)){
      for(let i=0; i<categories.length; i++){
        if(categories[i]==e.target.value){
          categories.splice(i,1);
        }
      }
    } else {
      categories.push(e.target.value);
    }
    this.setState({
      categories
    })
  }
  handleClose() {
    this.setState({ show:false });

  }

  handleShow() {
    this.setState({ show:true });
  }

  handleUpdateCategories(){
    const restaurant = {...this.state.restaurant, "categories": this.state.categories};
    console.log(restaurant);
    axios.put(url+"api/restaurants/"+localStorage.getItem("restId")+'/', restaurant)
    .then((res)=>{
      console.log(res.data)
      this.setState({
        show:false
      })
    })
    .catch((err)=>{
      console.log(err);
    })
  }
  componentDidMount(){
    axios.get("http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/restaurants/"+localStorage.getItem("restId")+"/")
    .then((res)=>{
        console.log(res.data);
        this.setState({
          restaurant:res.data
        })

      axios.get("http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/restaurants-cat/"+localStorage.getItem("restId")+"/")
      .then((response)=>{
        this.setState({
          categories:response.data.categories
        })
      })
    })
    .catch((err)=>{
      console.log(err);
    })
  }

  render(){

    const {restaurant,categories, visible} = this.state;
    var categoriesType = ["american", "seafood", "steak", "fast", "bar", "finedining", "chinese",  "japanese", "korean", "mexican", "pizza", "breakfast", "noodle", "italian", "mediterranean","french","vegetarian"];
    let categoriesList = [];
    for(let i=0;i<categories.length;i++){
      categoriesList.push(
        <Label key={categories[i]}>{categories[i]}</Label>
      )
    }
    if(categoriesList.length==0){
      categoriesList.push(
        <Label key='not found'>No Categories Found</Label>
      );
    }
    return(
      <div className="restInfo">
        <div className="generalInfo">
          <h1>{restaurant.name}</h1>
          <div className="nums_rating">
            <Rating disabled maxRating={5} rating={parseInt(restaurant.rating)} icon='star' size='huge' />
            <span>{restaurant.ratings_count} reviews</span>
          </div>

          <div className="editableInfo">


            {categoriesList.map(i=>{return i})}

            <Button basic color='black' size="mini" onClick={this.handleShow}>Edit</Button>

            <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Restaurant Categories</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <div key="custom-inline-radio" className="mb-3">

                {categoriesType.map((type,index)=>(
                  <Form.Check custom key={type} inline label={`${type}`} value={type} onClick={this.postCategories} id={`custom-inline-radio-${index}`}/>
                ))}

                </div>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={this.handleUpdateCategories}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
          </div>
          <div className="update-separate">
            <Card>
              <Image src={restaurant.photo_url}/>
              <Card.Content>
                <Card.Header>
                  {restaurant.name}
                </Card.Header>
                <Card.Meta>Price Range:{restaurant.price}</Card.Meta>
                <Card.Description>Address Line 1: {restaurant.address}</Card.Description>
                <Card.Description>Address Line 2: {restaurant.city}, {restaurant.state}</Card.Description>
                <Card.Description>Phone Number: {restaurant.phone_num}</Card.Description>

              </Card.Content>
            </Card>
            <UpdateRestInfo restaurant={this.state.restaurant}/>
          </div>
        </div>
      </div>
    )
  }
}

export default RestInfo
