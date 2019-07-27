/* eslint-disable no-use-before-define, prefer-const, consistent-return,
  no-param-reassign, react-hooks/exhaustive-deps, no-return-assign, prefer-destructuring */

import React, { useEffect } from 'react';
import Velocity from 'velocity-animate';
import { eventServer, events } from '../../events/events';

const PlayerNode = (props) => {
  let userNodeRef = React.createRef();
  let nodeMap = {};
  let [cooldown, keyboardCoolDown, keyIsDown] = [false, false, false];
  let { cx, cy, r, offset, map, handleswipebindings, destnodekey, mzgraphref } = props;
  const startX = cx;
  const startY = cy;

  const sendPlayerHome = ({ x, y, self, graph }) => {
    cooldown = true;

    const spinTheBoard = {
      e: graph.current,
      p: { rotateZ: '720deg' },
      o: { duration: 1000 },
    };

    const sendPlayerBackToStart = {
      e: userNodeRef.current,
      p: { cx: x, cy: y },
      o: { duration: 'slow' },
    };

    // uses promises to run animations sequentially
    Velocity.animate(spinTheBoard)
      .then(() => { Velocity.animate(sendPlayerBackToStart); })
      .then(() => {
        cooldown = false;
        keyboardCoolDown = false;
        cx = x;
        cy = y;
      });
  };

  const determineNextMove = (current, backwardsKey) => {
    const siblingKeys = Object.keys(nodeMap[current]);
    if (siblingKeys.length !== 2) {
      return;
    }

    const nextKey = siblingKeys.find(k => k !== backwardsKey); // first index of non backwards key
    const [newX, newY] = nextKey.split('.').map(val => +val);
    const [oldX, oldY] = current.split('.').map(val => +val);

    if (newX !== oldX) {
      move({ x: newX < oldX ? -offset : offset });
    } else if (newY !== oldY) {
      move({ y: newY < oldY ? -offset : offset });
    }

    cooldown = false;
  };

  const move = (translation) => {
    const currentKey = `${cx}.${cy}`;
    const nextX = (translation.x || 0) + cx;
    const nextY = (translation.y || 0) + cy;
    const newKey = `${nextX}.${nextY}`;

    if (nodeMap[currentKey][newKey]) {
      const completion = () => {
        cx = nextX;
        cy = nextY;
        if (newKey === destnodekey) {
          const payload = {
            x: startX,
            y: startY,
            self: userNodeRef,
            graph: mzgraphref,
          };
          eventServer.emit(
            events.MAZEGAME.DESTFOUND,
            payload,
            sendPlayerHome,
          );
        } else {
          determineNextMove(newKey, currentKey);
        }
      };

      // animate
      Velocity.animate({
        e: userNodeRef.current,
        p: { cx: nextX, cy: nextY, completion, translateZ: 0 },
        o: {
          duration: 50,
          easing: 'linear',
        },
      });
    }
  };

  const keyboardListener = (e) => {
    if (cooldown || keyboardCoolDown || keyIsDown) { return; }

    setTimeout(() => {
      keyboardCoolDown = true;
      keyIsDown = true;
      setTimeout(() => { keyboardCoolDown = false; }, 250);
    });

    switch (e.which) {
      default:
      case 38:
      case 87: return move({ y: -offset });
      case 40:
      case 83: return move({ y: offset });
      case 39:
      case 68: return move({ x: offset });
      case 37:
      case 65: return move({ x: -offset });
    }
  };

  useEffect(() => {
    if (!props.map) { return; }
    if (!destnodekey) {
      destnodekey = props.destnodekey;
    }
    handleswipebindings(keyboardListener);
    userNodeRef.current.focus(); // makes keyboard listener work immediately
    map.forEach((n) => {
      const sibs = {};
      n.siblingKeys.forEach(k => sibs[k] = 1);
      nodeMap[n.key] = sibs;
    });
  }, [props.map]);

  return (
    <circle
      ref={userNodeRef}
      onKeyDown={(e) => { keyboardListener(e); }}
      onKeyUp={() => { keyIsDown = false; }}
      onBlur={() => { userNodeRef.current.focus(); }}
      className="mz-node user-node"
      cx={cx} cy={cy} r={r} tabIndex="0"
    />
  );
};

export default PlayerNode;
