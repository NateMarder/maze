import React from 'react';
import { filter, includes } from 'lodash';

export class MZWall extends React.Component {
  state = {
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
    css: '',
    length: 0,
    pathKey: ''
  };

  componentDidMount() {
    const { x1, y1, x2, y2, css } = this.props;
    const length = x1 === x2 ? Math.round(y2 - y1) : Math.round(x2 - x1);
    this.setState(() => ({
      x1,
      y1,
      x2,
      y2,
      css,
      length,
      pathKey: ''
    }));
    this.setState(() => ({
      pathKey: this.getPathKey()
    }));
  }

  getPathKey = () => {
    const d = Math.round(this.state.length / 2);
    const x2 = this.state.x1 + d;
    const y2 = this.state.y1 + d;
    if (this.state.x1 === this.state.x2) {
      const x1 = this.state.x1 - d;
      const y1 = this.state.y1 + d;
      return `${+x1}.${+y1}.${+x2}.${+y2}`;
    }
    const x1 = this.state.x1 + d;
    const y1 = this.state.y1 - d;
    return `${+x1}.${+y1}.${+x2}.${+y2}`;
  };

  render() {
    return (
      <line
        id={this.props.id}
        className="mz-wall"
        x1={this.props.x1}
        y1={this.props.y1}
        x2={this.props.x2}
        y2={this.props.y2}
      />
    );
  }
}

export class MazeWallFactory {
  getWalls = ({ rows, cols, spacing, excludeWalls }) => {
    const wallCache = [];
    let x1;
    let y1;
    let x2;
    let y2;
    for (let i = 1; i <= cols - 1; i += 1) {
      for (let j = 0; j < rows; j += 1) {
        x2 = i * spacing;
        x1 = x2;
        y1 = j * spacing;
        y2 = parseInt((y1 + spacing), 10);
        const id = `${x1}.${y1}.${x2}.${y2}`;
        wallCache.push({ id, x1, y1, x2, y2 });
      }
    }
    for (let i = 1; i <= rows - 1; i += 1) {
      for (let j = 0; j < cols; j += 1) {
        y2 = i * spacing;
        y1 = y2;
        x1 = j * spacing;
        x2 = parseInt((x1 + spacing), 10);
        const id = `${x1}.${y1}.${x2}.${y2}`;
        wallCache.push({ id, x1, y1, x2, y2 });
      }
    }
    return filter(wallCache, w => !includes(excludeWalls, w.id));
  };
}
