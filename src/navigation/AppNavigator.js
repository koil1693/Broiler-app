import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import HelloWorldScreen from '../screens/HelloWorldScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="HelloWorld" component={HelloWorldScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;