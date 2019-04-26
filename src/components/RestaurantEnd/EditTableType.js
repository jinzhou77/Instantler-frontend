import React, { Component } from 'react';

import {Icon,
    Button,
    Dropdown,
    Image,
    Sidebar,
    Segment,
    Menu,
    List,
    Divider,Breadcrumb,
  } from 'semantic-ui-react'
import {Navbar, Modal, Form, Row, Col} from 'react-bootstrap'
import axios from 'axios'
import EditRest from './EditRest.js'

class EditTableType extends Component {
  constructor(props){
    super(props);
    this.state={
      tableType:{
        restaurant:localStorage.getItem('restId'),
        type:"",
        supportedNum:0,
        periods:[],
        totalNum:0
      },
      existTable:[],

    }
    this.saveTableType = this.saveTableType.bind(this);
    this.handlePeriodChange = this.handlePeriodChange.bind(this);
    this.handleServeChange = this.handleServeChange.bind(this);
    this.handleTotalNumChange = this.handleTotalNumChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);

  }

  saveTableType(){
    console.log(this.state.tableType);
    axios.post('http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/table-type/', this.state.tableType)
    .then((res)=>{
      console.log(res);
      window.location =`${process.env.PUBLIC_URL}/restaurant/tableType`;

    })
    .catch((err)=>{
      console.log(err);
    })
  }
  handleTypeChange(e){
    const tableType = {...this.state.tableType, "type":e.target.value};
    this.setState({
      tableType
    })
  }
  handleTotalNumChange(e){
    const tableType = {...this.state.tableType, "totalNum":e.target.value};
    this.setState({
      tableType
    })
  }

  handlePeriodChange(e){

    var timePeriod = this.state.tableType.periods;
    console.log(timePeriod);
    if(timePeriod.includes(e.target.value)){
      for(let i=0;i<timePeriod.length;i++){
        if(timePeriod[i]==e.target.value){
          timePeriod.splice(i,1);
        }
      }
    } else{
      timePeriod.push(e.target.value);
    }
    console.log(timePeriod);
    const tableType = {...this.state.tableType, "periods":timePeriod};
    this.setState({
      tableType
    })
  }
  handleServeChange(e){
    const tableType = {...this.state.tableType, "supportedNum":e.target.value};
    this.setState({
      tableType
    })
  }


  componentDidMount(){
    axios.get("http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/table-type/?restaurant="+localStorage.getItem('restId'))
    .then((res)=>{
      const tempData = res.data;
      var existTable = [];
      for(let i=0;i<tempData.length;i++){
        existTable.push(
          <List.Item key={tempData[i].type}>
            <List.Content>
              <List.Header>{tempData[i].type}</List.Header>
              <List.Description>Maximum Server Number: {tempData[i].supportedNum}</List.Description>
            </List.Content>
          </List.Item>
        )
      }
      this.setState({
        existTable
      })
    })
  }
  render(){
    var time =[];

    for(let i=8;i<24;i++){
      time.push(i.toString()+":00:00");
      time.push(i.toString()+":30:00");
    }

    const {existTable} = this.state;

    var tableLists = [];
    if(existTable.length==0){
      tableLists.push(
        <List.Item key={0}>
          <List.Content>
            <List.Header>
              No Table Type Exist, please insert new table type below
            </List.Header>
          </List.Content>
        </List.Item>
      )
    } else {
      tableLists = existTable;
    }

    return(

      <EditRest page={
        <div className="editTableType">

          <h1>Edit Table Lists</h1>
          <Segment inverted>
            <List divided relaxed inverted className="tableList">
              {tableLists.map(i=>{return i})}
            </List>
          </Segment>
          <h3>Insert new Table Type</h3>
          <Form>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridTableName">
                <Form.Label>Table Description/Name</Form.Label>
                <Form.Control onChange={this.handleTypeChange} />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridTableNumber">
                <Form.Label>Table available</Form.Label>
                <Form.Control  onChange={this.handleTotalNumChange} />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridTableServe">
                <Form.Label>Maximum serve number</Form.Label>
                <Form.Control onChange={this.handleServeChange} />
              </Form.Group>
            </Form.Row>
            <Form.Label>Time Available for the table </Form.Label>
            <div key={`custom-inline-radio`} className="mb-2">

              {time.map((i,index)=>(
                  <Form.Check key={i} id={`custom-inline-radio-${i}`} onClick={this.handlePeriodChange} value={i} custom inline label={i}/>
              ))}
            </div>
          </Form>

          <Button color="black"  onClick={this.saveTableType} variant="success">Save</Button>

        </div>
      } />
    )
  }
}


export default EditTableType
