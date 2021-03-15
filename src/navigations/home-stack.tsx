import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Header from '@components/header';

import Splash from '@screen/Splash';
import SignIn from '@screen/SignIn';
import SignUp from '@screen/SignUp';

import Home from '@screen/Home';
import Transactions from '@screen/Transactions';
import Profile from '@screen/Profile';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'Splash'}
        headerMode={'screen'}
        screenOptions={{
          header: (props) => <Header {...props} />,
        }}>

				<Stack.Screen
          name={'Splash'}
          component={Splash}
          options={{
            headerShown: false,
          }}
        />

				<Stack.Screen
          name={'SignIn'}
          component={SignIn}
          options={{
            headerTitle: 'Sign In',
          }}
        />

				<Stack.Screen
          name={'SignUp'}
          component={SignUp}
          options={{
            headerTitle: 'Sign Up',
          }}
        />

				<Stack.Screen
          name={'Home'}
          component={Home}
          options={{
            headerTitle: 'HappyMoney',
          }}
        />

				<Stack.Screen
          name={'Transactions'}
          component={Transactions}
          options={{
            headerTitle: 'Transactions',
          }}
        />

				<Stack.Screen
          name={'Profile'}
          component={Profile}
          options={{
            headerTitle: 'Profile',
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
