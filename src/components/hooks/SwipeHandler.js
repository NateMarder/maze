import React, { useState, useEffect } from 'react';
import Swipe from 'react-easy-swipe';

const SwipeHandler = ({ children, synthclick }) => {
  const [coolDown, setCoolDown] = useState(false);

  useEffect(() => {
  }, []);

  const handleCoolDown = () => {
    setCoolDown(true);
    setTimeout(() => { setCoolDown(false); }, 250);
  };

  const getSwipeProps = () => {
    const swipeProps = {
      onSwipeUp: () => {
        if (!coolDown) {
          handleCoolDown();
          console.log('swipe up happened');
          synthclick({ which: 38 });
        }
      },
      onSwipeDown: () => {
        if (!coolDown) {
          handleCoolDown();
          console.log('swipe down happened');
          synthclick({ which: 40 });
        }
      },
      onSwipeLeft: () => {
        if (!coolDown) {
          handleCoolDown();
          console.log('swipe left happened');
          synthclick({ which: 37 });
        }
      },
      onSwipeRight: () => {
        if (!coolDown) {
          handleCoolDown();
          console.log('swipe right happened');
          synthclick({ which: 39 });
        }
      },
      onSwipeMove: () => true,
      allowMouseEvents: true,
    };
    return swipeProps;
  };

  return (
    <Swipe {...getSwipeProps()}>
      {children}
    </Swipe>
  );
};

export default SwipeHandler;
