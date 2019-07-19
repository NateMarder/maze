import React from 'react';

const DestNode = props => <circle
  className="mz-node dest-node"
  cx={props.x}
  cy={props.y}
  r={props.r} 
/>

export default DestNode;