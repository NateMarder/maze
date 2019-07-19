import * as D from './defaults';

class utilities {
  getHexFromDecimalString(input) {
    switch (input) {
      case 10: return 'a';
      case 11: return 'b';
      case 12: return 'c';
      case 13: return 'd';
      case 14: return 'e';
      case 15: return 'f';
      default: return input.toString();
    }
  }

  shuffle(array) {
    const buffer = array;
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      buffer[i] = array[j];
      buffer[j] = temp;
    }
    return buffer;
  }

  transformHexToDirection(input) {
    switch (input) {
      case '0': return ['0', '0', '0', '0'];
      case '1': return ['0', '0', '0', '1'];
      case '2': return ['0', '0', '1', '0'];
      case '3': return ['0', '0', '1', '1'];
      case '4': return ['0', '1', '0', '0'];
      case '5': return ['0', '1', '0', '1'];
      case '6': return ['0', '1', '1', '0'];
      case '7': return ['0', '1', '1', '1'];
      case '8': return ['1', '0', '0', '0'];
      case '9': return ['1', '0', '0', '1'];
      case 'a': return ['1', '0', '1', '0'];
      case 'b': return ['1', '0', '1', '1'];
      case 'c': return ['1', '1', '0', '0'];
      case 'd': return ['1', '1', '0', '1'];
      case 'e': return ['1', '1', '1', '0'];
      case 'f': return ['1', '1', '1', '1'];
      default: return ['-1', '-1', '-1', '-1'];
    }
  }

  getOrthogonalKey(x1, y1, x2, y2) {
    let wX1;
    let wY1;
    let wX2;
    let wY2;
    if (x1 === x2) {
      const high = y2 > y1 ? y2 : y1;
      const low = y2 !== high ? y2 : y1;
      const dX = Math.round((high - low) / 2);
      wY2 = high - dX;
      wY1 = wY2;
      wX1 = x1 - dX;
      wX2 = x1 + dX;
    } else {
      const high = x2 > x1 ? x2 : x1;
      const low = x2 !== high ? x2 : x1;
      const dX = Math.round((high - low) / 2);
      wX2 = high - dX;
      wX1 = wX2;
      wY1 = y1 - dX;
      wY2 = y1 + dX;
    }
    return `${wX1}.${wY1}.${wX2}.${wY2}`;
  }

  getVelocityFromLevel(level) {
    switch (level) {
      case 0: return D.levelSpeed().One;
      case 1: return D.levelSpeed().One;
      case 2: return D.levelSpeed().Two;
      case 3: return D.levelSpeed().Three;
      case 4: return D.levelSpeed().Four;
      case 5: return D.levelSpeed().Five;
      case 6: return D.levelSpeed().Six;
      case 7: return D.levelSpeed().Seven;
      case 8: return D.levelSpeed().Eight;
      case 9: return D.levelSpeed().Nine;
      case 10: return D.levelSpeed().Ten;
      default: return -1;
    }
  }

  toggleColors(count, level) {
    const _this = this;
    if (count === 0) {
      $('.level-defeated-msg').text(`You defeated level: ${level - 1}`);
      $('#mz-svg').hide();
      $('.control-zone').hide();
      $('#msg-container').css({
        height: '100%',
        display: 'block',
        padding: '75px 25px',
      });
      const windowHref = window.location.href;
      $('#msg-container').click(() => {
        document.location.href = `${windowHref.split('?')[0]}?l=${level}`;
      });
      window.setTimeout(() => {
        document.location.href = `${windowHref.split('?')[0]}?l=${level}`;
      }, 3000);
    } else {
      const newCount = count - 1;
      if (newCount > 0) {
        window.setTimeout(() => {
          $('.green, .magenta').toggleClass('green').toggleClass('magenta');
          _this.toggleColors(newCount, level);
        }, 100);
      } else {
        this.toggleColors(newCount, level);
      }
    }
  }

  handleMazeCompletion(count, level) {
    const newCount = count || 0;
    this.toggleColors(newCount, level);
  }

  setTimingMarks(mazeGraph) {
    mazeGraph.raceTime1 = performance.now(); // eslint-disable-line no-param-reassign
  }

  getRaceCompletionTime(mazeGraph) {
    if (mazeGraph.raceTime1 === null) {
      return -1;
    }
    mazeGraph.raceTime2 = performance.now(); // eslint-disable-line no-param-reassign
    const duration = mazeGraph.raceTime2 - mazeGraph.raceTime1;
    const secs = duration / 1000;
    const rounded = Math.round(secs * 100) / 100;
    return rounded;
  }

  showEnding(node, mazeGraph) {
    // alert(`that took: ${this.getRaceCompletionTime(mazeGraph)}`);
    node.fadeOutSafely();
    this.incrementLevel(mazeGraph);
    this.sendControlNodeHome(mazeGraph, true);
    const walls = $('.mz-wall.wall-active, .border-wall');
    walls.each((i) => {
      if (i % 2 === 0) {
        $(walls[i]).addClass('green');
      } else {
        $(walls[i]).addClass('magenta');
      }
    });
    this.handleMazeCompletion(15, mazeGraph.currentLevel);
  }

  goToYourHome(node) {
    node.svgJq.velocity({
      cx: node.home[0],
      cy: node.home[1],
    }, {
      duration: node.speed,
      easing: 'spring',
      complete() {
        node.coolDown = false; // eslint-disable-line no-param-reassign
        node.cx = node.home[0]; // eslint-disable-line prefer-destructuring, no-param-reassign
        node.cy = node.home[1]; // eslint-disable-line prefer-destructuring, no-param-reassign
        node.coolDown = false; // eslint-disable-line no-param-reassign
        node.svgJq
          .attr('cx', node.home[0])
          .attr('cy', node.home[1])
          .removeAttr('style');
        node.svgJq.velocity('stop');
      },
    });
  }

  sendControlNodeHome(maze, _stop) {
    const jqNode = maze.controlNode.svgJq;
    const cntrlNode = maze.controlNode;
    const cntrlNodeJqueryElement = $('circle.control-node');
    cntrlNodeJqueryElement.velocity({
      cx: cntrlNode.home[0],
      cy: cntrlNode.home[1],
    }, {
      duration: parseInt(D.goHomeSpeed, 10),
      easing: 'linear',
      complete() {
        cntrlNode.coolDown = false;
        cntrlNode.cx = cntrlNode.home[0]; // eslint-disable-line prefer-destructuring, no-param-reassign, max-len
        cntrlNode.cy = cntrlNode.home[1]; // eslint-disable-line prefer-destructuring, no-param-reassign, max-len
        cntrlNode.coolDown = false;
        jqNode
          .attr('cx', cntrlNode.home[0])
          .attr('cy', cntrlNode.home[1])
          .removeAttr('style');
        $('circle.control-node').velocity('stop');
      },
    });
  }

  incrementLevel(maze) {
    const urlArray = window.location.href.split('&');
    maze.currentLevel += 1; // eslint-disable-line no-param-reassign, max-len
    urlArray[3] = `l=${maze.currentLevel}`;
    history.pushState(null, null, `${urlArray[0]}&${urlArray[1]}&${urlArray[2]}&${urlArray[3]}`); // eslint-disable-line no-restricted-globals, max-len
    const newLevelDisplay = `Level :: ${maze.currentLevel}`;
    $('#currentLevel-display').text(newLevelDisplay);
  }
}

export default utilities;
const U = new utilities();
