import React, {useState} from 'react';
import {Container, Dropdown, Header, Image, Menu, Segment} from "semantic-ui-react";
import './App.css';
import labsImage from './labs.png';

import {Feedback} from "./Feedback";
import {AppContextConsumer} from "./appContext";
import {BrowserRouter as Router, Route, Switch, useHistory, useLocation, useRouteMatch} from "react-router-dom";
import {Fire} from "./Fire";
import {Page} from "./Page";
import {slide as HamburgerMenu} from 'react-burger-menu'

const moment = require("moment")

const defaultIconStyle = {
    padding: '1em 1em 1em 1em'
}

const menuStyle = {
    borderRadius: '0',
    minHeight: '100vh',
    display: 'flex',
    width: '12em'
}

const rightMenuStyle = {
    borderRadius: '0',
    display: 'flex',
    width: '100%',
}

const navStyle = {
    backgroundColor: "#1b1c1d"
}

const projects = {
    "apoc": "APOC",
    "GRANDstack": "GRANDstack",
    "neo4j-streams": "Neo4j Streams",
    "developer": "Developer Guides",
    "@graphapps-apoc": "APOC Graph App",
    "@graphapps-neosemantics": "n10s Graph App"
}

function TopMenu(props) {
    const [menuOpen, setMenuOpen] = useState(false);

    let history = useHistory();

    const {context} = props

    const options = Object.keys(projects).map(key => {
        return {key: key, text: projects[key], value: key}
    })

    return <nav className="top-nav">
        <HamburgerMenu right
                       isOpen={menuOpen}
                       onStateChange={(state) => setMenuOpen(state.isOpen)}
        >
            <Menu vertical={true} inverted style={rightMenuStyle}
                  >
                <Menu.Item>
                    <Dropdown options={options} fluid value={context.project}
                              onChange={(event, data) => {
                                  context.updateProject(data.value)
                                  setMenuOpen(false)
                                  history.push(`/${data.value}`)
                              }
                              }/>
                </Menu.Item>


                <Menu.Item as='a' onClick={() => {
                    setMenuOpen(false)
                    history.push(`/${context.project}`)
                }}
                           style={defaultIconStyle}>
                    All Feedback
                </Menu.Item>
                <Menu.Item as='a' onClick={() => {
                    setMenuOpen(false)
                    history.push(`/${context.project}/fire`)
                }}
                           style={defaultIconStyle}>
                    Negative Feedback
                </Menu.Item>
            </Menu>
        </HamburgerMenu>
    </nav>
}

function Routes(parentProps) {
    let l = useLocation();
    let match = useRouteMatch("/:project");
    React.useEffect(() => {
        if (match && match.params.project) {
            parentProps.context.updateProject(match.params.project)
        }
    }, [l]);

    const currentMonth = moment().startOf("month")

    return <Switch>
        <Route path="/" exact
               render={() =>
                   <Feedback apiServer={parentProps.apiServer} month={currentMonth.format('YYYY-MM-DD')}
                             project="apoc"/>}
        />

        <Route path="/:project" exact
               render={(props) =>
                   <Feedback apiServer={parentProps.apiServer} month={currentMonth.format('YYYY-MM-DD')}
                             project={props.match.params.project}/>}
        />

        <Route path="/:project/feedback/:month" exact
               render={(props) =>
                   <Feedback apiServer={parentProps.apiServer} month={props.match.params.month}
                             project={props.match.params.project}/>}
        />

        <Route path="/:project/fire" exact
               render={(props) =>
                   <Fire apiServer={parentProps.apiServer} project={props.match.params.project}/>}
        />

        <Route path="/:project/page/:page" exact
               render={(props) =>
                   <Page apiServer={parentProps.apiServer} page={props.match.params.page}/>}
        />

    </Switch>
}


export default function App(props) {
    const page = {
        header: "Neo4j Labs Feedback",
        view: <Feedback/>
    }

    return (
        <Router>
            <Container fluid style={{display: 'flex'}} className="main">
                <AppContextConsumer>
                    {context =>
                        <React.Fragment>
                            <TopMenu context={context}/>

                            <main style={{width: '100%'}}>
                                <Segment basic vertical={false}
                                         style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0'}}>
                                    {context.project ? <Header as='h1' inverted color='grey' style={{marginTop: '0'}}>
                                        {projects[context.project] + " Feedback"}
                                    </Header> : null}
                                    {/*<Image src={labsImage} width="38px" height="38px"/>*/}

                                </Segment>
                                <div style={{display: "flex", padding: "1em 1em"}}>

                                    <Routes context={context} apiServer={props.apiServer}/>

                                </div>
                            </main>
                        </React.Fragment>
                    }
                </AppContextConsumer>
            </Container>
        </Router>
    );

}
