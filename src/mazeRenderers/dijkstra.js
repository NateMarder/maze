/* eslint-disable react/no-this-in-sfc */
/* eslint-disable no-loop-func */
import _ from 'lodash';

export default class Dijkstra {
  constructor(nodes) {
    this.originalNodes = nodes;
    this.startKey = _.find(nodes, node => node.isStart).toString();
    this.solveNeeded = true;
    this.destKey = _.find(nodes, node => node.isDest).toString();
    this.minPathsToStart = {};
    this.maxQueSize = 9999;
    this.q = [];
    this.nodeArray = [];
    this.maxdist = 99999;
  }

  prepareDataSetFromOgData = () => {
    this.nodeArray = [];
    this.q = [];
    this.minPathsToStart = {};

    this.originalNodes.forEach((node, i) => {
      const clone = _.clone(node, true);
      clone.siblingKeys = _.clone(node.siblingKeys, true);
      if (node.isStart) {
        this.startKey = node.key;
        this.startNodeIndex = i;
      }
      if (node.isDest) {
        this.destKey = node.key;
      }
      this.nodeArray.push(clone);
    });
  };

  refreshData = () => {
    this.prepareDataSetFromOgData();
    this.nodeArray.forEach((node) => {
      this.q.push({
        isVisited: false,
        key: node.key,
        distFromStart: node.isStart ? 0 : this.maxdist,
        isDest: node.isDest,
        distKnown: node.isStart,
        siblingKeys: node.siblingKeys,
        currIndex: node.isStart ? 0 : -1,
        minPathNeighbor: node.isStart ? null : 'uknown',
      });
    });
  };

  translateToPath = (minpathData) => {
    const nodeArray = [];
    let nextNode = minpathData[+this.destKey];
    while (typeof nextNode !== 'undefined') {
      nodeArray.push(nextNode.self);
      nextNode = minpathData[nextNode.from];
    }
    return nodeArray.reverse();
  };

  getIndexWithKey = (searchKey, collection) => {
    for (let i = 0; i < collection.length; i += 1) {
      if (collection[i].key === searchKey) {
        return i;
      }
    }
    return -1;
  };

  run = () => {
    if (!this.solveNeeded) {
      return this.solution;
    }

    this.refreshData();
    const solutionExists = this.runAlgorithm();
    if (solutionExists) {
      this.solution = this.translateToPath(this.minPathsToStart);
      this.solveNeeded = false;
      return this.solution;
    }
    return null;
  };

  runAlgorithm = () => {
    const start = this.q[this.startNodeIndex];
    const priorityQue = {};
    const paths = [];
    priorityQue[this.startKey] = {
      key: this.startKey,
      distFromStart: 0,
      isDest: false,
      distKnown: true,
      siblingKeys: start.siblingKeys,
      minPathNeighbor: null,
    };
    let priorityNode = priorityQue[this.startKey];
    let destNodeFound = false;

    while (!destNodeFound && paths.length < 999) {
      priorityNode.siblingKeys.forEach((key, i) => {
        const sibling = priorityQue[key];
        if (priorityQue[key]) {
          const sibIndexInQ = this.getIndexWithKey(priorityNode.siblingKeys[i], this.q);
          const ogSibling = this.q[sibIndexInQ];
          priorityQue[key] = {
            key,
            distFromStart: priorityNode.distFromStart + 1,
            isDest: ogSibling.isDest,
            distKnown: false,
            siblingKeys: _.clone(ogSibling.siblingKeys),
            minPathNeighbor: 'uknown',
          };
          destNodeFound = ogSibling.isDest;
        }

        // if we have a sibling that is not the start node...
        if (sibling && !sibling.isStart && !sibling.distFromStart) {
          sibling.distFromStart = priorityNode.distFromStart + 1;
          if ((sibling.distFromStart > priorityNode.distFromStart + 1) || !sibling.distFromStart) {
            sibling.distFromStart = priorityNode.distFromStart + 1;
          }
        }
      });

      const lastPriorityNode = priorityNode;
      const isStart = priorityNode.key === this.startKey;
      priorityQue[lastPriorityNode.key] = null;
      let itemsInPriorityQue = 0;

      _.keys(priorityQue).forEach((k) => {
        console.log(`priorityQue forEach k: ${k}`);
        itemsInPriorityQue += 1;
        if (priorityQue[k] && priorityQue[k].distFromStart < 9999) {
          priorityNode = priorityQue[k];
        }
      });

      // nothing more to explore
      if (itemsInPriorityQue === 0) {
        return destNodeFound;
      }
      let fromKey = 'unknown';

      // console.log(lastPriorityNode.key);
      if (priorityNode.siblingKeys.indexOf(lastPriorityNode.key) > -1) {
        priorityNode.minPathNeighbor = lastPriorityNode.key;
        fromKey = lastPriorityNode.key;
      } else {
        priorityNode.minPathNeighbor = 'unknown';
        for (let i = paths.length - 1; i > -1; i -= 1) {
          const pathItem = paths[i].self;
          if (priorityNode.siblingKeys.indexOf(pathItem) > -1) {
            fromKey = pathItem;
            priorityNode.minPathNeighbor = fromKey;
            break;
          }
        }
      }

      // console.log(fromKey);
      // console.log(lastPriorityNode.key);

      const nextMinPathObject = {
        start: isStart,
        self: priorityNode.key,
        from: isStart ? null : fromKey,
      };
      this.minPathsToStart[priorityNode.key] = nextMinPathObject;
      paths.push(nextMinPathObject);
    }
    return destNodeFound;
  };

  runAlgorithm2 = () => {
    const start = this.q[this.startNodeIndex];
    const priorityQue = {};
    const paths = [];
    priorityQue[this.startKey] = {
      key: this.startKey,
      distFromStart: 0,
      isDest: false,
      distKnown: true,
      siblingKeys: start.siblingKeys,
      minPathNeighbor: null,
    };
    let priorityNode = priorityQue[this.startKey];
    let destNodeFound = false;
    while (!priorityNode.isDest && paths.length < this.maxQueSize) {
      for (let i = 0; i < priorityNode.siblingKeys.length; i += 1) {
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
            minPathNeighbor: 'uknown',
          };
          if (ogSibling.isDest) {
            destNodeFound = true;
          }
          sibling = priorityQue[priorityNode.siblingKeys[i]];
        }
        if (sibling !== null && sibling.key !== this.startKey) {
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
      const isStart = priorityNode.key === this.startKey;
      priorityQue[lastPriorityNode.key] = null;
      let itemsInPriorityQue = 0;

      _.keys(priorityQue).forEach((key) => {
        itemsInPriorityQue += 1;
        if (priorityQue[key] && priorityQue[key].distFromStart < this.maxdist) {
          priorityNode = priorityQue[key];
        }
      });

      if (itemsInPriorityQue === 0) {
        return destNodeFound;
      }
      let fromKey = 'unknown';
      if (priorityNode.siblingKeys.indexOf(lastPriorityNode.key) > -1) {
        priorityNode.minPathNeighbor = lastPriorityNode.key;
        fromKey = lastPriorityNode.key;
      } else {
        priorityNode.minPathNeighbor = 'unknown';
        for (let i = paths.length - 1; i > -1; i -= 1) {
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
        from: fromKey,
      };
      this.minPathsToStart[priorityNode.key] = nextMinPathObject;
      paths.push(nextMinPathObject);
    }
    return destNodeFound;
  };
}
