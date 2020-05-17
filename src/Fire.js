import React, {Component} from "react";
import {Icon, Loader, Table} from "semantic-ui-react";
import {Link} from "react-router-dom";

export class Fire extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      apiRequestProcessed: false,
      error: null
    }
  }

  componentDidMount() {
    this.getActivities(this.props.page);
  }

  getActivities(page) {
    this.setState({data: [], apiRequestProcessed: false, error: null })
    let httpEndPoint = `${this.props.apiServer}/Fire/${this.props.project}`;
    fetch(httpEndPoint)
      .then(res => res.json())
      .then((data) => {
        this.setState({data: data, apiRequestProcessed: true})
      })
      .catch(error => {
        this.setState({apiRequestProcessed: true, error: `Request to ${httpEndPoint} failed: ${error.toString()}`})
      })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.page !== this.props.page) {
      this.getActivities(this.props.page);
    }

  }

  render() {
    const {data, apiRequestProcessed, error} = this.state

    return <div>
      {<Table basic='very' fixed celled collapsing style={{width: "100%"}}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={7}>Page</Table.HeaderCell>
            <Table.HeaderCell width={6} colSpan={2}>Feedback</Table.HeaderCell>
            <Table.HeaderCell width={3}>Negative Ranking</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>

          {data.map(row => {
            return <Table.Row>
              <Table.Cell>
                <Link to={`/${this.props.project}/page/` + btoa(row.uri.toString())}>{row.uri.toString()}</Link>
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
                {row.unhelpfulness}
              </Table.Cell>
            </Table.Row>
          })}

          {apiRequestProcessed && data.length === 0 &&
          <Table.Row>
            <Table.Cell colSpan={4} textAlign={"center"}>
              {error || 'No feedback available'}
            </Table.Cell>
          </Table.Row>
          }


          {!apiRequestProcessed &&
          <Table.Row>
            <Table.Cell colSpan={4} textAlign={"center"}>
              <Loader active inline centered="true">
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
