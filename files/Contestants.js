import React, { Component } from 'react';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import awsmobile from './aws-exports';
import ReactTable from "react-table";

Amplify.configure(awsmobile);

const listCompetitors = `query listCompetitors {
  listCompetitors(limit: 1000){
    items{
      id
      name
      phone
      email
      starttime
      endtime
      result
    }
  }
}`

class Contestents extends Component {

  componentWillMount() {
    this.listQuery();
  }

  constructor(props) {
    super(props);
    this.state = {
      competitors: {},
      data: []
    };
  }

  listQuery = async () => {
    const allCompetitors = await API.graphql(graphqlOperation(listCompetitors));
    this.setState({competitors: allCompetitors['data']['listCompetitors']['items']},
      function(){
        const data = this.state.competitors.map(function(competitor){
          return {
            "name": competitor['name'],
            "phone": competitor['phone'],
            "email": competitor['email'],
            "time": Math.round((competitor['endtime'] - competitor['starttime']) / 1000),
            "score": Number(competitor['result'])
          }
        })
        this.setState({data: data})
      }
    );
  }

  render() {
    console.log(this.state.competitors);
    const columns=[{
      Header: 'Name',
      headerClassName: 'text-left',
      accessor: 'name',
      minWidth: 200,
      className: 'text-left'
    }, {
      Header: 'Phone',
      headerClassName: 'text-left',
      accessor: 'phone',
      minWidth: 200,
      className: 'text-left'
    }, {
      Header: 'Email',
      headerClassName: 'text-left',
      accessor: 'email',
      minWidth: 300,
      className: 'text-left'
    }, {
      Header: 'Time (seconds)',
      accessor: 'time',
      minWidth: 100
    }, {
      Header: 'Score (out of 12)',
      accessor: 'score',
      minWidth: 100
    }]

    return (
      <div className="container">
        <div className="row">
        &nbsp;
        </div>
        <div className="row">
          <div className="col text-center mt-4">
          <ReactTable
            getTheadTrProps={() => ({ className: 'font-weight-bold' })}
            className="-striped -highlight"
            data={this.state.data}
            columns={columns}
            minRows="5"
            showPagination={false}
            defaultPageSize={1000}
          />
        </div>
        </div>
        <div className="row">
        &nbsp;
        </div>
      </div>
    );
  }
}

export default Contestents
