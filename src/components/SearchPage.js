import React, { Component } from 'react';

import { Button, Icon, Image, Item, Label,Rating, Dropdown, Checkbox, Segment} from 'semantic-ui-react'
import {Navbar, Form, Nav,FormControl} from 'react-bootstrap'
import '../styles/Search.css'
import axios from 'axios'
const url="http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com";

class SearchPage extends Component {
  constructor(props){
    super(props)
    this.state={
      list: this.props.location.state.list,
      login:localStorage.getItem("token")?true:false,
      city: this.props.location.state.city,
      price: null,
      toggle: false,
      togglePopular:false
    }
    this.handleCityChange = this.handleCityChange.bind(this);
    // this.handleRateFilter = this.handleRateFilter.bind(this);
    this.handlePriceFilter= this.handlePriceFilter.bind(this);
    this.showRecommand = this.showRecommand.bind(this);
    this.showPopular = this.showPopular.bind(this);
  }
  showPopular(e){
    const toggled = !this.state.togglePopular;
    if(toggled){ //recommand and popular
      axios.get(url+'/api/restaurants/?city='+this.state.city+"&popular=True")
      .then((res)=>{
        this.setState({
          toggle:false,
          togglePopular:true,
          list:res.data
        })
      })
      .catch((err)=>{
        console.log(err);
      })
    } else {
      axios.get(url+'/api/restaurants/?city='+this.state.city)
      .then((res)=>{
        this.setState({
          togglePopular:false,
          list:res.data
        })
      })
    }
  }
  showRecommand(e){
    const toggled = !this.state.toggle;
    console.log(toggled);
    if(toggled){
      axios.get(url+'/api/restaurants/?user='+localStorage.getItem("id")+"&is_common=True"+"&city="+this.state.city)
      .then((res)=>{
        console.log ('-----------------');
        this.setState({
          list:res.data
        })
      })
    } else {
      axios.get(url+'/api/restaurants/?city='+this.state.city)
      .then((res)=>{
        console.log (res);
        this.setState({
          list:res.data
        })
      })
    }
    this.setState({
      toggle:toggled
    })
  }
  handleCityChange(e){
    const city = e.target.value
    this.setState({
      city:e.target.value
    })
    if(this.state.toggle){
      axios.get(url+'/api/restaurants/?user='+localStorage.getItem("id")+"&is_common=True"+"&city="+city)
      .then((res)=>{
        this.setState({
          list:res.data
        })
      })
    } else {
      axios.get(url+"/api/restaurants/?city="+city)
      .then((res)=>{
        this.setState({
          list:res.data
        })
      })
    }
  }
  // handleRateFilter(e, {value}){
  //   axios.get(url+"/api/restaurants/?city="+this.state.city)
  //   .then((res)=>{
  //     console.log(parseInt(res.data[2].rating)==value);
  //     let tempData = res.data;
  //     tempData.filter(i=>i.rating==value);
  //     console.log(tempData);
  //   }).catch((err)=>{
  //     console.log(err)
  //   })
  // }
  handlePriceFilter(e, {value}){

    axios.get(url+"/api/restaurants/?city="+this.state.city+"&price="+value)
    .then((res)=>{
      this.setState({
        list:res.data
      })
    })
  }
  render(){
    const {list,login} = this.state;
    let listComp = [];
    console.log(list);
    list.map((elem,index)=>{
      listComp.push(
        <Item key={elem.id}>
          <Item.Image src={elem.photo_url} />
          <Item.Content>
            <Item.Header>{elem.name}</Item.Header>
            <Item.Meta>
              <Rating disabled maxRating={5} rating={parseInt(elem.rating)}/>
            </Item.Meta>
            <Item.Description>
              <b>Price: {elem.price}</b> <br />
              <b>Phone Number: {elem.phone_num}</b> <br />
              <b>Address: {elem.address}</b> <br />
              <b>City: {elem.city}</b> <br />
              <b>State: {elem.state}</b> <br />
            </Item.Description>
            <Item.Extra>
              <Button primary floated="right" as="a" href={`/reservationPage/${elem.id}`}>
                Make Reservation
              </Button>
            </Item.Extra>
          </Item.Content>
        </Item>
      )})
    return (
      <div className="search">
        <div>
          <Navbar bg="primary" variant="dark">
            <Navbar.Brand href="/">Instantler</Navbar.Brand>
            <Nav className="mr-auto">
              <Nav.Link href="/">Home</Nav.Link>
            </Nav>
          </Navbar>
        </div>
        <div className="filterbar">
          <div className="filterbar-center">
            <div>
              <p><b>Price:</b></p>
              <Button.Group compact>
                <Button inverted color="blue" value="$" onClick={this.handlePriceFilter}>$</Button>
                <Button inverted color="blue" value="$$" onClick={this.handlePriceFilter}>$$</Button>
                <Button inverted color="blue" value="$$$" onClick={this.handlePriceFilter}>$$$</Button>
                <Button inverted color="blue" value="$$$$" onClick={this.handlePriceFilter}>$$$$</Button>
              </Button.Group>
            </div>

            {/* <div>
              <p><b>Rates:</b></p>
              <Button.Group compact>
                <Button onClick={this.handleRateFilter} value="1" inverted color="blue"><Icon name='star' /></Button>
                <Button onClick={this.handleRateFilter} value="2" inverted color="blue"><Icon name='star' /><Icon name='star' /></Button>
                <Button onClick={this.handleRateFilter} value="3" inverted color="blue"><Icon name='star' /><Icon name='star' /><Icon name='star' /></Button>
                <Button onClick={this.handleRateFilter} value="4" inverted color="blue"><Icon name='star' /><Icon name='star' /><Icon name='star' /><Icon name='star' /></Button>
                <Button onClick={this.handleRateFilter} value="5" inverted color="blue"><Icon name='star' /><Icon name='star' /><Icon name='star' /><Icon name='star' /><Icon name='star' /></Button>
              </Button.Group>
            </div> */}
            <div>
              <p><b>City:</b></p>
              <Button.Group compact>
                <Button inverted color="blue" value="Chicago" onClick={this.handleCityChange}>Chicago</Button>
                <Button inverted color="blue" value="New York" onClick={this.handleCityChange}>New York</Button>
                <Button inverted color="blue" value="Los Angeles" onClick={this.handleCityChange}>Los Angeles</Button>
              </Button.Group>
            </div>

            <Segment  className="popularSwitch" color="blue"  compact>
               <Checkbox toggle checked={this.state.togglePopular} onClick={this.showPopular}  label="Popular" />
            </Segment>
            <Segment  className="recommandSwitch" color="blue"  compact>
               <Checkbox toggle checked={this.state.toggle} onClick={this.showRecommand}  label="Recommand" />
            </Segment>
          </div>

        </div>
        <div className="search-page">
          {listComp.length==0?
            <h3>No Restaurants are Matched</h3>
            :
            <Item.Group divided>
            {listComp.map(i=>{return i})}
          </Item.Group>}
        </div>

      </div>
    )
  }
}
export default SearchPage
