import _ from 'lodash';
import MZNode from './MZNode';

export default class MazeNodeFactory {
  buildNodeArray = ({ rows, cols, spacing }) => {
    const arrayOfNodes = [];
    const offset = spacing / 2;
    for (let i = 0; i < cols; i += 1) {
      for (let j = 0; j < rows; j += 1) {
        const x = i * spacing + offset;
        const y = j * spacing + offset;
        const isStart = i + j === 0;
        const isDest = i === cols - 1 && j === rows - 1;
        const discoveredBy = '';
        arrayOfNodes.push(
          new MZNode({
            x,
            y,
            isStart,
            isDest,
            discoveredBy
          })
        );
      }
    }
    return arrayOfNodes;
  };

  removeAllSiblings = nodes => {
    nodes.forEach(val => {
      // eslint-disable-next-line no-param-reassign
      val.siblingKeys = null;
    });
  };

  addSiblings = params => {
    const { rows, cols, spacing, nodeArray } = params;

    let x1;
    let x2;
    let y1;
    let y2;
    const r = spacing;
    const r2 = Math.round(r / 2);
    for (let i = 0; i < cols; i += 1) {
      for (let j = 0; j < rows - 1; j += 1) {
        x2 = i * r;
        x1 = x2;
        y1 = j * r;
        y2 = y1 + r;
        x1 += r2;
        x2 += r2;
        y1 += r2;
        y2 += r2;
        this.bindNodes([`${x1}.${y1}`, `${x2}.${y2}`], nodeArray);
      }
    }
    for (let i = 0; i < rows; i += 1) {
      for (let j = 0; j < cols - 1; j += 1) {
        y2 = i * r;
        y1 = y2;
        x1 = j * r;
        x2 = x1 + r;
        x1 += r2;
        x2 += r2;
        y1 += r2;
        y2 += r2;
        this.bindNodes([`${x1}.${y1}`, `${x2}.${y2}`], nodeArray);
      }
    }

    return nodeArray;
  };

  bindNodes = (nodeKeys, nodeArray) => {
    const [key1, key2] = nodeKeys;
    const nodeRef1 = _.find(nodeArray, n => n.key === key1);
    const nodeRef2 = _.find(nodeArray, n => n.key === key2);

    nodeRef1.siblingKeys.push(nodeRef2.key);
    nodeRef2.siblingKeys.push(nodeRef1.key);
    nodeRef1.siblingKeys = _.uniq(nodeRef1.siblingKeys);
    nodeRef2.siblingKeys = _.uniq(nodeRef2.siblingKeys);
  };

  getNodes({ rows, cols, spacing }) {
    const nodeArray = this.buildNodeArray({ rows, cols, spacing });
    return this.addSiblings({
      rows,
      cols,
      spacing,
      nodeArray
    });
  }
}
