/* eslint-disable no-loop-func */


export default class MZNode {
  constructor(initParams) {
    const {
      x, y, isStart, isDest, disoveredBy,
    } = initParams;

    this.key = `${+x}.${+y}`;
    this.isVisited = false;
    this.isDest = isDest;
    this.isStart = isStart;
    this.distFromStart = 0;
    this.discoveredBy = disoveredBy;
    this.siblingKeys = [];
  }
}
