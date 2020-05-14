import React, {Component} from 'react';
import './App.css';
import {Container, Dropdown, Header, Image, Menu, Segment} from "semantic-ui-react";
import labsImage from './labs.png';

import {Feedback} from "./Feedback";
import {AppContext, AppContextConsumer} from "./appContext";
import {BrowserRouter as Router, Route, Switch, useHistory, useLocation, useRouteMatch} from "react-router-dom";
import {Fire} from "./Fire";
import {Page} from "./Page";

const moment = require("moment")

const defaultIconStyle = {
  padding: '1em 1em 1em 1em'
}

const menuStyle = {
  borderRadius: '0',
  height: '100vh',
  display: 'flex',
  justifyContent: 'space-between',
  width: '12em'
}

const topBarStyle = {
  height: '100%'
}

function SideMenu(props) {
  let history = useHistory();

  const {context} = props

  const options = [
    {key: "apoc", text: 'APOC', value: "apoc"},
    {key: "neo4j-streams", text: 'Neo4j Streams', value: "neo4j-streams"},
  ]

  return <Menu vertical={true} inverted style={menuStyle}>
        <div style={topBarStyle}>
          <Menu.Item>
            <Dropdown options={options} fluid value={context.project}
                      onChange={(event, data) => {
                        context.updateProject(data.value)
                        history.push(`/${data.value}`)
                      }
                      }/>
          </Menu.Item>

          <Menu.Item as='a' onClick={() => history.push(`/${context.project}`)}
                     style={defaultIconStyle}>
            All Feedback
          </Menu.Item>
          <Menu.Item as='a' onClick={() => history.push(`/${context.project}/fire`)}
                     style={defaultIconStyle}>
            Negative Feedback
          </Menu.Item>

        </div>
      </Menu>
}

function Routes(props) {
  let l = useLocation();
  let match = useRouteMatch("/:project");
  React.useEffect(() => {
    if (match && match.params.project) {
      props.context.updateProject(match.params.project)
    }
  }, [l]);

  const currentMonth = moment().startOf("month")

  return <Switch>
    <Route path="/" exact
           render={() =>
             <Feedback month={currentMonth.format('YYYY-MM-DD')} project="apoc"/>}
    />

    <Route path="/:project" exact
           render={(props) =>
             <Feedback month={currentMonth.format('YYYY-MM-DD')} project={props.match.params.project}/>}
    />

    <Route path="/:project/feedback/:month" exact
           render={(props) =>
             <Feedback month={props.match.params.month} project={props.match.params.project}/>}
    />

    <Route path="/:project/fire" exact
           render={(props) =>
             <Fire project={props.match.params.project}/>}
    />

    <Route path="/:project/page/:page" exact
           render={(props) =>
             <Page page={props.match.params.page}/>}
    />

  </Switch>
}


export default function App() {
  const page = {
    header: "Neo4j Labs Feedback",
    view: <Feedback/>
  }

  return (
    <Router>
      <Container fluid style={{display: 'flex'}}>
        <AppContextConsumer>
          {context =>
            <React.Fragment>
              <SideMenu context={context}/>

              <div style={{width: '100%'}}>
                <Segment basic vertical={false}
                         style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0'}}>
                  {page.header ? <Header as='h1' inverted color='grey' style={{marginTop: '0'}}>
                    {page.header}
                  </Header> : null}
                  <Image src={labsImage} width="38px" height="38px"/>

                </Segment>
                <div style={{display: "flex", padding: "1em 1em"}}>

                  <Routes context={context}/>

                </div>
              </div>
            </React.Fragment>
          }
        </AppContextConsumer>
      </Container>
    </Router>
  );

}
