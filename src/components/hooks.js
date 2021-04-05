/* eslint-disable import/prefer-default-export */

import { useState, useEffect, useCallback } from 'react';

// get X and Y mouse coordinates
// export const useCoordinates = () => {
//   const [cursorPosition, setCursorPosition] = useState({ x1: null, y1: null });
//   const updateCursorPosition = (ev) => {
//     setCursorPosition({ x1: ev.clientX, y1: ev.clientY });
//   };
//
//   useEffect(() => {
//     window.addEventListener('mousemove', updateCursorPosition);
//     return () => window.removeEventListener('mousemove', updateCursorPosition);
//   }, []);
//
//   return cursorPosition;
// };


// X only to match api
export const gazeX = () => {
  const [currentGazeX, setGazeX] = useState({ x: null });
  const updateGazeX = (ev) => {
    setGazeX({ x: ev.clientX });
  };

  useEffect(() => {
    window.addEventListener('mousemove', updateGazeX);
    return () => window.removeEventListener('mousemove', updateGazeX);
  }, []);

  return currentGazeX;
};

// Y only to match api
export const gazeY = () => {
  const [currentGazeY, setGazeY] = useState({ y: null });
  const updateGazeY = (ev) => {
    setGazeY({ y: ev.clientY });
  };

  useEffect(() => {
    window.addEventListener('mousemove', updateGazeY);
    return () => window.removeEventListener('mousemove', updateGazeY);
  }, []);

  return currentGazeY;
};

// to emulate isUserPresent
export const isUserPresent = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => {
    setValue((v) => !v);
  }, []);
  return [value, toggle];
};
