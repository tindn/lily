import React from 'react';
import { Svg, Rect } from 'react-native-svg';

export function Menu(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width}
      height={props.height}
      viewBox="0 0 24 24"
    >
      <Rect
        fill={props.color}
        x="3"
        y="11"
        width="18"
        height="2"
        rx=".95"
        ry=".95"
      />
      <Rect
        fill={props.color}
        x="3"
        y="16"
        width="18"
        height="2"
        rx=".95"
        ry=".95"
      />
      <Rect
        fill={props.color}
        x="3"
        y="6"
        width="18"
        height="2"
        rx=".95"
        ry=".95"
      />
    </Svg>
  );
}
