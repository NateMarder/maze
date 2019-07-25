import React from 'react';
import Blinker from '../hooks/Blinker';

/**
 * @description wraps other react components and provides creates a blinking
 * effect on its decendents. In the example below, the 'speed' property sets
 * the blink interval to every 1/4 second
 *
 * @example
 * <Blinker speed={250}>
 *  <SomeNewComponent />
 * </Blinker>
 */
const DestNode = ({ x, y, r }) => (
  <Blinker speed={600}>
    <circle
      className="mz-node dest-node"
      cx={x}
      cy={y}
      r={r}
    />
  </Blinker>
);

export default DestNode;
