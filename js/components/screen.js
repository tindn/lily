import React from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';
import theme from '../theme';

function Screen(props) {
  // const colorScheme = useColorScheme();
  // const lightModeStatusBar = props.lightModeStatusBar || 'dark-content';
  const darkModeStatusBar = props.darkModeStatusBar || 'light-content';
  const currentStatusBar = darkModeStatusBar;
  // colorScheme === 'dark' ? darkModeStatusBar : lightModeStatusBar;
  StatusBar.setBarStyle(currentStatusBar);
  const ContentWrapper = props.isFullScreen ? View : SafeAreaView;
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ContentWrapper style={[{ flex: 1 }, props.style]}>
        {props.children}
      </ContentWrapper>
    </View>
  );
}

export default Screen;
