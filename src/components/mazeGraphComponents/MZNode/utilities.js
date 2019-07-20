export const DIRECTIONS = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3,
};

export const getNewCoordinates = (direction, x, y, offSet) => {
  console.log('getting coordinates with: ');
  console.log({ direction, x, y, offSet });

  const newPoint = { x, y }; // make a quick clone

  switch (direction) {
    case 3:
      newPoint.x -= offSet;
      break;
    case 1:
      newPoint.x += offSet;
      break;
    case 0:
      newPoint.y -= offSet;
      break;
    case 2:
      newPoint.y += offSet;
      break;
    default:
      break;
  }

  return newPoint;
};
