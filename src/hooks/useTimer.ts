import {useEffect, useState} from 'react';

export const useTimer = () => {
  const [timerId, setTimerId] = useState<number | null>(null);

  const setNewTimer = (newTimerId: number | null) => {
    if (timerId) {
      clearInterval(timerId);
    }
    setTimerId(newTimerId);
  };

  useEffect(() => {
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [timerId]);

  return {timerId, setNewTimer};
};
