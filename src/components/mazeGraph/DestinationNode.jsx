import React from 'react';
import Blinker from '../hooks/Blinker';

const DestinationNode = ({ x, y, r }) => <Blinker speed={600}>
  <circle
    className="mz-node dest-node"
    cx={x}
    cy={y}
    r={r}
  />
</Blinker>;

export default DestinationNode;
