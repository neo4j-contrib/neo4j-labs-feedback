import React, {Component} from "react";
import {Icon, Loader, Table} from "semantic-ui-react";
import {Link} from "@reach/router";

export class Page extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {
        feedback: []
      }
    }
  }

  componentDidMount() {
    this.getActivities(this.props.page);
  }

  getActivities(page) {
    this.setState({data: {feedback: []}})
    fetch('https://uglfznxroe.execute-api.us-east-1.amazonaws.com/dev/Page/' + page)
      .then(res => res.json())
      .then((data) => {
        this.setState({data: data[0]})
      })
      .catch(console.log)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.page !== this.props.page) {
      this.getActivities(this.props.page);
    }
  }

  render() {
    const {data} = this.state

    const url = atob(this.props.page);
    const title = url.replace("https://", "")

    const totalPositive = data.feedback.filter(row => row.helpful).reduce((total, _) => total + 1, 0)
    const totalNegative = data.feedback.filter(row => !row.helpful).reduce((total, _) => total + 1, 0)

    return <div>
      <h3>{title} <a href={url} target="_blank"><Icon className="open-new-window black"/></a></h3>

      <div>
        <Icon name="thumbs up outline icon green large" style={{margin: 0}}/><sup>{totalPositive}</sup> <Icon
        name="thumbs down outline icon red large" style={{margin: 0}}/><sup>{totalNegative}</sup>
      </div>

      {<Table basic='very' fixed celled collapsing style={{width: "100%"}}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={10}>Feedback</Table.HeaderCell>
            <Table.HeaderCell width={7}>Date</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>

          {data.feedback.map(row => {
            return <Table.Row>
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


          {data.feedback.length === 0 &&
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
