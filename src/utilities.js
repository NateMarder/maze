export const getScreenDimensions = () => ({
  height: window.innerHeight,
  width: window.innerWidth,
});

export const mazeGraphDefaults = {
  desktopSpacing: 60,
  mobileSpacing: 50,
};

const validateInputsForOrthogonalKey = (x1, y1, x2, y2) => {
  if (typeof x1 !== 'number') {
    throw new Error(`improper parameter ${x1} passed to getOrthogonalKey function`);
  } else if (typeof y1 !== 'number') {
    throw new Error(`improper parameter ${y1} passed to getOrthogonalKey function`);
  } else if (typeof x2 !== 'number') {
    throw new Error(`improper parameter ${x2} passed to getOrthogonalKey function`);
  } else if (typeof y2 !== 'number') {
    throw new Error(`improper parameter ${y2} passed to getOrthogonalKey function`);
  }
};

let coolDown = false;

export const getOrthogonalKey = (x1, y1, x2, y2) => {
  validateInputsForOrthogonalKey(x1, y1, x2, y2);

  let high;
  let low;
  let dX;
  let wY2;
  let wY1;
  let wX1;
  let wX2;

  // for horizontal situations
  if (x1 === x2) {
    high = y2 > y1 ? y2 : y1;
    low = y2 !== high ? y2 : y1;
    dX = ((high - low) / 2);
    wY2 = high - dX;
    wY1 = wY2;
    wX1 = x1 - dX;
    wX2 = x1 + dX;
  } else {
    // for vertical situations
    high = x2 > x1 ? x2 : x1;
    low = x2 !== high ? x2 : x1;
    dX = ((high - low) / 2);
    wX2 = high - dX;
    wX1 = wX2;
    wY1 = y1 - dX;
    wY2 = y1 + dX;
  }

  return `${wX1.toString()}.${wY1.toString()}.${wX2.toString()}.${wY2.toString()}`;
};

export const getOrthogonalKeyForMazeRendering = (x1, y1, x2, y2) => {
  // validateInputsForOrthogonalKey(x1, y1, x2, y2);

  let high;
  let low;
  let dX;
  let wY2;
  let wY1;
  let wX1;
  let wX2;

  // for horizontal situations
  if (x1 === x2) {
    high = y2 > y1 ? y2 : y1;
    low = y2 !== high ? y2 : y1;
    dX = ((high - low) / 2);
    wY2 = high - dX;
    wY1 = wY2;
    wX1 = x1 - dX;
    wX2 = x1 + dX;
  } else {
    // for vertical situations
    high = x2 > x1 ? x2 : x1;
    low = x2 !== high ? x2 : x1;
    dX = ((high - low) / 2);
    wX2 = high - dX;
    wX1 = wX2;
    wY1 = y1 - dX;
    wY2 = y1 + dX;
  }


  const returnString = `${wX1.toString()}.${wY1.toString()}.${wX2.toString()}.${wY2.toString()}`;

  if (!coolDown) {
    console.log(`orientation: ${(x1 === x2) ? 'horizontal' : 'vertical'}`);
    console.log(`                high: ${high}`);
    console.log(`                 low: ${low}`);
    console.log(`                  dX: ${dX}`);
    console.log(`      x1, y1, x2, y2: ${x1}, ${y1}, ${x2}, ${y2}`);
    console.log(`  wX1, wY1, wX2, wY2: ${wX1}, ${wY1}, ${wX2}, ${wY2}`);
    console.log(` val of returnString: ${returnString}`);
    coolDown = true;
  }

  return returnString;
};

export const shuffle = (array) => {
  const buffer = array;
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    buffer[i] = array[j];
    buffer[j] = temp;
  }
  return buffer;
};

export const DEVICETYPES = {
  MOBILE: 0,
  DESKTOP: 1,
  TABLET: 2,
};

export const KEYCODEMAP = {
  UP: 38,
  DOWN: 40,
  RIGHT: 39,
  LEFT: 37,
};

export const KeyEventKeyValues = {
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  RIGHT: 'ArrowRight',
  LEFT: 'ArrowLeft',
};

export const KeyEventKeyValuesIEEdge = {
  UP: 'Up',
  DOWN: 'Down',
  RIGHT: 'Right',
  LEFT: 'Left',
};
