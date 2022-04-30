import { createStackNavigator } from '@react-navigation/stack';
import { Plus } from 'components/Icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import theme from '../../theme';
import Categories from '../money/categories';
import Home from './home';
import LargeDisplay from './largeDisplay';
import Vendors from './vendors';
import VendorDetails from './vendors/VendorDetails';

const Stack = createStackNavigator();
export default function Misc() {
  const headerStyles = {
    headerStyle: {
      backgroundColor: theme.colors.layerOne,
    },
    headerTitleStyle: { color: theme.colors.white },
  };
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Home'
        component={Home}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name='LargeDisplay'
        component={LargeDisplay}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name='Vendors'
        component={Vendors}
        options={({ navigation }) => ({
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('VendorDetails', {})}
              style={{ marginRight: 10 }}
            >
              <Plus width={25} height={25} color='#3366FF' />
            </TouchableOpacity>
          ),
          ...headerStyles,
        })}
      />
      <Stack.Screen
        name='VendorDetails'
        component={VendorDetails}
        options={({ route }) => ({
          title: ((route.params || {}).vendor || { name: 'New Vendor' }).name,
          ...headerStyles,
        })}
      />
      <Stack.Screen
        name='Categories'
        component={Categories}
        options={headerStyles}
      />
    </Stack.Navigator>
  );
}
