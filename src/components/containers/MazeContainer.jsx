import React from 'react';
import MazeGraph from '../mazeGraphComponents/MZGraph';
import SettingsRow from '../settings/SettingsRow';

export default class MazeContainer extends React.Component {
  state = {
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth,
  };

  componentDidMount = () => {
    this.setState({
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
    });
  };

  render() {
    return (
      <>
        <MazeGraph
          className="mz-container"
          height={this.state.windowHeight}
          width={this.state.windowWidth}
        />
        <SettingsRow />
      </>
    );
  }
}
