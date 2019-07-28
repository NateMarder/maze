import React, { useState, useEffect } from 'react';
import Swipe from 'react-easy-swipe';

const SwipeHandler = (props) => {
  const [coolDown, setCoolDown] = useState(true);
  const [eventTarget, setEventTarget] = useState(null);
  const [eventHandler, setEventHandler] = useState(null);

  useEffect(() => {
    const { handler, target } = props;
    if (handler && target && eventTarget === null) {
      setCoolDown(false);
      setEventHandler(eventHandler);
      setEventTarget(eventTarget);
      console.log(props);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventTarget]);

  const handleCoolDown = () => {
    setCoolDown(true);
    setTimeout(() => { setCoolDown(false); }, 250);
  };

  const getSwipeProps = () => ({
    onSwipeUp: () => {
      if (!coolDown) {
        handleCoolDown();
        console.log('swipe up happened');
        eventHandler({ which: 38 });
      }
    },
    onSwipeDown: () => {
      if (!coolDown) {
        handleCoolDown();
        console.log('swipe down happened');
        eventHandler({ which: 40 });
      }
    },
    onSwipeLeft: () => {
      if (!coolDown) {
        handleCoolDown();
        console.log('swipe left happened');
        eventHandler({ which: 37 });
      }
    },
    onSwipeRight: () => {
      if (!coolDown) {
        handleCoolDown();
        console.log('swipe right happened');
        eventHandler({ which: 39 });
      }
    },
    onSwipeMove: () => true,
    allowMouseEvents: true,
  });

  return <Swipe {...getSwipeProps()}>{props.children}</Swipe>;
};

export default SwipeHandler;
