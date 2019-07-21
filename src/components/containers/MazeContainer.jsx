import React from 'react';
import Swipe from 'react-easy-swipe';
import MazeGraph from '../mazeGraphComponents/MZGraph';
import SettingsRow from '../settings/SettingsRow';
import { KEYCODEMAP } from '../../utilities/keyboardEventHelper';

export default class MazeContainer extends React.Component {
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

  getSwipeProps = () => ({
    onSwipeUp: () => this.state.synthClick({ which: KEYCODEMAP.UP }),
    onSwipeDown: () => this.state.synthClick({ which: KEYCODEMAP.DOWN }),
    onSwipeLeft: () => this.state.synthClick({ which: KEYCODEMAP.LEFT }),
    onSwipeRight: () => this.state.synthClick({ which: KEYCODEMAP.RIGHT }),
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
