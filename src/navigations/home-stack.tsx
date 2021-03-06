import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Header from '@components/header';

import Splash from '@screen/Splash';
import SignIn from '@screen/SignIn';
import SignUp from '@screen/SignUp';

import Home from '@screen/Home';
import Category from '@screen/Category';
import Transactions from '@screen/Transactions';
import TransactionForm from '@screen/TransactionForm';
import TransactionDetail from '@screen/TransactionDetail';
import Profile from '@screen/Profile';
import EditProfile from '@screen/EditProfile';
import ChangePassword from '@screen/ChangePassword';
import MostDetail from '@screen/MostDetail';

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
          name={'Category'}
          component={Category}
          options={{
            headerTitle: 'Category',
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
          name={'TransactionForm'}
          component={TransactionForm}
          options={{
            headerTitle: 'Add Transaction',
          }}
        />

				<Stack.Screen
          name={'TransactionDetail'}
          component={TransactionDetail}
          options={{
            headerTitle: 'Detail Transaction',
          }}
        />

				<Stack.Screen
          name={'Profile'}
          component={Profile}
          options={{
            headerTitle: 'Profile',
          }}
        />

				<Stack.Screen
          name={'EditProfile'}
          component={EditProfile}
          options={{
            headerTitle: 'Edit Profile',
          }}
        />

				<Stack.Screen
          name={'ChangePassword'}
          component={ChangePassword}
          options={{
            headerTitle: 'Change Password',
          }}
        />

				<Stack.Screen
          name={'MostDetail'}
          component={MostDetail}
          options={({route}) => ({
						headerTitle: route?.params?.name,
					})}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
