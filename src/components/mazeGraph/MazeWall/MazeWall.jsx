import React from 'react';
import { filter, includes } from 'lodash';

export const MazeWall = ({ id, x1, y1, x2, y2 }) => <line id={id} className="mz-wall" x1={x1} y1={y1} x2={x2} y2={y2} />;

export const MazeWallFactory = ({ rows, cols, spacing, excludeWalls }) => {
  const buffer = [];
  let x1;
  let y1;
  let x2;
  let y2;
  for (let i = 1; i <= cols - 1; i += 1) {
    for (let j = 0; j < rows; j += 1) {
      x1 = x2 = i * spacing;
      y1 = j * spacing;
      y2 = y1 + spacing;
      buffer.push({ id: `${x1}.${y1}.${x2}.${y2}`, x1, y1, x2, y2 });
    }
  }
  for (let i = 1; i <= rows - 1; i += 1) {
    for (let j = 0; j < cols; j += 1) {
      y1 = y2 = i * spacing;
      x1 = j * spacing;
      x2 = x1 + spacing;
      buffer.push({ id: `${x1}.${y1}.${x2}.${y2}`, x1, y1, x2, y2 });
    }
  }
  return filter(buffer, w => !includes(excludeWalls, w.id));
};
