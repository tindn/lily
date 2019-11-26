import { useState } from 'react';

export default function useToggle(defaultValue = false) {
  var [state, setState] = useState(defaultValue);
  var toggleFunction = function() {
    setState(!state);
  };
  return [state, toggleFunction];
}
