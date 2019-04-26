import React, { Component } from 'react';

import CreateRest from './CreateRest'
import {Icon,
    Button,
    Dropdown,
    Image,
    Sidebar,
    Segment,
    Menu,
    List,
    Divider,Breadcrumb
  } from 'semantic-ui-react'
import {Navbar, Modal, Form, Row, Col} from 'react-bootstrap'
import RestInfo from './RestInfo.js'
import EditRest from './EditRest.js'
class RestaurantHomePage extends Component {


  constructor(props){
    super(props);

  }

  render(){
    var time =[];

    for(let i=8;i<24;i++){
      time.push(i.toString()+":00:00");
      time.push(i.toString()+":30:00");
    }

    return(
      <div className="RestInfos">
        <EditRest page={localStorage.getItem("restId")==0?<CreateRest/>:<RestInfo restId={localStorage.getItem("restId")}/>} />
      </div>
    )
  }
}
export default RestaurantHomePage
