import mazeGameController from './mazeGameController';

/**
 * appLaunch module
 * @fileOverview ToDo: Add file description
 * @module appLaunch
 */
class appLaunch {
  launch() { // eslint-disable-line class-methods-use-this
    const controller = new mazeGameController();
    controller.init();
  }
}

document.addEventListener('DOMContentLoaded', (event) => {
  const launchy = new appLaunch();
  launchy.launch();
});
