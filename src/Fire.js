import React, {Component} from "react";
import {Icon, Loader, Table} from "semantic-ui-react";
import {Link} from "@reach/router";

export class Fire extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: []
    }
  }

  componentDidMount() {
    this.getActivities(this.props.page);
  }

  getActivities(page) {
    this.setState({data: [] })
    fetch('https://uglfznxroe.execute-api.us-east-1.amazonaws.com/dev/Fire')
      .then(res => res.json())
      .then((data) => {
        this.setState({data: data})
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

    return <div>
      {<Table basic='very' fixed celled collapsing style={{width: "100%"}}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={7}>Page</Table.HeaderCell>
            <Table.HeaderCell width={6} colSpan={2}>Feedback</Table.HeaderCell>
            <Table.HeaderCell width={3}>% Negative</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>

          {data.map(row => {
            return <Table.Row>
              <Table.Cell>
                <Link to={"/page/" + btoa(row.uri.toString())}>{row.uri.toString()}</Link>
                <a href={row.uri.toString()} target="_blank">
                  <Icon className="open-new-window black"/>
                </a>

              </Table.Cell>
              <Table.Cell>
                <Icon name="thumbs down outline icon red large" style={{margin: 0}}/><sup>{row.notHelpful}</sup>
              </Table.Cell>
              <Table.Cell>
                <Icon name="thumbs up outline icon green large" style={{margin: 0}}/><sup>{row.helpful}</sup>
              </Table.Cell>
              <Table.Cell>
                {row.unhelpfulness * 100}
              </Table.Cell>
            </Table.Row>
          })}


          {data.length === 0 &&
          <Table.Row>
            <Table.Cell colSpan={4} textAlign={"center"}>
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
