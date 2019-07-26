import React, { useEffect, useState, useRef } from 'react';

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
const Blinker = ({ speed = 1000, children }) => {
  const [blinkStatus, setBlinkStatus] = useState(true);
  const [blinkSpeed] = useState(speed);
  const refContainer = useRef();

  useEffect(() => {
    const intervalRef = setInterval(() => {
      setBlinkStatus(!blinkStatus);
    }, blinkSpeed);

    refContainer.current = intervalRef;

    return () => { clearInterval(refContainer.current); };
  }, [blinkStatus, blinkSpeed]);

  return (
    <> {blinkStatus ? children : null} </>
  );
};

export default Blinker;
