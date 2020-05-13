import React, {Component} from 'react';
import './App.css';
import {Dropdown, Icon, Loader, Table} from "semantic-ui-react";
import {Link, navigate} from "@reach/router";

import Moment from 'moment'

export class Feedback extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: []
    }
  }

  componentDidMount() {
    this.getActivities(this.props.month);
  }

  getActivities(month) {
    this.setState({data: []})
    fetch('https://uglfznxroe.execute-api.us-east-1.amazonaws.com/dev/Feedback?date=' + month)
      .then(res => res.json())
      .then((data) => {
        this.setState({data: data})
      })
      .catch(console.log)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.month !== this.props.month) {
      this.getActivities(this.props.month);
    }
  }

  render() {
    const {data} = this.state

    const dateStart = Moment(new Date(2020, 0, 1))
    const dateEnd = Moment().startOf("month")
    const monthOptions = [];

    while (dateEnd >= dateStart || dateStart.format('M') === dateEnd.format('M')) {
      monthOptions.push({
        key: dateStart.format('YYYY-MM-DD'),
        value: dateStart.format('YYYY-MM-DD'),
        text: dateStart.format('MMM YYYY')
      });
      dateStart.add(1, 'month');
    }

    const totalPositive = data.filter(row => row.helpful).reduce((total, _) => total + 1, 0)
    const totalNegative = data.filter(row => !row.helpful).reduce((total, _) => total + 1, 0)

    return <div>
      <span>
        Feedback in {' '}
        <Dropdown
          placeholder='Select month'
          inline
          defaultValue={this.props.month}
          options={monthOptions}
          onChange={(event, data) => navigate("/apoc/feedback/" + data.value)}
        /> <Icon name="thumbs up outline icon green" style={{margin: 0}}/><sup>{totalPositive}</sup> <Icon
        name="thumbs down outline icon red" style={{margin: 0}}/><sup>{totalNegative}</sup>
      </span>

      {<Table basic='very' fixed celled collapsing style={{width: "100%"}}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={7}>Page</Table.HeaderCell>
            <Table.HeaderCell width={5}>Feedback</Table.HeaderCell>
            <Table.HeaderCell width={5}>Date</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>

          {data.map(row => {
            return <Table.Row>
              <Table.Cell key={row.uri}>
                <Link to={"/page/" + btoa(row.uri.toString())}>{row.uri.toString()}</Link>
                <a href={row.uri.toString()} target="_blank">
                  <Icon className="open-new-window black"/>
                </a>
              </Table.Cell>
              <Table.Cell>
                {row.helpful ?
                  <Icon name="thumbs up outline icon large green"/> :
                  <div>
                    <p><Icon name="thumbs down outline icon large red"/>{row.reason}</p>
                    {row.information && <p>{row.information}</p>}
                  </div>}
              </Table.Cell>
              <Table.Cell>
                {row.date}
              </Table.Cell>
            </Table.Row>
          })}


          {data.length === 0 &&
          <Table.Row>
            <Table.Cell colSpan={3} textAlign={"center"}>
              <Loader active inline centered>
                Loading Feedback
              </Loader>
            </Table.Cell>
          </Table.Row>
          }

        </Table.Body>
      </Table>}


    </div>
  }
}
