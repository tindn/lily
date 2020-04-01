import { useColorScheme } from 'react-native';
import { dark, light } from '@eva-design/eva';

export function useTheme() {
  const mode = useColorScheme();
  return mode === 'dark' ? dark : light;
}

export function useColor(color) {
  const theme = useTheme();
  return getValueFromTheme(color, theme);
}

function getValueFromTheme(key, theme) {
  let value = theme[key];
  if (value[0] === '$') {
    const newKey = value.substring(1);
    return getValueFromTheme(newKey, theme);
  }
  return value;
}
