import React, { useState, useEffect } from 'react';
import { AsyncStorage, View, Text } from 'react-native';
import Pill from '../components/pill';
import theme from '../theme';
import sharedStyles from '../sharedStyles';

export default function Counter(props) {
  const [count, setCount] = useState('');
  useEffect(() => {
    const asyncKey = '@lily/counters/' + props.storageKey;
    AsyncStorage.getItem(asyncKey).then(count => {
      if (!count) {
        setCount(0);
      } else {
        setCount(parseInt(count));
      }
    });
    return () => {
      AsyncStorage.setItem(asyncKey, count.toString());
    };
  }, []);

  function increment() {
    setCount(count + 1);
  }

  function decrement() {
    if (count > 0) {
      setCount(count - 1);
    }
  }
  return (
    <View
      style={[
        props.borderBottom && sharedStyles.borderBottom,
        {
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingVertical: 12,
        },
      ]}
    >
      <Pill
        backgroundColor={theme.colors.primary}
        color={theme.colors.secondary}
        label="-"
        textStyle={{ paddingHorizontal: 30, paddingVertical: 10 }}
        onPress={decrement}
      />
      <Text style={{ fontWeight: '500', fontSize: 18 }}>{count}</Text>
      <Pill
        backgroundColor={theme.colors.primary}
        color={theme.colors.secondary}
        label="+"
        textStyle={{ paddingHorizontal: 30, paddingVertical: 10 }}
        onPress={increment}
      />
    </View>
  );
}
