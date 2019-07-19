import mazeNode from './mazeNode';
import mazeWall from './mazeWall';
import mazePath from './mazePath';
import dijkstra from '../mazeSolvers/dijkstra';
import D from '../mazeUtilities/defaults';
import * as U from '../mazeUtilities/utilities';

/**
 * mazeGraph module
 * @fileOverview ToDo: Add file description
 * @module mazeGraph
 */
class mazeGraph {
  constructor(spacing, bundle, level) {
    this.nodes = {};
    this.paths = {};
    this.wallsInactive = {};
    this.wallsActive = {};
    this.solutionNodes = null;
    this.solutionPathTimeOut = null;
    this.container = document.getElementById('svg-container');
    this.currentLevel = level || 1;
    this.spacing = spacing || D.getDefaultLineSpacing();
    if (bundle == null) {
      this.scratchBuild();
    } else {
      this.bundleBuild(bundle);
    }
    this.mazeSolver = new dijkstra(this);
  }

  scratchBuild() {
    this.getMediaDimensions(false);
    this.createAndAppendSvgElement();
    this.setUpNodes();
    this.setUpPaths();
    this.setUpWalls();
  }

  bundleBuild(bundle) {
    this.bundle = bundle;
    this.getMediaDimensions(true);
    this.createAndAppendSvgElement();
    this.setUpNodes();
    this.setupPathsWithBundle(bundle);
    this.setUpWalls();
  }

  getMediaDimensions(bundle) {
    const mzHeight = (Math.round(window.innerHeight - this.spacing));
    let mzWidth = (Math.round(window.innerWidth));
    $('.content').height(mzHeight);
    mzWidth -= this.spacing;
    if (bundle) {
      this.cols = this.bundle.cols;
      this.rows = this.bundle.rows;
      this.currentLevel = this.bundle.level;
      this.hexString = this.bundle.hexstring;
      const rqrdColSpacing = Math.round(mzWidth / this.cols);
      const rqrdRowSpacing = Math.round(mzHeight / this.rows);
      this.spacing = rqrdColSpacing >= rqrdRowSpacing ? rqrdColSpacing : rqrdRowSpacing;
      if (this.spacing > D.getDefaultLineSpacing()) {
        this.spacing = D.getDefaultLineSpacing();
      }
      while (this.spacing % 10 !== 0) {
        this.spacing -= 1;
      }
    } else {
      this.cols = Math.floor(mzWidth / this.spacing) - 1;
      this.rows = Math.floor(mzHeight / this.spacing) - 1;
      this.cols = this.cols % 2 === 0 ? this.cols : this.cols - 1;
      this.rows = this.rows % 2 === 0 ? this.rows : this.rows - 1;
      this.currentLevel = this.currentLevel == null ? 1 : this.currentLevel;
    }
  }

  setupPathsWithBundle(bundle) {
    let nodeCounter = 0;
    const keys = Object.keys(this.nodes).sort();
    for (let i = 0; i < bundle.hexstring.length; i += 1) {
      const key1 = keys[nodeCounter];
      nodeCounter += 1;
      const key2 = keys[nodeCounter];
      nodeCounter += 1;
      const nextHex = bundle.hexstring.charAt(i).toString();
      const nodes = this.getDirectionsWithDoubleCompressedHex(nextHex, key1, key2);

      for (let j = 0; j < nodes[0].siblings.length; j += 1) {
        const nextSibKey = nodes[0].siblings[j];
        if (nextSibKey != null) {
          this.addPath(new mazePath(key1, nextSibKey));
        }
      }

      for (let j = 0; j < nodes[1].siblings.length; j += 1) {
        const nextSibKey = nodes[1].siblings[j];
        if (nextSibKey != null) {
          this.addPath(new mazePath(key2, nextSibKey));
        }
      }
    }
  }

  createAndAppendSvgElement() {
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    this.svg.setAttribute('width', (this.cols * this.spacing).toString());
    this.svg.setAttribute('height', (this.rows * this.spacing).toString());
    this.svg.setAttribute('id', 'mz-svg');
    this.container.append(this.svg);
  }

  setUpWalls() {
    let x1;
    let x2;
    let y1;
    let y2;
    for (let i = 1; i <= this.cols - 1; i += 1) {
      for (let j = 0; j < this.rows; j += 1) {
        x2 = i * this.spacing;
        x1 = x2;
        y1 = j * this.spacing;
        y2 = y1 + this.spacing;
        this.addWall(new mazeWall(x1, y1, x2, y2, 'mz-wall'));
      }
    }
    for (let i = 1; i <= this.rows - 1; i += 1) {
      for (let j = 0; j < this.cols; j += 1) {
        y2 = i * this.spacing;
        y1 = y2;
        x1 = j * this.spacing;
        x2 = x1 + this.spacing;
        this.addWall(new mazeWall(x1, y1, x2, y2, 'mz-wall'));
      }
    }
  }

