/* eslint-disable no-underscore-dangle */
import _ from 'lodash';
import { shuffle, getOrthogonalKey } from '../../utilities/index';
/**
 * Level One creates a maze using the depth-first searching algorithm.
 */
export default class LevelOneWithLeafs {
  prepareLocalDataStore(maze) {
    this.leafMap = {};
    this.nodeMap = [];
    this.route = [];
    const { nodes } = maze;
    nodes.forEach(n => {
      const clonedNode = JSON.parse(JSON.stringify(n));
      const clonedKeys = JSON.parse(JSON.stringify(n.siblingKeys));
      clonedNode.siblingKeys = shuffle(clonedKeys);
      clonedNode.discoveredBy = null;
      this.nodeMap[n.key] = clonedNode;
    });

    this.startNode = _.find(this.nodeMap, n => n.isStart);
    this.startNode.isVisited = true;
  }

  getLeafMap() {
    return this.leafMap;
  }

  run(mazeData) {
    this.prepareLocalDataStore(mazeData);
    this.generateMazeWithDfs();
    return this.route; // equivalent to path
  }

  generateMazeWithDfs() {
    const stack = [];
    stack.push(this.startNode);
    while (stack.length) {
      const w = stack.pop();
      this.visit(w);
      w.siblingKeys.forEach(sibKey => {
        if (!this.nodeMap[sibKey].isVisited) {
          this.nodeMap[sibKey].discoveredBy = w.key;
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
        y2: parseInt(nY, 10)
      };
      const correspondingWallToInactivate = getOrthogonalKey(x1, y1, x2, y2);
      this.route.push(correspondingWallToInactivate);
    }
  }
}
