import React, { Component } from 'react';
import axios from 'axios'
import { List, Image, Input, Dropdown, Label, Icon, Card, Rating} from 'semantic-ui-react';
import { ButtonToolbar,
  ButtonGroup,
  Button,
  Modal,
  Form,
  Container,
  Row, Col,
} from 'react-bootstrap';
import {Link ,Redirect} from 'react-router-dom'
import '../styles/Search.css'
const options = [
  { key: '1', text: '1 person', value: '1' },
  { key: '2', text: '2 people', value: '2' },
  { key: '3', text: '3 people', value: '3' },
  { key: '4', text: '4 people', value: '4' },
  { key: '5', text: '5 people', value: '5' },
  { key: '6', text: '6 people', value: '6' },
  { key: '7', text: '7 people', value: '7' },
  { key: '8', text: '8 people', value: '8' },
  { key: '9', text: '9 people', value: '9' },
  { key: '10', text: '10 people', value: '10' },
]
const cityOptions= [
  { key: '1', text: 'Chicago', value: 'Chicago' },
  { key: '2', text: 'New York', value: 'New York' },
  { key: '3', text: 'Los Angeles', value: 'Los Angeles' },
]




class Search extends Component{
  constructor(props){
    super(props);
    this.state={
      value:'',
      filterResult:[],
      allResults:[],
      city:'Chicago',
      popularResults:[],
      recommandList:[],

    }
    this.handleChange=this.handleChange.bind(this);
    this.handleCityChange = this.handleCityChange.bind(this);
  }

  componentDidMount(){
    let allResults=[], popularResults=[];
    axios.get('http://127.0.0.1:8000/api/restaurants/?city='+this.state.city)
    .then((res)=>{
      for(let i=0;i<res.data.length;i++){
        allResults.push(res.data[i]);
      }
      this.setState({
        allResults
      })
    })
    axios.get('http://127.0.0.1:8000/api/restaurants/?city='+this.state.city+'&popular=True')
    .then((res)=>{
      for(let i=0;i<res.data.length;i++){
        popularResults.push(res.data[i]);
      }
      this.setState({
        popularResults
      })
    })
    if(localStorage.getItem('id')){
      const recommandComp = [];
      axios.get("http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/restaurants/?city="+this.state.city+"&user="+localStorage.getItem('id')+"&is_common=True")
      .then((res)=>{
        console.log(res.data);
        res.data.map((ele)=>{
          recommandComp.push(
            <Card key={ele.id}>
              <Image src={ele.photo_url} size="medium"/>
              <Card.Content>
                <Card.Header as="a" href={`/reservationPage/${ele.id}`}>{ele.name}</Card.Header>
                <Card.Meta><Rating maxRating={5} rating={parseInt(ele.rating)}/> <b>{ele.ratings_count} reviews </b></Card.Meta>
                <Card.Description>
                  <b>Price Range: {ele.price}</b> <br />
                  <b>Phone Number: {ele.phone_num}</b> <br />
                  <b>Address: {ele.address}</b> <br />
                </Card.Description>
              </Card.Content>
            </Card>
          )
        });
        this.setState({
          recommandList:recommandComp
        })
      })
    }




  }
  handleChange(e) {
    const value = e.target.value;
    const allResults = this.state.allResults;
    this.setState({ value: e.target.value });
    let filterResult = [];
    if(!value) return;
    for(let i=0;i<allResults.length;i++){

      if((allResults[i].name).includes(value)) {
        filterResult.push(allResults[i]);
      }
    }
    this.setState({
      filterResult
    })
  }
  handleCityChange(e, {value}){
    this.setState({city:value});
    let allResults=[],popularResults=[];
    axios.get('http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/restaurants/?city='+value)
    .then((res)=>{
      for(let i=0;i<res.data.length;i++){
        allResults.push(res.data[i]);
      }
      this.setState({
        allResults
      })
    })
    axios.get('http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/restaurants/?city='+value+'&popular=True')
    .then((res)=>{
      for(let i=0;i<res.data.length;i++){
        popularResults.push(res.data[i]);
      }
      this.setState({
        popularResults:popularResults
      })
    })


    const recommandComp = [];
    axios.get("http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/restaurants/?city="+value+"&user="+localStorage.getItem('id')+"&is_common=True")
    .then((res)=>{
      console.log(res.data);
      res.data.map((ele)=>{
        recommandComp.push(
          <Card key={ele.id}>
            <Image src={ele.photo_url} size="medium"/>
            <Card.Content>
              <Card.Header as="a" href={`/reservationPage/${ele.id}`}>{ele.name}</Card.Header>
              <Card.Meta><Rating maxRating={5} rating={parseInt(ele.rating)}/> <b>{ele.ratings_count} reviews </b></Card.Meta>
              <Card.Description>
                <b>Price Range: {ele.price}</b> <br />
                <b>Phone Number: {ele.phone_num}</b> <br />
                <b>Address: {ele.address}</b> <br />
              </Card.Description>
            </Card.Content>
          </Card>
        )
      });
      this.setState({
        recommandList:recommandComp
      })
    })
  }