  setUpNodes() {
    const offset = this.spacing / 2;
    for (let i = 0; i < this.cols; i += 1) {
      for (let j = 0; j < this.rows; j += 1) {
        const x = (i * this.spacing) + offset;
        const y = (j * this.spacing) + offset;
        this.nodes[`${x}.${y}`] = new mazeNode(x, y, this.spacing);
      }
    }
    const startNode = this.nodes[Object.keys(this.nodes)[0]];
    startNode.setAsStartNode();
    this.startKey = startNode.key;
    const endNode = this.nodes[Object.keys(this.nodes)[Object.keys(this.nodes).length - 1]];
    endNode.setAsEndNode(this);
  }

  setUpPaths() {
    let x1;
    let x2;
    let y1;
    let y2;
    const r = this.spacing;
    const r2 = Math.round(r / 2);
    for (let i = 0; i < this.cols; i += 1) {
      for (let j = 0; j < this.rows - 1; j += 1) {
        x2 = i * r;
        x1 = x2;
        y1 = j * r;
        y2 = y1 + r;
        x1 += r2;
        x2 += r2;
        y1 += r2;
        y2 += r2;
        this.addPath(new mazePath(`${x1}.${y1}`, `${x2}.${y2}`));
      }
    }
    for (let i = 0; i < this.rows; i += 1) {
      for (let j = 0; j < this.cols - 1; j += 1) {
        y2 = i * r;
        y1 = y2;
        x1 = j * r;
        x2 = x1 + r;
        x1 += r2;
        x2 += r2;
        y1 += r2;
        y2 += r2;
        this.addPath(new mazePath(`${x1}.${y1}`, `${x2}.${y2}`));
      }
    }
  }

  addPath(path) {
    this.paths[path.id] = path;
    const node1 = this.nodes[path.mazeNodes[0]];
    const node2 = this.nodes[path.mazeNodes[1]];
    if (node1 != null && node2 != null) {
      if (node1.siblings.indexOf(node2.key) < 0) {
        node1.siblings.push(node2.key);
      }
      if (node2.siblings.indexOf(node1.key) < 0) {
        node2.siblings.push(node1.key);
      }
      return true;
    }
    return false;
  }

  addWall(wall) {
    if (this.paths[wall.crossPath] != null) {
      this.wallsInactive[wall.id] = wall;
      this.svg.appendChild(wall.svg);
    } else {
      this.wallsActive[wall.id] = wall;
      this.svg.appendChild(wall.svg);
      $(wall.svg).addClass('wall-active');
    }
  }

  activateInactiveWall(item) {
    const w = this.wallsInactive[item.id];
    this.wallsInactive[item.id] = null;
    this.wallsActive[item.id] = new mazeWall(w.x1, w.y1, w.x2, w.y2, 'mz-wall wall-active');
    this.svg.appendChild(this.wallsActive[item.id].svg);
    this.removePathUsingWallKey(item.id);
  }

  deactivateWallUsingWallKey(key) {
    const locations = key.split('.');
    const x1 = +locations[0];
    const y1 = +locations[1];
    const x2 = +locations[2];
    const y2 = +locations[3];
    let wall = this.wallsActive[key];
    if (wall == null) {
      wall = this.wallsInactive[key];
    }
    if (wall != null) {
      this.svg.removeChild(wall.svg);
      this.wallsActive[key] = null;
      this.wallsInactive[key] = this.wallsActive[key];
    }
    const newWall = new mazeWall(x1, y1, x2, y2, 'mz-wall');
    this.wallsInactive[newWall.id] = newWall;
    this.addPath(newWall.path);
    this.svg.appendChild(newWall.svg);
  }

  activateAllWalls() {
    Object.keys(this.wallsInactive).forEach((wallKey) => {
      this.activateInactiveWall(this.wallsInactive[wallKey].element);
    });
  }

  removePathUsingWallKey(wallKey) {
    const pathKey = this.wallsActive[wallKey].crossPath;
    const _a = this.paths[pathKey].mazeNodes;
    const nodeKey1 = _a[0];
    const nodeKey2 = _a[1];
    let index = this.nodes[nodeKey1].siblings.indexOf(nodeKey2);
    if (index > -1) {
      this.nodes[nodeKey1].siblings.splice(index, 1);
    }
    index = this.nodes[nodeKey2].siblings.indexOf(nodeKey1);
    if (index > -1) {
      this.nodes[nodeKey2].siblings.splice(index, 1);
    }
    this.paths[pathKey] = null;
  }

  getDirectionsWithDoubleCompressedHex(hex, nodeKey1, nodeKey2) {
    const right = D.directions.Right;
    const down = D.directions.Down;
    const dirs = U.transformHexToDirection(hex);
    const node1 = this.nodes[nodeKey1];
    const node2 = this.nodes[nodeKey2];
    if (node1 == null || node2 == null) {
      console.log('null node error happened: getDirectionsWithDoubleCompressedHex');
      return null;
    }
    if (dirs[0] === '1') {
      node1.pathDirections.push(right);
    }
    if (dirs[1] === '1') {
      node1.pathDirections.push(down);
    }
    if (dirs[2] === '1') {
      node2.pathDirections.push(right);
    }
    if (dirs[3] === '1') {
      node2.pathDirections.push(down);
    }
    node1.transformDirectionsToSiblingKeys();
    node2.transformDirectionsToSiblingKeys();
    return [node1, node2];
  }
}
export default mazeGraph;
