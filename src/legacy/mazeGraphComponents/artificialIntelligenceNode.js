import * as D from '../mazeUtilities/defaults';
import * as U from '../mazeUtilities/utilities';
import * as controlNode from './controlNode';

/**
 * artificialIntelligenceNode class
 * @fileOverview ToDo: Add file description
 * @class artificialIntelligenceNode
 */

class artificialIntelligenceNode extends controlNode {
  constructor(initParams) {
    super(initParams);
    this.keepRacing = true;
    this.aiNodeSpeeds = [140, 120, 100, 95, 90, 85, 75, 65, 55, 45];
    const levelMinusOne = this.mazeGraph.currentLevel + 1;
    this.speed = this.aiNodeSpeeds[levelMinusOne];
    this.setUpSvg();
  }

  setSolutionNodeKeys(keys) {
    this.solutionNodeKeys = keys;
  }

  animateTowardsDestinationNode(positionNodes) {
    const _this = this;
    if (!this.keepRacing) {
      return true;
    }
    const nodeKey = positionNodes.shift().split('.');
    const xPos = +nodeKey[0];
    const yPos = +nodeKey[1];
    this.svgJq.velocity({
      cx: xPos,
      cy: yPos,
    }, {
      queue: false,
      duration: this.speed,
      easing: 'linear',
      complete() {
        _this.coolDown = false;
        _this.cx = xPos;
        _this.cy = yPos;
        _this.svg.setAttribute('cx', String(_this.cx));
        _this.svg.setAttribute('cy', String(_this.cy));
        if (positionNodes[0] === _this.mazeGraph.endKey) {
          U.sendControlNodeHome(_this.mazeGraph, true);
          _this.goHome(true);
          return true;
        }
        if (_this.keepRacing) {
          return _this.animateTowardsDestinationNode(positionNodes);
        }

        return true;
      },
    });
    return true;
  }

  kickOffRace() {
    const _this = this;
    let nodeArray = [];
    nodeArray = this.mazeGraph.solutionNodes.slice();
    if (this.keepRacing) {
      U.sendControlNodeHome(this.mazeGraph, true);
      setTimeout(() => {
        _this.svgJq.velocity({
          opacity: 1,
        }, {
          duration: D.goHomeSpeed,
          complete() {
            _this.animateTowardsDestinationNode(nodeArray);
          },
        });
      }, D.goHomeSpeed);
    }
  }

  setUpSvg() {
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.svg.setAttribute('cx', this.cx.toString());
    this.svg.setAttribute('cy', this.cy.toString());
    this.svg.setAttribute('r', this.r.toString());
    this.svg.setAttribute('class', 'mz-node ai-node');
    this.svg.setAttribute('id', 'ainode');
    this.mazeGraph.svg.appendChild(this.svg);
    this.svgJq = $('circle.ai-node');
  }

  fadeOutSafely() {
    this.svgJq.velocity({ opacity: 0 }, { duration: 0 });
  }

  goHome(beginNewRace) {
    const _this = this;
    this.svgJq.velocity('stop').velocity({
      cx: this.home[0],
      cy: this.home[1],
    }, {
      duration: D.goHomeSpeed,
      easing: 'linear',
      complete() {
        const _a = _this.home;
        _this.cx = _a[0]; // eslint-disable-line prefer-destructuring
        _this.cy = _a[1]; // eslint-disable-line prefer-destructuring
        _this.svg.setAttribute('cx', String(_this.home[0]));
        _this.svg.setAttribute('cy', String(_this.home[1]));
        if (beginNewRace && _this.keepRacing) {
          U.sendControlNodeHome(_this.mazeGraph, true);
          _this.kickOffRace();
          return true;
        }

        _this.svgJq.velocity({ opacity: 0 }, { duration: D.goHomeSpeed });
        return true;
      },
    });
    return true;
  }
}

export default artificialIntelligenceNode;
