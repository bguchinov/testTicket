import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MainScreen from './src/screens/MainScreen';

const App = () => (
  <SafeAreaProvider>
    <MainScreen />
  </SafeAreaProvider>
);
export default App;
