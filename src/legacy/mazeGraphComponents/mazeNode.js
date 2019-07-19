import * as D from '../mazeUtilities/defaults';

class mazeNode {
  constructor(x, y, spacing) {
    this.discoveredBy = '';
    this.siblings = [];
    this.isVertex = false;
    this.pathDirections = [];
    this.directionsGenerated = false;
    this.spacing = spacing !== null ? spacing : -1;
    this.cx = x;
    this.cy = y;
    this.r = Math.round(this.spacing * 0.15);
    this.isVisited = false;
    this.isStart = false;
    this.isEnd = false;
    this.key = `${x}.${y}`;
  }

  setAsStartNode() {
    this.isStart = true;
  }

  setAsEndNode(maze) {
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.svg.setAttribute('cx', this.cx.toString());
    this.svg.setAttribute('cy', this.cy.toString());
    this.svg.setAttribute('r', this.r.toString());
    this.svg.setAttribute('class', 'mz-node end-node');
    this.isEnd = true;
    maze.endKey = this.key; // eslint-disable-line no-param-reassign
    maze.svg.appendChild(this.svg);
  }

  transformSiblingKeysToDirections() {
    if (this.directionsGenerated) {
      return false;
    }
    for (let _i = 0, _a = this.siblings; _i < _a.length; _i += 1) {
      const sibKey = _a[_i];
      const split = sibKey.split('.');
      const sibX = parseInt(split[0], 10);
      const sibY = parseInt(split[1], 10);
      if (sibX !== this.cx) {
        if (sibX < this.cx) {
          this.pathDirections.push(D.directions.Left);
        } else {
          this.pathDirections.push(D.directions.Right);
        }
      } else if (sibY !== this.cy) {
        if (sibY < this.cy) {
          this.pathDirections.push(D.directions.Up);
        } else {
          this.pathDirections.push(D.directions.Down);
        }
      }
    }
    this.pathDirections = this.pathDirections.sort();
    this.directionsGenerated = true;
    return true;
  }

  transformDirectionsToSiblingKeys() {
    for (let i = 0; i < this.pathDirections.length; i += 1) {
      let sibX = this.cx;
      let sibY = this.cy;
      let sibKey = '';
      const nextDirection = this.pathDirections[i];
      switch (nextDirection) {
        case D.directions.Up:
          sibY -= this.spacing;
          break;
        case D.directions.Right:
          sibX += this.spacing;
          break;
        case D.directions.Down:
          sibY += this.spacing;
          break;
        case D.directions.Left:
          sibX -= this.spacing;
          break;
        default:
          break;
      }
      sibKey += `${sibX}.${sibY}`;
      this.siblings.push(sibKey);
    }
    return this;
  }
}

export default mazeNode;
