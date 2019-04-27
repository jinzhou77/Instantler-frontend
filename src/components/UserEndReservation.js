import React, { Component } from 'react';
import axios from 'axios'
import {Header, Rating,Label,Button,Message, Image, Item, Container, Popup} from 'semantic-ui-react'
import '../styles/UserEndReservation.css'
import UserNavBar from './UserEnd/UserNavBar.js'
import Calendar from 'react-calendar';
import {Modal,Form} from 'react-bootstrap'
const url ="http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com";
class UserEndReservation extends Component {
  constructor(props){
    const date = new Date();
    var month = 0,dateNum=0;
    if((date.getMonth()+1)<10){
      month= "0"+(date.getMonth()+1).toString();
    } else {
      month = date.getMonth()+1;
    }
    if(date.getDate()<10){
      dateNum = "0"+date.getDate();
    } else {
      dateNum = date.getDate();
    }
    super(props)
    this.state={
      first_name:'',
      restId:this.props.match.params.id,
      restInfo:{},
      login:localStorage.getItem("id"),
      restCate:[],
      numOfWaiting:0,
      dates:date,
      month:month,
      date:dateNum,
      year:date.getFullYear(),
      existTableType:[],
      selectedTableTypeID:0,
      dateFormat:'',
      modalShow:false,
      alertShow:false,
      dateFormatInAPI:'',
      selectedTableName:'',
      MaxNum:0,
      guestNum:0,
      servedNumber:0,
      availableReservation:[]
    }
    this.changeDate = this.changeDate.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.selectTableType = this.selectTableType.bind(this);
    this.handleAlertClose = this.handleAlertClose.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.confirm = this.confirm.bind(this);
    this.selectGuestNumber = this.selectGuestNumber.bind(this);
    this.takeNumber = this.takeNumber.bind(this);
  }
  componentDidMount(){
    axios.get(url+"/api/users/"+localStorage.getItem('id')+"/?format=json",{
      headers: {
        Authorization: 'Token '+localStorage.getItem('token')
      }
    })
    .then((res)=>{
      this.setState({
        first_name: res.data.first_name
      })
    })
    .catch((err)=>{
      console.log(err);
    })

    axios.get("http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com"+'/api/restaurants/'+this.state.restId)
    .then((res)=>{
      this.setState({
        restInfo:res.data
      })
    })
    axios.get(url+`/api/restaurants-cat/${this.state.restId}/`)
    .then((res)=>{
      const data = res.data.categories;
      let cateArr = [];
      for(let i=0;i<data.length;i++){
        cateArr.push(
          <Label key={data[i]}>{data[i]}</Label>
        )
      }
      this.setState({
        restCate:cateArr
      })
    })
    axios.get("http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/wsnumber/?restaurant="+this.state.restId)
    .then((res)=>{
      this.setState({
        numOfWaiting:res.data[0].waitingNumber,
        servingNumber:res.data[0].servedNumber
      })
    });   ///fixing on backend

    let tableTypeComp = [];

    axios.get(url+`/api/table-type/?restaurant=${this.state.restId}`)
    .then((res)=>{
      res.data.map((elem)=>{
          tableTypeComp.push(
            <option key={elem.id} number={elem.supportedNum} value={elem.id}>{elem.type}</option>
          );
      })
      this.setState({
        existTableType:tableTypeComp
      })
    })
  }
  takeNumber(){
    let info ={
      user:localStorage.getItem("id"),
      restaurant: this.state.restId,
      first_name:this.state.first_name
    }
    console.log(info);
    if(localStorage.getItem("id")){
      axios.post(url+"/api/waiting-user/", info)
      .then((res)=>{
        localStorage.setItem("WaitNumber", res.data.myNumber);
        window.location =`${process.env.PUBLIC_URL}/reservationPage/${this.state.restId}`

      }).catch((err)=>{
        console.log(err);
      })
    } else {
      alert("Please Log in First to take a number!")
    }

  }
  selectTableType(e){
    console.log(e.target.value);

    const {date,year,month} = this.state;
    var selectedDate  =`${year}-${month}-${date}`;
    axios.get(url+`/api/table-type/${e.target.value}/`)
    .then((res)=>{
      axios.get(url+'/api/table-data?restaurant='+ this.state.restId+'&tabletype='+res.data.id+"&date="+selectedDate)
      .then((response)=>{
        let timeButton = [];
        var resData = response.data;
        for(let i=0;i<resData.length;i++){
              timeButton.push(
                <Button color="google plus" key={resData[i].dateTime.slice(11, 19)} value={resData[i].dateTime.slice(11, 19)} size="medium" onClick={this.handleShow}>
                  {resData[i].dateTime.slice(11, 19)}
                </Button>
              )
        }
        this.setState({
          availableReservation:timeButton,
          selectedTableTypeID:res.data.id,
          MaxNum:res.data.supportedNum
        })
      })
    }).catch((err)=>{this.setState({selectedTableTypeID:0})})
  }
  handleShow(e){
    console.log('e.target.value')
    const {date,year,month} = this.state;

    let  dateFormat = `${year}-${month}-${date}T${e.target.value}Z`;
    console.log(dateFormat);
    this.setState({
      dateFormat: `${month}/${date}/${year} at ${e.target.value}`,
      dateFormatInAPI: dateFormat
    })
    axios.get(url+`/api/table-data?restaurant=${this.state.restId}&tabletype=${this.state.selectedTableTypeID}&datetime=${dateFormat}`)
    .then((res)=>{
      console.log(res.data)
      const data = res.data;
      console.log(data);

      if(res.data[0].remainNum==0){
        this.setState({
          alertShow:true,
          modalShow:false
        })

      } else{
        this.setState({
          alertShow:false,
          modalShow:true
        })
      }
    })
  }
  handleAlertClose(){
    this.setState({
      alertShow:false
    })
  }
  handleModalClose(){
    this.setState({
      modalShow:false
    })
  }
  changeDate(date){
    var month = 0,dateNum=0;
    if((date.getMonth()+1)<10){
      month= "0"+(date.getMonth()+1).toString();
    } else {
      month = date.getMonth()+1;
    }
    if(date.getDate()<10){
      dateNum = "0"+date.getDate();
    } else {
      dateNum = date.getDate();
    }
    this.setState({
      dates:date,
      month: month,
      date:dateNum,
      year:date.getFullYear(),
    })
  }
  selectGuestNumber(e){
    this.setState({
      guestNum:e.target.value
    })
  }
  confirm(){
    let info = {
      first_name:this.state.first_name,
      restaurant:this.state.restId,
      type:this.state.selectedTableTypeID,
      user:localStorage.getItem('id'),
      guestNum:this.state.guestNum,
      dateTime:this.state.dateFormatInAPI
    }
    console.log(info);
    axios.post(url+"/api/reservation/",info)
    .then((res)=>{
      console.log('successfully posted');
      let info2 = {
        restaurant:this.state.restId,
        user: localStorage.getItem('id'),
        rating: 3,
        description:'nn',
        rated: false
      }
      axios.post(url+"/api/review/",info2)
      .then((res)=>{
        window.location =`${process.env.PUBLIC_URL}/reservationPage/${this.state.restId}`
      })
    }).catch((err)=>{
      console.log(err);
    })

  }
  render(){
    const {restInfo,restCate,dates, month, date, year, existTableType, selectedTableTypeID, MaxNum,alertShow,modalShow, availableReservation} = this.state;
    let timeButton = [];
    console.log(selectedTableTypeID);
    if(selectedTableTypeID==0){
      timeButton.push(<h1 key="wrong selection">Please select the table type you want first!</h1>)
    } else if(selectedTableTypeID!=0 && availableReservation.length==0){
      timeButton.push(<h1 key="Not found">No Reservation available for this table kind</h1>)
    } else {
      timeButton = [...availableReservation];
      // for(let i=availableReservation-1;i>=0;i--){
      //   timeButton.push(availableReservation[i])
      // }
      // timeButton = timeButton.reverse();
    }
    console.log(availableReservation);
    let i=0,timeColumns=[], timeRows=[];
    while(i<timeButton.length){
      for(let j=0;j<11;j++){
        timeColumns.push(timeButton[i]);
        i++;
      }
      timeRows.push(
        <div key={i} className="buttonRows">
          {timeColumns.map(i=>{return i})}
        </div>
      )
      timeColumns =[];
    }
    let guestNumList = [];
    for( let i=1;i<=MaxNum;i++){
      guestNumList.push(
        <option key={i} value={i}>{i}</option>
      )
    }
    return(
      <div className="UserEndReservation">
        <UserNavBar />
        <div className="UserEndReservationInfo">
          <Item.Group divided>
            <Item>
              <Item.Image size="large" src={restInfo.photo_url} />
              <Item.Content>
                <Item.Header as="h1">{restInfo.name}</Item.Header>
                <Item.Meta><Rating maxRating={5}  icon='star' rating={restInfo.rating}/><b>{restInfo.ratings_count} reviews</b> <br /></Item.Meta>
                <Item.Description>
                  <b>Phone Number: {restInfo.phone_num} </b> <br />
                  <b>Address: {restInfo.address}</b> <br />
                  <b>City: {restInfo.city}</b> <br />
                  <b>State: {restInfo.state}</b> <br />
                  <b>Price: {restInfo.price==null?"Not Defined":restInfo.price}</b> <br />
                  {restCate.map((elem)=>{return elem})}
                </Item.Description>
                <Item.Extra>
                  <Message as="div" positive>
                    <Message.Content>
                      Current Waiting Number:<b>{this.state.numOfWaiting}</b>
                    </Message.Content>
                    <Message.Content>
                      Current Serving Number:<b>{this.state.servingNumber}</b>
                    </Message.Content>
                  </Message>
                  <Message as="div" positive>
                    <Message.Content>
                      Your Number is :<b>{localStorage.getItem("WaitNumber")?localStorage.getItem("WaitNumber"):"None"}</b>
                    </Message.Content>
                    {localStorage.getItem("WaitNumber")&&(localStorage.getItem("WaitNumber")-this.state.servingNumber==0) ?
                      <Message.Content>
                        <b>It is Your Turn!!!!!</b>
                      </Message.Content>
                      :null
                    }
                  </Message>
                  <Button fluid onClick={this.takeNumber}  color='google plus'>Take A Number</Button>
                </Item.Extra>
              </Item.Content>
            </Item>
          </Item.Group>
         <Calendar onChange={this.changeDate} value={dates} />
        </div>
        <div className="UserEndReservationSelectTime">
          <Form>
            <Form.Group>
              <Form.Label><b>Select the table type:</b></Form.Label>
              <Form.Control as="select" onChange={this.selectTableType}>
                <option>Choose ...</option>
                {existTableType.map((i)=>{return i})}
              </Form.Control>
            </Form.Group>
          </Form>
          <Message
            positive
            attached
            header={`Selected Date: ${month}/${date}/${year}`}
          />



          <Container className="attached fluid segment">

            <h3>Reservation time slots:</h3>
            {timeRows.map(i=>{return i})}
          </Container>
        </div>

        <Modal //reservation
          size='lg'
          centered
          aria-labelledby="contained-modal-title-vcenter"
          show={this.state.modalShow}
          onHide={this.handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Confirmation
            </Modal.Title>
          </Modal.Header>


          <Modal.Body>
            <h4>Confirm the infomation below:</h4>
            <b>Restaurant Name: {restInfo.name}</b><br/>
            <b>Restaurant Address: {restInfo.address}</b><br/>
            <b>Restaurant City: {restInfo.city}</b><br/>
            <b>Restaurant State: {restInfo.state}</b><br/>
            <b>Time: {this.state.dateFormat}</b><br/>
            <Form>
              <Form.Group>
                <Form.Label>Select Number of Guests:</Form.Label>
                <Form.Control as="select" onChange={this.selectGuestNumber}>
                  <option>Choose ...</option>
                  {guestNumList.map((i)=>{return i})}
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.confirm} color="google plus">Confirm</Button>
          </Modal.Footer>
        </Modal>


        <Modal  //alert
          size='lg'
          centered
          aria-labelledby="contained-modal-title-vcenter"
          show={this.state.alertShow}
          onHide={this.handleAlertClose}>
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Alert:
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>There are no more tables for this time slot.</p>
            </Modal.Body>
          </Modal>
      </div>
    )
  }
}

export default UserEndReservation
