import React from 'react';
import Blinker from '../hooks/Blinker';

export default ({ x, y, r }) => (
  <Blinker speed={600}>
    <circle className="mz-node dest-node" cx={x} cy={y} r={r} />
  </Blinker>
);
