import _ from 'lodash';
import { getOrthogonalKey } from '../../utilities';

export class MazePath {
  constructor(nodeKey1, nodeKey2) {
    this.nodeKeys = [nodeKey1, nodeKey2];
    this.id = `${nodeKey1}.${nodeKey2}`;
    this.key = this.id;
    const [x1, y1, x2, y2] = this.id.split('.').map(el => parseInt(el, 10));
    this.crossWall = getOrthogonalKey(x1, y1, x2, y2);
  }
}

export class MazePathFactory {
  getPathsWithRowsAndCols = ({ spacing: r, rows, cols }) => {
    let x1;
    let x2;
    let y1;
    let y2;
    const r2 = Math.round(r / 2);
    const pathCache = [];

    for (let i = 0; i < cols; i += 1) {
      for (let j = 0; j < rows - 1; j += 1) {
        x1 = x2 = i * r;
        y1 = y2 = j * r;
        x1 += x2 += y1 += y2 += r2;
        pathCache.push(new MazePath(`${x1}.${y1}`, `${x2}.${y2}`));
      }
    }

    for (let i = 0; i < rows; i += 1) {
      for (let j = 0; j < cols - 1; j += 1) {
        x1 = j * r;
        y1 = y2 = i * r;
        x2 = j * r + r;
        x1 += x2 += x2 += y1 += y2 += r2;
        pathCache.push(new MazePath(`${x1}.${y1}`, `${x2}.${y2}`));
      }
    }

    return pathCache;
  };

  // eslint-disable-next-line arrow-body-style
  getPathsWithInactiveWalls = ({ excludeWalls }) => {
    return _.map(excludeWalls, (w) => {
      let [x1, y1, x2, y2] = w.split('.');
      [x1, y1, x2, y2] = getOrthogonalKey(+x1, +y1, +x2, +y2).split('.');
      return new MazePath(`${x1}.${y1}`, `${x2}.${y2}`);
    });
  };
}
