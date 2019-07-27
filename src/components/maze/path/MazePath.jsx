import { getOrthogonalKey } from '../../../utilities';

export default class MazePath {
  constructor(nodeKey1, nodeKey2) {
    this.nodeKeys = [nodeKey1, nodeKey2];
    this.id = `${nodeKey1}.${nodeKey2}`;
    this.key = this.id;
    const [x1, y1, x2, y2] = this.id.split('.').map(el => parseInt(el, 10));
    this.crossWall = getOrthogonalKey(x1, y1, x2, y2);
  }
}
