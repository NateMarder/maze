import _ from 'lodash';
import MazePath from './MazePath';
import { getOrthogonalKey } from '../../../utilities';


const pathFactory = {
  useInactiveWalls: ({ excludeWalls }) => _.map(excludeWalls, (w) => {
    let [x1, y1, x2, y2] = w.split('.');
    [x1, y1, x2, y2] = getOrthogonalKey(+x1, +y1, +x2, +y2).split('.');
    return new MazePath(`${x1}.${y1}`, `${x2}.${y2}`);
  }),
};

export default pathFactory;
