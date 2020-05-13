import React, {Component} from 'react';
import './App.css';
import {Container, Dropdown, Header, Icon, Image, Menu, Segment} from "semantic-ui-react";
import labsImage from './labs.png';
import {Location, navigate, Redirect, Router} from "@reach/router";
import {Feedback} from "./Feedback";
import {Page} from "./Page";
import {Fire} from "./Fire";

const moment = require("moment")

const menuItemStyle = {
  padding: '2em'
}

const defaultIconStyle = {
  padding: '2em 2em 3em 2em'
}

const menuStyle = {
  borderRadius: '0',
  height: '100vh',
  display: 'flex',
  justifyContent: 'space-between',
  width: '6em'
}

const topBarStyle = {
  height: '100%'
}

function SideMenu(props) {
  const project = props.project

  const options = [
    { key: "apoc", text: 'APOC', value: "apoc" },
    { key: "neo4j-streams", text: 'Neo4j Streams', value: "neo4j-streams" },
  ]

  return <Menu vertical={true} inverted style={menuStyle}>
    <div style={topBarStyle}>
      <Menu.Item>
        <Dropdown options={options} fluid defaultValue={project} onChange={(event, data) => navigate(`/${data.value}`)} />
      </Menu.Item>

      <Menu.Item as='a' onClick={() => navigate(`/${project}`)}
                 style={defaultIconStyle}>
        <Icon size='big' name='home' color='grey'/>
      </Menu.Item>
      <Menu.Item  as='a' onClick={() => navigate(`/${project}/fire`)}
                 style={defaultIconStyle}>
        <Icon size='big' className='on-fire' color='grey'/>
      </Menu.Item>

    </div>
  </Menu>
}

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      project: "apoc"
    }
  }

  updateProject(project) {
    this.setState({project: project})
  }

  render() {
    const currentMonth = moment().startOf("month")

    const HomeRoute = (props) => {
      return <Feedback month={currentMonth.format('YYYY-MM-DD')} project={props.project} updateProject = {this.updateProject.bind(this)}  />
    };
    const FeedbackRoute = props => {
      return <Feedback month={props.month} project={props.project} updateProject = {this.updateProject} />
    };
    const PageRoute = props => {
      return <Page page={props.page} project={props.project} updateProject = {this.updateProject} />
    };
    const FireRoute = (props) => {
      return <Fire project={props.project} updateProject = {this.updateProject} />
    };

    const project = this.state.project;

    const page = {
      header: "Neo4j Labs Feedback",
      view: <Feedback/>
    }

    return (
      <Container fluid style={{ display: 'flex' }}>
        <SideMenu project={project} />

        <div style={{width: '100%'}}>
          <Segment basic  vertical={false}
                   style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0' }}>
            {page.header ? <Header as='h1' inverted color='grey' style={{marginTop: '0'}}>
              {page.header}
            </Header> : null}
          <Image src={labsImage} width="38px" height="38px" />

          </Segment>
          <div style={{display: "flex", padding: "1em 1em"}}>
            <Router>
              <Redirect from="/" to="/apoc" />
              <HomeRoute path="/:project" />
              <FeedbackRoute path="/:project/feedback/:month" />
              <PageRoute path="/:project/page/:page" />
              <FireRoute path="/:project/fire" />
            </Router>
          </div>
        </div>
      </Container>
    );
  }
}

export default App;
