/*
 * @Author: unfetteredman
 * @Date: 2022-12-09 10:20:10
 * @LastEditors: unfetteredman
 * @LastEditTime: 2022-12-09 11:14:09
 */
import { useState, useEffect } from 'react'

let timer:any = null;

function UseCountDown({ millisecond }: TimeDown) {
  const [deadline, setDeadLine] = useState<number>(0);
  const [countDown, setCountDown] = useState<TimeDownReturnProps>({
    day: 0,
    hour: 0,
    minute: 0,
    second: 0
  })
  useEffect(() => {
    if (timer) clearInterval(timer);
    setDeadLine(millisecond)
  }, [millisecond]);
  
  useEffect(() => {
    console.log('deadline :>> ', deadline);
    timer = setInterval(() => setDeadLine(pre => pre - 1000), 1000);
    setCountDown({
      day: Math.floor(deadline / (1000 * 60 * 60 * 24)),
      hour: Math.floor((deadline / (1000 * 60 * 60)) % 24),
      minute: Math.floor((deadline / (1000 * 60)) % 60),
      second: Math.round((deadline / 1000) % 60),
    })

    if (deadline === 0) clearInterval(timer)
    return () => clearInterval(timer);
  }, [deadline])

  console.log('countDown', deadline);
  return countDown
}

export default UseCountDown;
