import React from 'react';
import MyTimer from '@components/Timer';

const Calibration = () => {
  const time = new Date();
  time.setSeconds(time.getSeconds() + 15);

  return (
    <div className="component-container calibration-background">
      <h1>Calibration</h1>
      <p>Stuff to build here:</p>
      <ul>
        <li>wrap in SerialHOC to have access to newuser button</li>
        <li>pie timer</li>
        <li>tips</li>
        <li>calibration sequence</li>
        <li>calibration success</li>
      </ul>
      <div>
        <MyTimer expiryTimestamp={time} />
      </div>
    </div>
  );
};

export default Calibration;
