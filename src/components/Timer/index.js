/* eslint-disable react/prop-types */
import React from 'react';
import { useTimer } from 'react-timer-hook';

export default function MyTimer({ expiryTimestamp }) {
  const {
    seconds,
    isRunning,
    restart,
  } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') });

  return (
    <div style={{ textAlign: 'center' }}>
      <div>{seconds}</div>
      <button
        type="button"
        onClick={() => {
        // Restarts timer
          const time = new Date();
          time.setSeconds(time.getSeconds() + 15);
          restart(time);
        }}
      >
        Restart
      </button>
      {!isRunning && <div>TIME IS UP</div>}
    </div>
  );
}
