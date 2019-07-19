export default class MZNode {
  constructor({x, y, isStart, isDest, disoveredBy}) {
    this.key = `${+x}.${+y}`;
    this.isVisited = false;
    this.isDest = isDest;
    this.isStart = isStart;
    this.distFromStart = 0;
    this.discoveredBy = disoveredBy;
    this.siblingKeys = [];
  }
}
