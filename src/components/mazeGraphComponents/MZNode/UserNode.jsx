/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */

import React from 'react';
import Velocity from 'velocity-animate';
import { eventServer, events } from '../events';

export default class UserNode extends React.Component {
  constructor(props) {
    super(props);
    this.userNodeRef = React.createRef();
    this.nodeMap = {};
    this.cooldown = false;
    this.keyboardCoolDown = false;
    this.mzGraphRef = null;
  }

  gohome = ({ x, y, self, graph }) => {
    self.cooldown = true;
    self.keyboardCoolDown = true;

    Velocity.animate({
      e: graph.current,
      p: { rotateZ: '-=1440' },
      o: { duration: 1500 },
    });

    setTimeout(() => {
      Velocity.animate({
        e: self.userNodeRef.current,
        p: {
          cx: x,
          cy: y,
          completion: () => {
            self.cooldown = false;
            self.keyboardCoolDown = false;
            self.x = x;
            self.y = y;
          },
        },
        o: {
          duration: 750,
        },
      });
    }, 1550);
  };

  keyboardListener = (e) => {
    if (this.cooldown || this.keyboardCoolDown) {
      return;
    }

    console.log(`keyboard input detected. e.which = ${e.which}`);

    setTimeout(() => {
      this.keyboardCoolDown = true;
      setTimeout(() => { this.keyboardCoolDown = false; }, 250);
    }, 0);

    switch (e.which) {
      default:
      case 38:
      case 87: return this.move({ y: -this.offset });
      case 40:
      case 83: return this.move({ y: this.offset });
      case 39:
      case 68: return this.move({ x: this.offset });
      case 37:
      case 65: return this.move({ x: -this.offset });
    }
  };

  maybeKeepMoving = (current, backwardsKey) => {
    const siblingKeys = Object.keys(this.nodeMap[current]);
    if (siblingKeys.length === 2) {
      let nextKey = null;
      siblingKeys.forEach((key) => {
        if (key !== backwardsKey) {
          nextKey = key;
        }
      });

      const [newXposStr, newYposStr] = nextKey.split('.');
      const [oldXposStr, oldYposStr] = current.split('.');

      if (newXposStr !== oldXposStr) {
        this.move({ x: +newXposStr < +oldXposStr ? -this.offset : this.offset });
      } else {
        this.move({ y: +newYposStr < +oldYposStr ? -this.offset : this.offset });
      }
    }
    this.cooldown = false;
  };

  move = (translation) => {
    const currentKey = `${this.x}.${this.y}`;
    const nextX = (translation.x || 0) + this.x;
    const nextY = (translation.y || 0) + this.y;
    const newKey = `${nextX}.${nextY}`;
    const self = this;

    if (this.nodeMap[currentKey][newKey]) {
      const completion = () => {
        self.x = nextX;
        self.y = nextY;
        if (newKey === self.destNodeKey) {
          eventServer.emit(events.MAZEGAME.DESTFOUND,
            { x: self.startX,
              y: self.startY,
              self,
              graph: self.mzGraphRef,
            },
            self.gohome);
        } else {
          self.maybeKeepMoving(newKey, currentKey);
        }
      };

      // animate
      Velocity.animate({
        e: self.userNodeRef.current,
        p: { cx: nextX, cy: nextY, completion },
        o: {
          duration: 50,
          easing: 'linear',
        },
      });
    }
  };

  componentDidMount = () => {
    this.x = this.props.cx;
    this.y = this.props.cy;
    this.startNodeKey = `${this.x}.${this.y}`;
    this.startX = parseInt(this.x, 10);
    this.startY = parseInt(this.y, 10);
    this.r = this.props.r;
    this.destNodeKey = this.props.destnodekey;
    this.map = this.props.map;
    this.offset = this.props.offset;
    this.props.handleswipebindings(this.keyboardListener);
    this.userNodeRef.current.focus(); // makes keyboard listener work immediately
  };

  componentDidUpdate = () => {
    this.props.map.forEach((n) => {
      const sibs = {};
      // eslint-disable-next-line no-return-assign
      n.siblingKeys.forEach(k => sibs[k] = 1);
      this.nodeMap[n.key] = sibs;
    });
    this.destNodeKey = this.props.destnodekey;
    this.mzGraphRef = this.props.mzgraphref;
  };

  render = () => (
      <circle
        ref={this.userNodeRef}
        onKeyDown={e => this.keyboardListener(e)}
        onBlur={() => {
          this.userNodeRef.current.focus();
        }}
        className="mz-node user-node"
        cx={this.x}
        cy={this.y}
        r={this.r}
        tabIndex="0"
      />
  );
}
