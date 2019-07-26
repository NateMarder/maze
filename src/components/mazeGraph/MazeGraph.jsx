import React from 'react';
import _ from 'lodash';
import { mazeGraphDefaults as DEFAULTS } from '../../utilities';
import { MazeNodeFactory, UserNode } from './MazeNode/index';
import DestinationNode from './DestinationNode';
import { MazePathFactory } from './MazePath';
import { MazeWall, MazeWallFactory } from './MazeWall/index';
import { LevelOne } from '../../mazeRenderers/index';

export default class MazeGraph extends React.Component {
  constructor({ height, width }) {
    super({ height, width });
    this.state = {
      height,
      width,
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
      cols: Math.floor((props.width * 0.80) / DEFAULTS.desktopSpacing),
      rows: Math.floor((props.height * 0.80) / DEFAULTS.desktopSpacing),
      currentLevel: this.currentLevel || 1,
    }));

    this.setState(prevState => ({
      width: DEFAULTS.desktopSpacing * prevState.cols,
      height: DEFAULTS.desktopSpacing * prevState.rows,
    }));

    this.setState(prevState => ({
      nodes: new MazeNodeFactory().getNodes(prevState),
    }));

    this.setState((prevState) => {
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
      walls: new MazeWallFactory(prevState),
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
    clonedNodes.forEach((n) => {
      n.siblingKeys = []; // eslint-disable-line no-param-reassign
    });

    this.state.allPaths.forEach((mazePath) => {
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

  getUserControlNode = () => (
      <UserNode
        cx={Math.round(DEFAULTS.desktopSpacing / 2)}
        cy={Math.round(DEFAULTS.desktopSpacing / 2)}
        r={Math.round(DEFAULTS.desktopSpacing * 0.10)}
        map={this.state.nodes}
        destnodekey={`${this.state.destNodeX}.${this.state.destNodeY}`}
        offset={DEFAULTS.desktopSpacing}
        mzgraphref={this.mazeGraphRef}
        handleswipebindings={this.props.handleswipebindings}
      />
  );

  getInnerWalls = () => this.state.walls.map((wall) => {
    const { id, x1, y1, x2, y2 } = wall;
    return (<MazeWall key={id} id={id} x1={x1} y1={y1} x2={x2} y2={y2} className="mz-wall insidewall" />);
  });

  getOutterWalls = () => {
    const { height, width } = this.state;
    return <>
      <MazeWall x1={0} y1={0} x2={0} y2={height} className="outsidewall" />
      <MazeWall x1={0} y1={0} x2={width} y2={0} className="outsidewall" />
      <MazeWall x1={width} y1={0} x2={width} y2={height} className="outsidewall" />
      <MazeWall x1={0} y1={height} x2={width} y2={height} className="outsidewall" />
    </>;
  };

  render = () => (
      <div ref={this.mazeGraphRef}>
        <svg width={this.state.width} height={this.state.height} id="mz-svg">
          {this.getOutterWalls()}
          {this.getInnerWalls()}
          {this.getUserControlNode()}
          <DestinationNode
            x={this.state.destNodeX}
            y={this.state.destNodeY}
            r={Math.round(DEFAULTS.desktopSpacing * 0.10)}
          />
        </svg>
      </div>
  );
}
