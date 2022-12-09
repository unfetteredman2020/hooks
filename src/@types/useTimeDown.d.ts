/*
 * @Author: unfetteredman
 * @Date: 2022-12-08 15:47:49
 * @LastEditors: unfetteredman
 * @LastEditTime: 2022-12-09 10:31:21
 */
declare interface TimeDown {
  callBack?: () => void;
  millisecond: number;
}

declare interface TimeDownReturnProps {
  day: number,
  hour: number,
  minute: number,
  second: number
}