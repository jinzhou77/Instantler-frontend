import React, { Component } from 'react';

import axios from 'axios'
import {List} from 'semantic-ui-react'
class TableDataInfo extends Component {
  constructor(props){
    super(props);
    this.state={
      tableData:[]
    }
  }
  componentDidMount(){
    axios.get("http://django-env.zjepgtqmt4.us-west-2.elasticbeanstalk.com/api/table-data/?restaurant="+localStorage.getItem('restId'))
    .then((res)=>{
      var datas = res.data;
      let tableData = [];
      for(let i=0;i<datas.length; i++){
        if(this.props.dateTime === datas[i].dateTime){
          tableData.push(datas[i]);
        }
        this.setState({
          tableData
        })
      }
    })
  }
  render(){
    const {tableData} = this.state
    console.log(tableData);
    var tableList = [];
    for(let i=0;i<tableData.length;i++){
      tableList.push(
        <List.Item key={tableData[i].id} key={tableData[i].type}>
          <List.Content floated="right">
            Numbers of Availiablity: {tableData[i].remainNum}
          </List.Content>
          <List.Content>
            Name of table type: {tableData[i].type}
          </List.Content>
        </List.Item>
      )
    }

    return (
      <div>
        <List divided verticalAlign='middle' >
          {tableList.map(i=>{return i})}
        </List>
      </div>
    )
  }
}
export default TableDataInfo
