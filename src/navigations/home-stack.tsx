import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Header from '@components/header';

import Splash from '@screen/Splash';
import Login from '@screen/Login';
import Home from '@screen/Home';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        headerMode="screen"
        screenOptions={{
          header: (props) => <Header {...props} />,
        }}>

				<Stack.Screen
          name="Splash"
          component={Splash}
          options={{
            headerShown: false,
          }}
        />

				<Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerTitle: 'Login',
          }}
        />

        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerTitle: 'HappyMoney',
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
