import { useState, useCallback } from 'react';

export default function useToggle(defaultValue = false) {
  var [state, setState] = useState(defaultValue);
  var toggleFunction = useCallback(function() {
    setState(!state);
  }, []);
  return [state, toggleFunction];
}
