import React, { useEffect, useState, useRef } from 'react';

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
