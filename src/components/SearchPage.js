import React, { Component } from 'react';

import { Button, Icon, Image, Item, Label,Rating, Dropdown} from 'semantic-ui-react'
import {Navbar, Form, Nav,FormControl} from 'react-bootstrap'
import '../styles/Search.css'
const cityOptions= [
  { key: '1', text: 'Chicago', value: 'Chicago' },
  { key: '2', text: 'New York', value: 'New York' },
  { key: '3', text: 'Los Angeles', value: 'Los Angeles' },
]

class FilterBar extends Component {
  render(){
    return (
      <div className="filterbar">

      </div>
    )
  }
}

class SearchPage extends Component {
  constructor(props){
    super(props)
    this.state={
      list: this.props.location.state.list,
      login:localStorage.getItem("token")?true:false
    }
    this.handleCityChange = this.handleCityChange.bind(this);
  }
  handleCityChange(){

  }
  render(){
    const {list,login} = this.state;
    let listComp = [];
    list.map((elem,index)=>{
      listComp.push(
        <Item>
          <Item.Image src={elem.photo_url} />
          <Item.Content>
            <Item.Header>{elem.name}</Item.Header>
            <Item.Meta>
              <Rating maxRating={5} rating={parseInt(elem.rating)}/>
            </Item.Meta>
            <Item.Description>
              <b>Phone Number: {elem.phone_num}</b> <br />
              <b>Address: {elem.address}</b> <br />
            </Item.Description>
            <Item.Extra>
              <Button primary floated="right">
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
            <Form inline>
              <FormControl type="text" placeholder="Search" className="mr-sm-4" />
              <Form.Control as="select" className="mr-sm-4" >
                <option>Chicago</option>
                <option>Los Angeles</option>
                <option>New York</option>
              </Form.Control>
              <Button >Search</Button>
            </Form>
          </Navbar>
        </div>
        <div className="search-page">
          <Item.Group divided>
            {listComp.map(i=>{return i})}
          </Item.Group>
        </div>

      </div>
    )
  }
}
export default SearchPage
