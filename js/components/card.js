import { Layout } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

function Card(props) {
  return (
    <TouchableOpacity
      disabled={!props.onPress}
      onPress={props.onPress}
      style={props.style}
    >
      <Layout style={styles.card}>{props.children}</Layout>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    elevation: 3,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
});

export default Card;
