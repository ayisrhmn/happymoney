/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import 'react-native-gesture-handler';
import React from 'react';

import {Provider as PaperProvider, DefaultTheme} from 'react-native-paper';
import FlashMessage from 'react-native-flash-message';

import HomeStack from '@navigations/home-stack';
import {Colors} from '@utils/index';

import moment from 'moment';
import 'moment/locale/en-gb';

const App = () => {
  const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: Colors.PRIMARY,
    },
  };

  moment.locale('en');

  return (
    <PaperProvider theme={theme}>
      <HomeStack />
      <FlashMessage position="top" duration={3000} />
    </PaperProvider>
  );
};

export default App;
