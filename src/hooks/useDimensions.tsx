import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

export const useDimensions = (targetRef: React.RefObject<HTMLDivElement>) => {
  const shouldInitialize = useRef(true);

  // Define a function to get the dimensions from the targetRef
  const getDimensions = useCallback(() => {
    return {
      width: targetRef.current ? targetRef.current.offsetWidth : 0,
      height: targetRef.current ? targetRef.current.offsetHeight : 0,
    };
  }, [targetRef]);

  const [dimensions, setDimensions] = useState(getDimensions);

  // Define a callback function to update dimensions when the window is resized
  const handleResize = useCallback(() => {
    setDimensions(getDimensions());
  }, [getDimensions]);

  // Use useEffect to add and remove the resize event listener
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // UseLayoutEffect is used to immediately set dimensions once after the initial render
  useLayoutEffect(() => {
    if (shouldInitialize.current) {
      handleResize();
      shouldInitialize.current = false; // Prevent further re-initialization
    }
  }, [handleResize]);

  return dimensions;
};
