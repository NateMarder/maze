import React from 'react';
import _ from 'lodash';
import { mazeGraphDefaults as DEFAULTS } from '../../../utilities';
import { MazeNodeFactory, UserNode } from './MZNode/index';
import DestNode from './MZNode/DestNode';
import { MazePathFactory } from './MazePath';
import { MZWall, MazeWallFactory } from './MZWall';
import { LevelOne } from '../../mazeRenderers/index';

export default class MZGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: this.props.height,
      width: this.props.width,
      spacing: DEFAULTS.desktopSpacing,
      cols: 0,
      rows: 0,
      nodes: null,
      allPaths: [],
      walls: [],
      excludeWalls: [],
      destNodeX: 0,
      destNodeY: 0,
    };
    this.mazeGraphRef = React.createRef();
  }

  componentDidMount = () => {
    this.setState((prevState, props) => ({
      cols: Math.floor((props.width * 0.80) / prevState.spacing),
      rows: Math.floor((props.height * 0.80) / prevState.spacing),
      currentLevel: this.currentLevel || 1,
    }));

    this.setState(prevState => ({
      width: prevState.spacing * prevState.cols,
      height: prevState.spacing * prevState.rows,
    }));

    this.setState(prevState => ({
      nodes: new MazeNodeFactory().getNodes(prevState),
    }));

    this.setState(prevState => {
      const mazeCreator = new LevelOne();
      const result = mazeCreator.run(prevState);
      const [x, y] = result.destNodeKey.split('.');
      return {
        excludeWalls: result.route,
        destNodeX: x,
        destNodeY: y,
      };
    });

    this.setState(prevState => ({
      walls: new MazeWallFactory().getWalls(prevState),
    }), () => {
      this.setState(prevState => ({
        allPaths: new MazePathFactory().getPathsWithInactiveWalls(prevState),
      }), () => {
        this.updateSiblingsUsingPaths();
      });
    });
  };

  updateSiblingsUsingPaths = () => {
    const clonedNodes = JSON.parse(JSON.stringify(this.state.nodes));
    clonedNodes.forEach(n => {
      n.siblingKeys = []; // eslint-disable-line no-param-reassign
    });

    this.state.allPaths.forEach(mazePath => {
      const [node1, node2] = mazePath.nodeKeys;
      const nodeRef1 = _.find(clonedNodes, n => n.key === node1);
      const nodeRef2 = _.find(clonedNodes, n => n.key === node2);

      if (nodeRef1 && nodeRef2) {
        nodeRef1.siblingKeys.push(nodeRef2.key);
        nodeRef2.siblingKeys.push(nodeRef1.key);
        nodeRef1.siblingKeys = _.uniq(nodeRef1.siblingKeys);
        nodeRef2.siblingKeys = _.uniq(nodeRef2.siblingKeys);
      }
    });

    this.setState((prevState, props) => ({
      nodes: clonedNodes,
    }));
  };

  getUserControlNode = () => {
    return (
      <UserNode
        cx={Math.round(DEFAULTS.desktopSpacing / 2)}
        cy={Math.round(DEFAULTS.desktopSpacing / 2)}
        r={Math.round(DEFAULTS.desktopSpacing * 0.10)}
        map={this.state.nodes}
        destnodekey={`${this.state.destNodeX}.${this.state.destNodeY}`}
        offset={DEFAULTS.desktopSpacing}
        mzgraphref={this.mazeGraphRef}
      />
    );
  };

  getInnerWalls = () => {
    return this.state.walls.map((wall) => {
      const { id, x1, y1, x2, y2 } = wall;
      return (<MZWall key={id} id={id} x1={x1} y1={y1} x2={x2} y2={y2} className="mz-wall insidewall" />);
    });
  };

  getOutterWalls = () => {
    return (
      <React.Fragment>
        <MZWall x1={0} y1={0} x2={0} y2={this.state.height} className="outsidewall" />
        <MZWall x1={0} y1={0} x2={this.state.width} y2={0} className="outsidewall" />
        <MZWall x1={this.state.width} y1={0} x2={this.state.width} y2={this.state.height} className="outsidewall" />
        <MZWall x1={0} y1={this.state.height} x2={this.state.width} y2={this.state.height} className="outsidewall" />
      </React.Fragment>
    );
  };

  render = () => {
    return (
      <div ref={this.mazeGraphRef}>
        <svg width={this.state.width} height={this.state.height} id="mz-svg">
          {this.getOutterWalls()}
          {this.getInnerWalls()}
          {this.getUserControlNode()}
          <DestNode x={this.state.destNodeX} y={this.state.destNodeY} r={Math.round(DEFAULTS.desktopSpacing * 0.10)} />
        </svg>
      </div>
    );
  };
}
