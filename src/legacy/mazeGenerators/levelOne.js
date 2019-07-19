/* eslint-disable no-underscore-dangle */
import * as U from '../mazeUtilities/utilities';

/**
 * levelOne module
 * @fileOverview ToDo: Add file description
 * @module levelOne
 */
class levelOne {
  constructor(maze) {
    this.nodes = {};
    this.dataReady = false;
    if (maze != null) {
      this.maze = maze;
      this.nodes = maze.nodes;
      this.prepareLocalDataStore();
    }
  }

  prepareLocalDataStore() {
    if (this.dataReady) {
      return;
    }
    this.wallsToDeactivate = [];
    const keys = Object.keys(this.nodes);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      this.nodes[key].isVisited = false;
      this.nodes[key].discoveredBy = null;
      this.nodes[key].siblings = U.shuffle(this.nodes[key].siblings);
      if (this.nodes[key].isStart) {
        this.startNode = this.nodes[key];
        this.startNode.isVisited = true;
      }
    }
    this.dataReady = true;
  }

  run(maze) {
    if (maze != null) {
      this.dataReady = false;
      delete this.maze;
      delete this.nodes;
      this.maze = maze;
      this.nodes = maze.nodes;
    }
    this.prepareLocalDataStore();
    this.generateMazeWithDfs();
    this.dataReady = false;
    this.maze.activateAllWalls();
    for (let i = 0, _a = this.wallsToDeactivate; i < _a.length; i += 1) {
      const wall = _a[i];
      this.maze.deactivateWallUsingWallKey(wall);
    }
  }

  generateMazeWithDfs() {
    const stack = [];
    this.push(stack, this.startNode);
    while (stack.length > 0) {
      const w = this.pop(stack);
      if (w !== undefined) {
        this.visit(w);
        for (let i = 0, _a = w.siblings; i < _a.length; i += 1) {
          const sibKey = _a[i];
          const sib = this.nodes[sibKey];
          if (!sib.isVisited) {
            sib.discoveredBy = w.key;
            this.push(stack, sib);
          }
        }
      }
    }
  }

  visit(n) {
    if (n !== this.startNode) {
      n.isVisited = true; // eslint-disable-line no-param-reassign
      const disc = n.discoveredBy.split('.');
      const wallKey = U.getOrthogonalKey(+disc[0], +disc[1], +n.cx, +n.cy);
      this.wallsToDeactivate.push(wallKey);
    }
  }

  push(array, node) {
    array.unshift(node);
  }

  pop(array) {
    return array.shift();
  }
}
