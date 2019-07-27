import React from 'react';
import Swipe from 'react-easy-swipe';
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

  handleSwipeBindings = (cb) => {
    if (cb && !this.state.synthClick) {
      this.setState({
        synthClick: cb,
      });
    }
  }

  handleCoolDown = () => {
    this.cooldown = true;
    setTimeout(() => { this.cooldown = false; }, 250);
  }

  getSwipeProps = () => ({
    onSwipeUp: () => {
      if (!this.cooldown) {
        this.handleCoolDown();
        this.state.synthClick({ which: 38 });
      }
    },
    onSwipeDown: () => {
      if (!this.cooldown) {
        this.handleCoolDown();
        this.state.synthClick({ which: 40 });
      }
    },
    onSwipeLeft: () => {
      if (!this.cooldown) {
        this.handleCoolDown();
        this.state.synthClick({ which: 37 });
      }
    },
    onSwipeRight: () => {
      if (!this.cooldown) {
        this.handleCoolDown();
        this.state.synthClick({ which: 39 });
      }
    },
    onSwipeMove: () => true,
    allowMouseEvents: true,
  });

  render() {
    return (
      <>
        <Swipe {...this.getSwipeProps()}>
            <MazeGraph
              className="mz-container"
              height={this.state.windowHeight}
              width={this.state.windowWidth}
              handleswipebindings={this.handleSwipeBindings}
            />
        </Swipe>
        <SettingsRow />
      </>
    );
  }
}
