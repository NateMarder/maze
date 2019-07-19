import controlNode from '../mazeGraphComponents/controlNode';
import artificialIntelligenceNode from '../mazeGraphComponents/artificialIntelligenceNode';
import * as U from '../mazeUtilities/utilities';

/**
 * userControlHandler class
 * @fileOverview ToDo: Add file description
 * @class userControlHandler
 */
class userControlHandler {
  constructor(maze) {
    this.raceWithNode = true;
    this.maze = maze;
    this.setupControlZoneElements();
    this.addUserControlNode();
    this.addAiControlNode();
    this.setupControlZoneBindings();
  }

  setupControlZoneElements() {
    $('#racemode > i, #new-maze > i, #level-display ').css({
      'font-size': `${this.maze.spacing}px`,
    });
    $('#level-display').text(`Level ${this.maze.currentLevel}`);
  }

  setupControlZoneBindings() {
    const _this = this;
    $('#new-maze').click(() => {
      const currentUrl = window.location.href;
      document.location.href = currentUrl.split('?')[0]; // eslint-disable-line prefer-destructuring
    });
    $('.message-div').on({
      click() { _this.nextLevel(); },
      tap() { _this.nextLevel(); },
    });
    if (this.raceWithNode) {
      this.raceWithAiNodeBindings();
    }
  }

  nextLevel() {
    const url = window.location.href;
    document.location.href = `${url.split('?')[0]}?l=${this.maze.currentLevel}`;
  }

  addUserControlNode() {
    const radius = Math.round(this.maze.spacing * 0.15);
    const cx = +(this.maze.startKey.split('.')[0]);
    const cy = +(this.maze.startKey.split('.')[1]);
    this.controlNode = new controlNode({
      cx,
      cy,
      r: radius,
      offset: this.maze.spacing,
      options: null,
      ai: false,
      maze: this.maze,
    });
    this.maze.controlNode = this.controlNode;
  }

  addAiControlNode() {
    const radius = Math.round(this.maze.spacing * 0.15);
    const cx = +(this.maze.startKey.split('.')[0]);
    const cy = +(this.maze.startKey.split('.')[1]);
    this.aiNode = new artificialIntelligenceNode({
      cx,
      cy,
      r: radius,
      offset: this.maze.spacing,
      options: null,
      ai: true,
      maze: this.maze,
    });
    if (this.maze.solutionNodes == null) {
      this.maze.solutionNodes = this.maze.mazeSolver.run();
    }
    this.aiNode.setSolutionNodeKeys(this.maze.solutionNodes);
    this.maze.aiNode = this.aiNode;
    this.aiNode.svgJq.velocity({ opacity: 0 }, { duration: 0 });
  }

  raceWithAiNodeBindings() {
    const _this = this;
    $('#racemode').click(() => {
      if (+_this.aiNode.svgJq.css('opacity') === 0) {
        $('#level-display').addClass('blue');
        $('.fa-retweet, .racemode-label').addClass('magenta').removeClass('grey');
        _this.controlNode.coolDown = false;
        _this.aiNode.keepRacing = true;
        U.setTimingMarks(_this.maze);
        _this.aiNode.kickOffRace();
      } else {
        _this.aiNode.keepRacing = false;
        $('.fa-retweet, .racemode-label').addClass('grey').removeClass('magenta');
        $('#level-display').removeClass('blue');
        _this.aiNode.goHome(false);
      }
    });
  }
}

export default userControlHandler;
