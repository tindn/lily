import { Layout } from '@ui-kitten/components';
import React from 'react';
import { SafeAreaView, StatusBar, useColorScheme, View } from 'react-native';

function Screen(props) {
  const colorScheme = useColorScheme();
  const lightModeStatusBar = props.lightModeStatusBar || 'dark-content';
  const darkModeStatusBar = props.darkModeStatusBar || 'light-content';
  const currentStatusBar =
    colorScheme === 'dark' ? darkModeStatusBar : lightModeStatusBar;
  StatusBar.setBarStyle(currentStatusBar);
  const ContentWrapper = props.isFullScreen ? View : SafeAreaView;
  const backgroundLevel = props.backgroundLevel || '2';
  return (
    <Layout style={{ flex: 1 }} level={backgroundLevel}>
      <ContentWrapper style={[{ flex: 1 }, props.style]}>
        {props.children}
      </ContentWrapper>
    </Layout>
  );
}

export default Screen;
