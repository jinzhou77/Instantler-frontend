import React, { Component } from 'react';
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
import '../../styles/EditRest.css'
import UpdateRestInfo from './UpdateRestInfo.js'
import RestReservation from './RestReservation'
import RestWaitList from './RestWaitList'
import CreateRest from './CreateRest'
import RestInfo from './RestInfo.js'
import axios from 'axios'
class EditRest extends Component {
  constructor(props){
    super(props);
    this.state={
      visible:false,
      page:'info',
      modalShow:false,
      restId:0,
      first_name:'Did not Login',
      tableType:{
        restaurant:localStorage.getItem('restId'),
        type:"",
        supportedNum:0,
        periods:[],
        totalNum:0
      },
      existTable:[],
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleInfoClick = this.handleInfoClick.bind(this);
    this.handleReservationClick=this.handleReservationClick.bind(this);
    this.handleWaitListClick = this.handleWaitListClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleTotalNumChange = this.handleTotalNumChange.bind(this);
    this.handleServeChange = this.handleServeChange.bind(this);
    this.handlePeriodChange = this.handlePeriodChange.bind(this);
    this.saveTableType = this.saveTableType.bind(this);
    this.signout=this.signout.bind(this);
  }
  signout(){
    localStorage.clear();
    window.location =`${process.env.PUBLIC_URL}/`;
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
  handleServeChange(e){
    const tableType = {...this.state.tableType, "supportedNum":e.target.value};
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
  saveTableType(){
    console.log(this.state.tableType);
    axios.post('http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/table-type/', this.state.tableType)
    .then((res)=>{
      console.log(res);
      window.location =`${process.env.PUBLIC_URL}/restaurant`;

    })
    .catch((err)=>{
      console.log(err);
    })
  }
  componentDidMount(){

    axios.get("http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/users/"+localStorage.getItem("id")+"/?format=json", {
      headers: {
        Authorization: 'Token '+localStorage.getItem('token')
      }
    })
    .then((res)=>{
      this.setState({
        first_name:res.data.first_name,
        restId: res.data.restaurant
      })
      localStorage.setItem('restId', res.data.restaurant)
    })
    .catch((err)=>{
      console.log(err);
    })
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
  handleClick(){
    const visible = this.state.visible;
    if(visible){
      this.setState({
        visible:false,
      })
    } else{
      this.setState({
        visible:true
      })
    }
  }
  handleInfoClick(){
    this.setState({
      page:'info',
      visible:false
    })
  }
  handleClose(){
    this.setState({
      modalShow:false
    })
  }
  handleReservationClick(){
    this.setState({
      page:'reservation',
      visible:false

    })
  }
  handleWaitListClick(){
    this.setState({
      page:'waitlist',
      visible:false
    })
  }
  render(){
    const {existTable} = this.state;
    const trigger = (
      <span className="userName">
        <Image avatar src="../assets/user.jpg"/>   {this.state.first_name}
      </span>
    )
    const {page} = this.state;
    var time=[], tableLists = [];
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
    for(let i=8;i<24;i++){
      time.push(i.toString()+":00:00");
      time.push(i.toString()+":30:00");
    }
    var newPage;
    if(page=='info'){
       newPage =
       <div className="updateRestInfo">
         {this.state.restId==0?<CreateRest/>:<RestInfo restId={this.state.restId}/>}
         <div className="editButtons">
           <Button color='olive' className="editButton" onClick={()=>{this.setState({modalShow:true})}} circular>Restaurant Table Type</Button>
           <Button color='teal' className="editButton" onClick={this.handleReservationClick} circular>Reservation System</Button>
           <Button color='violet' className="editButton" onClick={this.handleWaitListClick} circular>WaitList System</Button>
        </div>
         <Modal size='lg'
             centered
             aria-labelledby="contained-modal-title-vcenter"
             show={this.state.modalShow}
             onHide={this.handleClose}>
           <Modal.Header closeButton>
             <Modal.Title id="contained-modal-title-vcenter">
               Edit the table type
             </Modal.Title>
           </Modal.Header>
           <Modal.Body>
             <List divided relaxed className="tableList">
               {tableLists.map(i=>{return i})}
             </List>
             <Divider />
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
           </Modal.Body>
           <Modal.Footer>
             <Button onClick={this.saveTableType} variant="success">Save</Button>
           </Modal.Footer>
         </Modal>
      </div>
    } else if(page=='reservation'){
      newPage= <RestReservation />
    } else if(page=='waitlist'){
      newPage = <RestWaitList />
    }
    return(
      <div className="editRest">
        <Navbar>
          <Icon size="large" bordered={true}  name="sidebar" onClick={this.handleClick} />
          <Navbar.Brand href="/restaurant" >Instantler</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end userName">
            <Dropdown trigger={trigger} className='icon' pointing>
              <Dropdown.Menu>
                <Dropdown.Item icon="user" text="User Info"  as="a" href="/userInfo"/>
                <Dropdown.Item icon="sign-out" text="Sign Out" onClick={this.signout}/>
              </Dropdown.Menu>
            </Dropdown>
          </Navbar.Collapse>
        </Navbar>
        <Sidebar.Pushable as={Segment}>
          <Sidebar
            as={Menu}
            animation='overlay'
            inverted
            onHide={this.handleSidebarHide}
            vertical
            visible={this.state.visible}
            width='wide'>
            <Menu.Item onClick={this.handleInfoClick}>
              <Icon name='building' />
              Your Restaurant
            </Menu.Item>


            <Menu.Item onClick={this.handleReservationClick}>
              <Icon name='utensils' />
              Reservation
            </Menu.Item>

            <Menu.Item onClick={this.handleWaitListClick}>
              <Icon name='file alternate' />
              WaitList
            </Menu.Item>
          </Sidebar>

          <Sidebar.Pusher dimmed={this.state.visible}>

            <Segment basic>
              {/* <Breadcrumb>
                <Breadcrumb.Section link >Restaurant</Breadcrumb.Section>
                <Breadcrumb.Divider icon='right chevron' />
                <Breadcrumb.Section link>Update Restaurant Info</Breadcrumb.Section>
              </Breadcrumb> */}
              {newPage}
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>

      </div>
    );
  }
}

export default EditRest