  render(){
    const filterResult = this.state.filterResult;
    const {popularResults, allResults, recommandList} = this.state;
    const value = this.state.value;
    let newFilterArr = [];
    for (let i = 0; i < filterResult.length; i++) {
      if(newFilterArr.length>5){
        break;
      }
      newFilterArr.push(
        <List.Item key={filterResult[i].id}>
          <Image avatar src={filterResult[i].photo_url} />
          <List.Content>
            <List.Header>
              <Link to={{ pathname: `${process.env.PUBLIC_URL}/reservationPage/${filterResult[i].id}` }}>
                {filterResult[i].name}
              </Link>
            </List.Header>
            <List.Description>
              {filterResult[i].address}
            </List.Description>
          </List.Content>
        </List.Item>
      )
    }

    let popularComponents = [];
    popularResults.map((ele,index)=>{
      popularComponents.push(
        <Card key={ele.id}>
          <Image src={ele.photo_url} size="medium"/>
          <Card.Content>
            <Card.Header as="a" href={`/reservationPage/${ele.id}`}>{ele.name}</Card.Header>
            <Card.Meta><Rating maxRating={5} rating={parseInt(ele.rating)}/> <b>{ele.ratings_count} reviews </b></Card.Meta>
            <Card.Description>
              <b>Price Range: {ele.price}</b> <br />
              <b>Phone Number: {ele.phone_num}</b> <br />
              <b>Address: {ele.address}</b> <br />
            </Card.Description>
          </Card.Content>
        </Card>
      )
    })

    console.log(popularComponents.length)
    return(
      <div className="search-homepage">
        <div className="search-content">
          <Container>
            <Row>
              <Col lg={4} sm={3}>
                <Input className="rest-filter" size='large' fluid icon="search" iconPosition='left' placeholder="Restaurant Name"
                  onChange={this.handleChange} value={value} />
              </Col>
              <Col lg={4} sm={3}>
                <Dropdown
                  button
                  fluid
                  className='icon large'
                  floating
                  labeled
                  icon='home'
                  options={cityOptions}
                  selection
                  defaultValue={cityOptions[0].value}
                  onChange={this.handleCityChange}
                />
              </Col>
              <Col sm={2}>
                {filterResult.length==0?
                  <Button size='lg' variant="danger"><Link to={{
                    pathname:'/search',
                    state: {
                      list:allResults
                    }
                  }}>Let's Go</Link></Button>:
                  <Button size='lg' variant="danger"><Link to={{
                    pathname:'/search',
                    state: {
                      list:filterResult
                    }
                  }}>Let's Go</Link></Button>}
              </Col>
            </Row>
            <Row>
              <Col lg={4} sm={3}>
                <List link className="rest-list" celled size='large' style={{ background: 'white' }}>
                  {value === '' ? null : newFilterArr.map(item => {
                    return item;
                  })}
                </List>
              </Col>
              <Col lg={4} sm={3}>

              </Col>
              <Col sm={2}>
              </Col>

            </Row>
          </Container>
        </div>
        <h1>Popular Restaurants in {this.state.city}</h1>
        <div className="popular">
          {popularComponents.map((i, index)=>{
            if(index<4){
              return i;
            } else {
              return;
            }
          })}
        </div>
        {this.props.login&&this.props.isCommon?
          <div className="recommand">
            <h1>Recommand Restaurants for you</h1>
            <div className="recommand_list">
              {recommandList.map((i,index)=>{
                if(index<4){
                  return i;
                } else {
                  return;
                }
              })}
            </div>
          </div>
          : null}
      </div>
    )
  }
}

export default Search
