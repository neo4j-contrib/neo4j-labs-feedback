import React, {Component} from 'react';
import './App.css';
import {Container, Header, Icon, Image, Menu, Segment} from "semantic-ui-react";
import labsImage from './labs.png';
import {navigate, Redirect, Router} from "@reach/router";
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

function SideMenu() {
  return <Menu vertical={true} inverted style={menuStyle}>
    <div style={topBarStyle}>
      <Menu.Item as='a' onClick={() => navigate("/")}
                 style={defaultIconStyle}>
        <Icon size='big' name='home' color='grey'/>
      </Menu.Item>
      <Menu.Item  as='a' onClick={() => navigate("/apoc/fire")}
                 style={defaultIconStyle}>
        <Icon size='big' className='on-fire' color='grey'/>
      </Menu.Item>

    </div>
  </Menu>
}

class App extends Component {
  render() {
    const currentMonth = moment().startOf("month")

    const HomeRoute = () => <Feedback month={currentMonth.format('YYYY-MM-DD')}/>;
    const FeedbackRoute = props => <Feedback month={props.month} />;
    const PageRoute = props => <Page page={props.page} />;
    const FireRoute = () => <Fire />;

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
              <Redirect from="/" to="/apoc" />
              <HomeRoute path="/apoc" />
              <FeedbackRoute path="/apoc/feedback/:month" />
              <PageRoute path="/apoc/page/:page" />
              <FireRoute path="/apoc/fire" />
            </Router>
          </div>
        </div>
      </Container>
    );
  }
}

export default App;
