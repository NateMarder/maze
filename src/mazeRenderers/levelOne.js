/* eslint-disable no-underscore-dangle */
import _ from 'lodash';
import { shuffle, getOrthogonalKey } from '../utilities';

/**
 * @description Level One creates a maze using the depth-first searching algorithm.
 */
export default class LevelOne {
  prepareLocalDataStore(maze) {
    this.nodeMap = {};
    this.route = [];
    this.destNodeKey = '';
    this.maxDx = 0;
    const { nodes } = maze;
    nodes.forEach((n) => {
      const clonedNode = JSON.parse(JSON.stringify(n));
      const clonedKeys = [...n.siblingKeys];
      clonedNode.siblingKeys = shuffle(clonedKeys);
      clonedNode.discoveredBy = null;
      clonedNode.dXFromStart = 0;
      this.nodeMap[n.key] = clonedNode;
    });

    this.startNode = _.find(this.nodeMap, n => n.isStart);
    this.startNode.isVisited = true;
  }

  run(mazeData) {
    this.prepareLocalDataStore(mazeData);
    this.generateMazeWithDfs();
    return {
      route: this.route,
      destNodeKey: this.destNodeKey,
    };
  }

  updateCount(w) {
    w.siblingKeys.forEach((sibKey) => {
      const sib = this.nodeMap[sibKey];
      sib.dXFromStart = !sib.isVisited ? w.dXFromStart + 1 : sib.dXFromStart;
      if (sib.dXFromStart > this.maxDx) {
        this.maxDx = sib.dXFromStart;
        this.destNodeKey = sib.key;
      }
    });
  }

  updateNodeWithMaxDXFromStart(n) {
    if (n.dXFromStart > this.maxDx) {
      this.maxDx = n.dXFromStart;
      this.destNodeKey = n.key;
    }
  }

  generateMazeWithDfs() {
    const stack = [];
    stack.push(this.startNode);
    while (stack.length) {
      const w = stack.pop();
      this.visit(w);
      this.updateCount(w);

      w.siblingKeys.forEach((sibKey) => {
        if (!this.nodeMap[sibKey].isVisited) {
          this.nodeMap[sibKey].discoveredBy = w.key;
          if (w.isStart) {
            this.nodeMap[sibKey].dXFromStart = 1;
          } else if (!w.isStart) {
            this.nodeMap[sibKey].dXFromStart = w.dXFromStart + 1;
          }
          stack.push(this.nodeMap[sibKey]); // push
        }
      });
    }
  }

  visit(n) {
    if (n.isVisited === false) {
      n.isVisited = true; // eslint-disable-line no-param-reassign
      const [discX, discY] = n.discoveredBy.split('.');
      const [nX, nY] = n.key.split('.');
      const { x1, y1, x2, y2 } = {
        x1: parseInt(discX, 10),
        y1: parseInt(discY, 10),
        x2: parseInt(nX, 10),
        y2: parseInt(nY, 10),
      };
      const correspondingWallToInactivate = getOrthogonalKey(x1, y1, x2, y2);
      this.route.push(correspondingWallToInactivate);
    }
  }
}
