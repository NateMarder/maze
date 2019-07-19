/**
 * dijkstra module
 * @fileOverview ToDo: Add file description
 * @module dijkstra
 */
const dijkstra = (function () {
  function dijkstra(maze) {
    this.maxdist = 999999;
    this.startNodeIndex = -1;
    this.solveNeeded = true;
    this.maze = maze;
    this.refreshData();
  }
  dijkstra.prototype.refreshData = function () {
    this.q = [];
    this.minPathsToStart = {};
    let index = 0;
    this.maxQueSize = 0;
    const nodes = this.maze.nodes;
    for (const key in nodes) {
      if (nodes.hasOwnProperty(key)) {
        const nextNode = nodes[key];
        let dist = nextNode.isStart ? 0 : this.maxdist;
        let isDest = false;
        let distKnown = false;
        let currIndex = -1;
        let siblingKeys = [];
        let minPathNeighbor = 'unknown';
        if (typeof nextNode.siblings !== 'undefined') {
          if (nextNode.siblings != null) {
            siblingKeys = nextNode.siblings;
          }
        }
        if (nextNode.isStart) {
          this.startKey = nextNode.key;
          this.startNodeIndex = index;
          dist = 0;
          distKnown = true;
          currIndex = 0;
          minPathNeighbor = null;
        } else if (nextNode.isEnd) {
          this.destKey = nextNode.key;
          isDest = true;
        }
        this.q.push({
          key: nextNode.key,
          distFromStart: dist,
          isDest,
          distKnown,
          siblingKeys,
          currIndex,
          minPathNeighbor
        });
        index += 1;
      }
    }
    this.maxQueSize = index;
  };
  dijkstra.prototype.translateToPath = function (minpathData) {
    const nodeArray = [];
    let nextNode = minpathData[+this.destKey];
    while (typeof nextNode !== 'undefined') {
      nodeArray.push(nextNode.self);
      nextNode = minpathData[nextNode.from];
    }
    return nodeArray.reverse();
  };
  dijkstra.prototype.run = function () {
    if (!this.solveNeeded) {
      return this.solution;
    }
    this.refreshData();
    const nodes = this.maze.nodes;
    for (const key in nodes) {
      if (nodes.hasOwnProperty(key)) {
        nodes[key].isVisited = false;
      }
    }
    const solutionExists = this.runAlgorithm();
    if (solutionExists) {
      this.solution = this.translateToPath(this.minPathsToStart);
      this.solveNeeded = false;
      return this.solution;
    }
    return null;
  };
  dijkstra.prototype.getIndexWithKey = function (searchKey, collection) {
    for (let i = 0; i < collection.length; i++) {
      if (collection[i].key === searchKey) {
        return i;
      }
    }
    return -1;
  };
  dijkstra.prototype.runAlgorithm = function () {
    const start = this.q[this.startNodeIndex];
    const priorityQue = {};
    const paths = [];
    priorityQue[this.startKey] = {
      key: this.startKey,
      distFromStart: 0,
      isDest: false,
      distKnown: true,
      siblingKeys: start.siblingKeys,
      minPathNeighbor: null
    };
    let priorityNode = priorityQue[this.startKey];
    let destNodeFound = false;
    while (!priorityNode.isDest && paths.length < this.maxQueSize) {
      for (var i = 0; i < priorityNode.siblingKeys.length; i++) {
        const sibKey = priorityNode.siblingKeys[i];
        let sibling = priorityQue[sibKey];
        if (typeof sibling === 'undefined') {
          const sibIndexInQ = this.getIndexWithKey(priorityNode.siblingKeys[i], this.q);
          const ogSibling = this.q[sibIndexInQ];
          priorityQue[priorityNode.siblingKeys[i]] = {
            key: priorityNode.siblingKeys[i],
            distFromStart: priorityNode.distFromStart + 1,
            isDest: this.q[sibIndexInQ].isDest,
            distKnown: false,
            siblingKeys: this.q[sibIndexInQ].siblingKeys,
            minPathNeighbor: 'uknown'
          };
          if (ogSibling.isDest) {
            destNodeFound = true;
          }
          sibling = priorityQue[priorityNode.siblingKeys[i]];
        }
        if (sibling != null && sibling.key != this.startKey) {
          if (typeof sibling.distFromStart === 'undefined' || sibling.distFromStart == null) {
            priorityQue[priorityNode.siblingKeys[i]].distFromStart = priorityNode.distFromStart + 1;
          }
          if (
            sibling.distFromStart > priorityNode.distFromStart + 1
            || sibling.distFromStart == null
          ) {
            sibling.distFromStart = priorityNode.distFromStart + 1;
          }
        }
      }
      const lastPriorityNode = priorityNode;
      const isStart = priorityNode.key.toString() == this.startKey;
      priorityQue[lastPriorityNode.key] = null;
      let itemsInPriorityQue = 0;
      let min = this.maxdist;
      for (const key in priorityQue) {
        if (priorityQue.hasOwnProperty(key)) {
          itemsInPriorityQue += 1;
          if (priorityQue[key] != null) {
            if (priorityQue[key].distFromStart < min) {
              min = priorityQue[key].distFromStart;
              priorityNode = priorityQue[key];
            }
          }
        }
      }
      if (itemsInPriorityQue === 0) {
        return destNodeFound;
      }
      let fromKey = 'unknown';
      if (priorityNode.siblingKeys.indexOf(lastPriorityNode.key) > -1) {
        priorityNode.minPathNeighbor = lastPriorityNode.key;
        fromKey = lastPriorityNode.key;
      } else {
        priorityNode.minPathNeighbor = 'unknown';
        for (var i = paths.length - 1; i > -1; i--) {
          const pathItem = paths[i].self;
          if (priorityNode.siblingKeys.indexOf(pathItem) > -1) {
            fromKey = pathItem;
            priorityNode.minPathNeighbor = fromKey;
            break;
          }
        }
      }
      const nextMinPathObject = {
        start: isStart,
        self: priorityNode.key,
        from: fromKey
      };
      this.minPathsToStart[priorityNode.key] = nextMinPathObject;
      paths.push(nextMinPathObject);
    }
    return destNodeFound;
  };
  dijkstra.prototype.getSolutionData = function () {};
  return dijkstra;
}());
export { dijkstra };
