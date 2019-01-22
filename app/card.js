import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import theme from '../theme';

function Card(props) {
  const { style, children, onPress } = props;
  return (
    <TouchableOpacity
      disabled={!onPress}
      onPress={onPress}
      style={[styles.card, style]}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 5,
    elevation: 3,
    flex: 1,
    marginLeft: 5,
    marginRight: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
});

export default Card;
