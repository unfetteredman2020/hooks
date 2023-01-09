/*
 * @Author: unfetteredman
 * @Date: 2022-12-08 15:47:49
 * @LastEditors: unfetteredman
 * @LastEditTime: 2022-12-09 10:31:21
 */
// type oneOf<T, U> = | { T: number; U?: never;}| { U: number; T?: never };
// declare type TimeDown = oneOf<'millisecond', 'deadline'>

// declare interface TimeDown {
//   callBack?: () => void;
//   millisecond?: number;
//   deadline?: Date | number | undefined | null
// }


declare type TimeDown = | {
  callBack?: ()=>void;
  millisecond: number;
  deadline?: never
} | {
  callBack?: ()=>void;
  millisecond?: never;
  deadline: number
} 

declare type Remains = Record<'day' | 'hour' | 'minute' | 'second', number>;

declare interface TimeDownReturnProps {
  day: number,
  hour: number,
  minute: number,
  second: number
}