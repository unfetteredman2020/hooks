/*
 * @Author: unfetteredman
 * @Date: 2022-12-09 10:20:10
 * @LastEditors: unfetteredman
 * @LastEditTime: 2022-12-09 11:14:09
 */
import { useState, useEffect } from 'react';

let timer: any = null;

function UseCountDown({ millisecond, callBack }: TimeDown) {
  const [millisec, setMillisec] = useState<number>();
  const [countDown, setCountDown] = useState<Remains>({ day: 0, hour: 0, minute: 0, second: 0 });
  useEffect(() => {
    console.log('first');
    if (timer) clearInterval(timer);
    millisecond && setMillisec(millisecond);
  }, [millisecond]);

  useEffect(() => {
    if ((millisec && millisec > 0)) {
      timer = setInterval(() => {
        if (millisec) {
          const sec = millisec;
          setMillisec(sec - 1000)
          setCountDown( () => ({
            day: Math.floor(millisec / (1000 * 60 * 60 * 24)),
            hour: Math.floor((millisec / (1000 * 60 * 60)) % 24),
            minute: Math.floor((millisec / (1000 * 60)) % 60),
            second: Math.round((millisec / 1000) % 60)
          }));
        } else {

        }
      }, 1000);
    }

    if (millisec && (millisec <= 0)) {
      clearInterval(timer)
      callBack && callBack();
    };
    return () => clearInterval(timer);
  }, [callBack, millisec, millisecond]);

  console.log('countDown', millisec);
  return countDown;
}

export default UseCountDown;
