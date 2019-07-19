/* eslint-disable no-underscore-dangle */
import { defaults as D } from '../mazeUtilities/utilities';

/**
 * controlNode module
 * @fileOverview ToDo: Add file description
 * @module controlNode
 */
class controlNode {
  constructor(initParams) {
    this.home = [];
    this.speed = 40;
    this.coolDown = false;
    this.mazeHeight = 0;
    this.mazeWidth = 0;
    this.cx = initParams.cx;
    this.cy = initParams.cy;
    this.r = initParams.r;
    this.mazeGraph = initParams.maze;
    this.home[0] = this.cx;
    this.home[1] = this.cy;
    this.offSet = initParams.offset;
    this.mazeHeight = +this.mazeGraph.svg.attributes.height.value;
    this.mazeWidth = +this.mazeGraph.svg.attributes.width.value;
    if (!initParams.ai) {
      this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      this.svg.setAttribute('cx', this.cx.toString());
      this.svg.setAttribute('cy', this.cy.toString());
      this.svg.setAttribute('r', this.r.toString());
      this.svg.setAttribute('class', 'mz-node control-node');
      this.svg.setAttribute('id', 'controlnode');
      this.mazeGraph.svg.appendChild(this.svg);
      this.svgJq = $('circle.control-node');
      this.handleBindings();
    }
  }

  move(direction) {
    const _this = this;
    const newPos = this.getNewCoordinates(direction);
    if (!this.checkMove(newPos.x, newPos.y, direction)) return false;
    this.svgJq.velocity(
      {
        cx: newPos.x,
        cy: newPos.y
      },
      {
        duration: this.speed,
        easing: 'linear',
        complete() {
          _this.coolDown = false;
          _this.cx = newPos.x;
          _this.cy = newPos.y;
          _this.svg.setAttribute('cx', String(newPos.x));
          _this.svg.setAttribute('cy', String(newPos.y));
          const key = `${newPos.x}.${newPos.y}`;
          if (key === _this.mazeGraph.endKey && $('span.racemode-label').hasClass('magenta')) {
            _this.mazeGraph.aiNode.keepRacing = false;
            U.showEnding(_this.mazeGraph.aiNode, _this.mazeGraph);
            return true;
          }
          if (_this.mazeGraph.nodes[key].siblings.length < 3) {
            const goingToDirection = _this.nextDirection(direction, key);
            return _this.move(goingToDirection);
          }
          return true;
        }
      }
    );
    return false;
  }

  getNewCoordinates(direction) {
    const point = {
      x: this.cx,
      y: this.cy
    };
    switch (direction) {
      case D.directions.Left:
        point.x = this.cx - this.offSet;
        break;
      case D.directions.Right:
        point.x = this.cx + this.offSet;
        break;
      case D.directions.Up:
        point.y = this.cy - this.offSet;
        break;
      case D.directions.Down:
        point.y = this.cy + this.offSet;
        break;
      default:
        break;
    }
    return point;
  }

  checkMove(newXPos, newYPos, direction) {
    if (this.coolDown) {
      return false;
    }
    const currNode = this.mazeGraph.nodes[`${this.cx}.${this.cy}`];
    const siblingAhead = currNode.siblings.indexOf(`${String(newXPos)}.${String(newYPos)}`) > -1;
    if (!siblingAhead) return false;
    switch (direction) {
      case D.directions.Left:
        if (this.cx <= this.offSet) return false;
        break;
      case D.directions.Right:
        if (this.cx + this.offSet > $(this.mazeGraph.svg).width()) return false;
        break;
      case D.directions.Up:
        if (this.cy <= this.offSet) return false;
        break;
      case D.directions.Down:
        if (this.cy + this.offSet > $(this.mazeGraph.svg).height()) return false;
        break;
    }
    return (this.coolDown = true);
  }

  handleBindings() {
    const _this = this;
    $(document.body).keydown((e) => {
      switch (e.which) {
        case 38:
          _this.move(D.directions.Up);
          break;
        case 40:
          _this.move(D.directions.Down);
          break;
        case 37:
          _this.move(D.directions.Left);
          break;
        case 39:
          _this.move(D.directions.Right);
          break;
        case 87:
          _this.move(D.directions.Up);
          break;
        case 83:
          _this.move(D.directions.Down);
          break;
        case 65:
          _this.move(D.directions.Left);
          break;
        case 68:
          _this.move(D.directions.Right);
          break;
        case 78:
          $('#new-maze').trigger('click');
          break;
        case 82:
          $('#racemode').trigger('click');
          break;
        default:
          break;
      }
    });
    $('.mz-container').on({
      swipeleft() {
        _this.move(D.directions.Left);
      },
      swiperight() {
        _this.move(D.directions.Right);
      },
      swipeup() {
        _this.move(D.directions.Up);
      },
      swipedown() {
        _this.move(D.directions.Down);
      },
      ontouchstart(e) {
        e.preventDefault();
      },
      ontouchmove(e) {
        e.preventDefault();
      }
    });
    return this.mazeGraph;
  }

  nextDirection(oldDirection, key) {
    const oldX = this.cx;
    const oldY = this.cy;
    for (let _i = 0, _a = this.mazeGraph.nodes[key].siblings; _i < _a.length; _i++) {
      const siblingId = _a[_i];
      const split = siblingId.split('.');
      const newX = +split[0];
      const newY = +split[1];
      switch (oldDirection) {
        case D.directions.Up:
          if (newY <= oldY) {
            if (newY < oldY) return D.directions.Up;
            if (newX < oldX) return D.directions.Left;
            if (newX > oldX) return D.directions.Right;
          }
          break;
        case D.directions.Right:
          if (newX >= oldX) {
            if (newY < oldY) return D.directions.Up;
            if (newY > oldY) return D.directions.Down;
            if (newX > oldX) return D.directions.Right;
          }
          break;
        case D.directions.Down:
          if (newY >= oldY) {
            if (newY > oldY) return D.directions.Down;
            if (newX < oldX) return D.directions.Left;
            if (newX > oldX) return D.directions.Right;
          }
          break;
        case D.directions.Left:
          if (newX <= oldX) {
            if (newX < oldX) return D.directions.Left;
            if (newY < oldY) return D.directions.Up;
            if (newY > oldY) return D.directions.Down;
          }
          break;
        default:
          break;
      }
    }
  }
}
