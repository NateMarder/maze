import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Swipe from 'react-easy-swipe';

class SwipeWrapper extends Component {
  onSwipeStart(event) {
    console.log('Start swiping...', event);
  }

  onSwipeMove(position, event) {
    console.log(`Moved ${position.x} pixels horizontally`, event);
    console.log(`Moved ${position.y} pixels vertically`, event);
  }

  onSwipeEnd(event) {
    console.log('End swiping...', event);
  }

  render() {
    return (
      <Swipe
        onSwipeStart={this.onSwipeStart}
        onSwipeMove={this.onSwipeMove}
        onSwipeEnd={this.onSwipeEnd}
      >
       {/* SubComponent Goes Here */}
      </Swipe>
    );
  }
}

// available properties

// tagName: PropTypes.string,
// className: PropTypes.string,
// style: PropTypes.object,
// children: PropTypes.node,
// allowMouseEvents: PropTypes.bool,
// onSwipeUp: PropTypes.func,
// onSwipeDown: PropTypes.func,
// onSwipeLeft: PropTypes.func,
// onSwipeRight: PropTypes.func,
// onSwipeStart: PropTypes.func,
// onSwipeMove: PropTypes.func,
// onSwipeEnd: PropTypes.func
