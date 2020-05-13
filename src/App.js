import React, {Component} from 'react';
import './App.css';
import {Container, Dropdown, Header, Icon, Image, Menu, Segment} from "semantic-ui-react";
import labsImage from './labs.png';
import {createHistory, Location, navigate, Redirect, Router} from "@reach/router";
import {Feedback} from "./Feedback";
import {Page} from "./Page";
import {Fire} from "./Fire";
import {AppContext, AppContextConsumer} from "./appContext";

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

function SideMenu() {

  const options = [
    { key: "apoc", text: 'APOC', value: "apoc" },
    { key: "neo4j-streams", text: 'Neo4j Streams', value: "neo4j-streams" },
  ]

  return <AppContextConsumer>
    {context => (<Menu vertical={true} inverted style={menuStyle}>
        <div style={topBarStyle}>
          <Menu.Item>
            <Dropdown options={options} fluid defaultValue={context.project}
                      onChange={(event, data) => {
                        context.updateProject(data.value)
                        navigate(`/${data.value}`)}
                      }/>
          </Menu.Item>

          <Menu.Item as='a' onClick={() => navigate(`/${context.project}`)}
                     style={defaultIconStyle}>
            <Icon size='big' name='home' color='grey'/>
          </Menu.Item>
          <Menu.Item as='a' onClick={() => navigate(`/${context.project}/fire`)}
                     style={defaultIconStyle}>
            <Icon size='big' className='on-fire' color='grey'/>
          </Menu.Item>

        </div>
      </Menu>
    )}
  </AppContextConsumer>
}

class App extends Component {



  render() {
    const currentMonth = moment().startOf("month")

    const FeedbackRoute = props => <Feedback month={props.month} project={props.project}  />;


    const page = {
      header: "Neo4j Labs Feedback",
      view: <Feedback/>
    }

    return (
      <Container fluid style={{ display: 'flex' }}>
        <SideMenu />

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
              <Redirect from="/" to="/apoc" noThrow />
              <Feedback path="/:project" month={currentMonth.format('YYYY-MM-DD')} />
              <FeedbackRoute path="/:project/feedback/:month" />
              <Page path="/:project/page/:page" />
              <Fire path="/:project/fire" />
            </Router>
          </div>
        </div>
      </Container>
    );
  }
}


App.contextType = AppContext;

export default App;
