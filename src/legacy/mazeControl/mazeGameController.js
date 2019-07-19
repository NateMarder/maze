import userControlHandler from './userControlHandler';
import mazeGraph from '../mazeGraphComponents/mazeGraph';
import D from '../mazeUtilities/defaults';
import levelOne from '../mazeGenerators/levelOne';
import compressionHandler from '../mazeUtilities/compressionHandler';

/**
 * mazeGameController module
 * @fileOverview ToDo: Add file description
 * @module mazeGameController
 */

class mazeGameController {
  init() {
    this.spacing = D.getDefaultLineSpacing();
    if (window.location.href.indexOf('n=') > -1) {
      const cH = new compressionHandler();
      const bundle = cH.getMazeBundle();
      console.log(`here is the bundle: \n${JSON.stringify(bundle)}`);
      const maze = new mazeGraph(this.spacing, bundle, 0);
      const controlZone = new userControlHandler(maze);
    } else if (window.location.href.indexOf('l=') > -1) {
      const i = window.location.href.indexOf('=');
      const level = +(window.location.href.substr(i + 1));
      const maze = new mazeGraph(this.spacing, null, level);
      const mazeGenerator = new levelOne(maze).run();
      const cH = new compressionHandler(maze);
      const controlZone = new userControlHandler(maze);
    } else {
      const maze = new mazeGraph(this.spacing, null, 1);
      const mazeGenerator = new levelOne(maze).run();
      const cH = new compressionHandler(maze);
      const controlZone = new userControlHandler(maze);
    }
  }
}
export default mazeGameController;
