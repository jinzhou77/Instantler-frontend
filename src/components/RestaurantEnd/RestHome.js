import React, { Component } from 'react';
import axios from 'axios'
import {Navbar} from 'react-bootstrap'
import {Icon, Button} from 'semantic-ui-react'

import Search from '../Search.js'
import InstantlerNav from '../InstantlerNav.js'
import EditRest from './EditRest.js'
import RestaurantHomePage from './RestaurantHomePage.js'
class RestHome extends Component {
  constructor(props){
    super(props);
    this.state={
      login:localStorage.getItem('token')?true:false
    }
  }

  render(){
    const restaurant = 'restaurant';
    const {login} = this.state;
    return(
      <div className="restHome">
        {login?
          <RestaurantHomePage />
        :
          <>
            <InstantlerNav  usertype={restaurant}/>
            <Search />
          </>
        }

      </div>
    )
  }
}
export default RestHome
