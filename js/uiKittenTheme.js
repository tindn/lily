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

export function useThemeColors() {
  const theme = useTheme();
  const backgroundColor1 = getValueFromTheme('background-basic-color-1', theme);
  const textColor = getValueFromTheme('text-basic-color', theme);
  const textPrimaryColor = getValueFromTheme('text-primary-color', theme);
  const textSuccessColor = getValueFromTheme('text-success-color', theme);
  const textInfoColor = getValueFromTheme('text-info-color', theme);
  const textWarningColor = getValueFromTheme('text-warning-color', theme);
  const textDangerColor = getValueFromTheme('text-danger-color', theme);
  const textControlColor = getValueFromTheme('text-control-color', theme);
  return {
    backgroundColor1,
    textColor,
    textPrimaryColor,
    textSuccessColor,
    textInfoColor,
    textWarningColor,
    textDangerColor,
    textControlColor,
  };
}

function getValueFromTheme(key, theme) {
  let value = theme[key];
  if (value[0] === '$') {
    const newKey = value.substring(1);
    return getValueFromTheme(newKey, theme);
  }
  return value;
}

export function useHeadStyles() {
  const colors = useThemeColors();
  return {
    headerStyle: {
      backgroundColor: colors.backgroundColor1,
    },
    headerTitleStyle: { color: colors.textColor },
  };
}
