import React from 'react';
import { Button, Text, View } from 'react-native';
import { runMigrations } from '../db';

export default function Playground() {
  return (
    <View style={{ marginTop: 20 }}>
      <View>
        <Text>This is playground</Text>
      </View>
      <Button title="Custom Action" onPress={() => runMigrations()} />
    </View>
  );
}
