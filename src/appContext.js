import React, { Component } from "react";
const AppContext = React.createContext();
const { Provider, Consumer } = AppContext

class AppContextProvider extends Component {
  state = {
    project: "apoc"
  };

  updateProject = (project) => {
    if(this.state.project !== project) {
      this.setState({project: project});
    }
  };

  render() {
    return (
      <Provider
        value={{ project: this.state.project, updateProject: this.updateProject }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

export { AppContextProvider, Consumer as AppContextConsumer, AppContext };
