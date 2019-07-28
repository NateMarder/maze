import React from 'react';
import MazeGraph from '../maze/MazeGraph';
import SettingsRow from '../SettingsRow';

export default class MazeContainer extends React.Component {
  cooldown = false;

  state = {};

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
          handleswipebindings={this.handleSwipeBindings}
        />
        <SettingsRow />
      </>
    );
  }
}
