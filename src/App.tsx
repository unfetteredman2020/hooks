/*
 * @Author: unfetteredman
 * @Date: 2022-12-08 15:21:20
 * @LastEditors: unfetteredman
 * @LastEditTime: 2023-01-09 11:13:46
 */
import React from 'react';
// import moment from 'moment';
// import useTimeDown from './hook/useTimeDownHooks/useTimeDown'

import './App.css';
import useCountdown from './hook/useCountDownHooks/useCountDown';


function App() {
  // const deadline = useMemo(
  //   () =>
  //     moment()
  //       // 设置时间
  //       .add(8, 's')
  //       .add(7, 'm')
  //       .add(6, 'h')
  //       .add(5, 'd')
  //       .format('YYYY-MM-DD HH:mm:ss'),
  //   [],
  // );
  // const { day, hour, minute, second } = useTimeDown({
  //   deadline,
  // });
  return <div>
    {/* <span>day: {day};</span>
    <span>hour: {hour};</span>
    <span>minute: {minute};</span>
    <span>second: {second};</span> */}
  <UseCountdownChild />
  </div>
}

export default App;


const UseCountdownChild = () => {
  const { day, hour, minute, second } = useCountdown({ millisecond: 1 * 1000 * 60 * 60});
  return <div>
    <span>day: {day};</span>
    <span>hour: {hour};</span>
    <span>minute: {minute};</span>
    <span>second: {second};</span>

  </div>
}