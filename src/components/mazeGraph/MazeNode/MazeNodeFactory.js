import _ from 'lodash';
import MZNode from './MazeNode';

export default class MazeNodeFactory {
  buildNodeArray = ({ rows, cols, spacing }) => {
    const arrayOfNodes = [];
    const offset = spacing / 2;
    for (let i = 0; i < cols; i += 1) {
      for (let j = 0; j < rows; j += 1) {
        arrayOfNodes.push(
          new MZNode({
            x: i * spacing + offset,
            y: j * spacing + offset,
            isStart: i + j === 0,
            isDest: i === cols - 1 && j === rows - 1,
            discoveredBy: '',
          }),
        );
      }
    }
    return arrayOfNodes;
  };

  addSiblings = ({ rows, cols, spacing, nodeArray }) => {
    let x1;
    let x2;
    let y1;
    let y2;
    const r = spacing;
    const r2 = Math.round(r / 2);
    for (let i = 0; i < cols; i += 1) {
      for (let j = 0; j < rows - 1; j += 1) {
        const x = i * r + r2;
        y1 = j * r + r2;
        y2 = y1 + r;
        this.bindNodes([`${x}.${y1}`, `${x}.${y2}`], nodeArray);
      }
    }
    for (let i = 0; i < rows; i += 1) {
      for (let j = 0; j < cols - 1; j += 1) {
        const y = i * r + r2;
        x1 = j * r + r2;
        x2 = x1 + r;
        this.bindNodes([`${x1}.${y}`, `${x2}.${y}`], nodeArray);
      }
    }

    return nodeArray;
  };

  bindNodes = ([key1, key2], nodeArray) => {
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
      nodeArray,
    });
  }
}
