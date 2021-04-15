import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useForm} from 'react-hook-form';
import {showMessage} from 'react-native-flash-message';

import container from '@components/container';
import Input from '@components/input';
import Button from '@components/button';
import {Colors, Mixins} from '@utils/index';
import firebase from '@database/firebase';

type Props = {
  navigation: any;
};

const Layout: React.FC<Props> = (props) => {
  const {navigation} = props;

	const [secure, setSecure] = React.useState(true);
	const [secureConf, setSecureConf] = React.useState(true);

	React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
				return (
					<TouchableOpacity
						onPress={() => navigation.navigate('SignIn')}
					>
						<Text style={styles.rightAct}>
							Sign In
						</Text>
					</TouchableOpacity>
				);
      },
    });

    return () => {};
  }, [navigation]);

	const {
		register,
		handleSubmit,
		setValue,
		formState: {errors},
	} = useForm();

	React.useEffect(() => {
    register('name', {required: 'This field is required'});
		register('email', {required: 'This field is required'});
    register('password', {required: 'This field is required'});
    register('confirmPswd', {required: 'This field is required'});

    return () => {};
  }, [register]);

	const onSubmit = (val: any) => {
		if (val.password !== val.confirmPswd) {
			showMessage({
				message: 'Your password don`t match, please type your correct password.',
				type: 'danger',
			});
		} else if (val.password.length < 6) {
			showMessage({
				message: 'Password less than 6 characters.',
				type: 'danger',
			});
		} else {
			firebase.auth()
				.createUserWithEmailAndPassword(val.email, val.password)
				.then((success) => {
					let data = {
						uid: success.user?.uid,
						name: val.name,
						email: val.email,
					};

					firebase.database()
						.ref(`users/${data.uid}/`)
						.set(data);

					showMessage({
						message: 'User successfully registered.',
						type: 'success',
					});

					navigation.navigate('SignIn');
				})
				.catch((error) => {
					showMessage({
						message: error.message,
						type: 'danger',
					});
				});
		}
  };

  return (
    <View style={styles.container}>
			<View style={styles.inputWrapper}>
				<Input
					mode={'outlined'}
					name={'Full Name'}
					placeholder={'e.g. Peter Parker'}
					onChangeText={(text: any) => {
						setValue('name', text, {shouldValidate: true});
					}}
					error={errors.name}
				/>
				<Input
					mode={'outlined'}
					name={'Email Address'}
					placeholder={'e.g. youremail@happymoney.com'}
					onChangeText={(text: any) => {
						setValue('email', text, {shouldValidate: true});
					}}
					error={errors.email}
				/>
				<Input
					mode={'outlined'}
					name={'Password'}
					placeholder={'Type your password'}
					password={true}
					secureTextEntry={secure}
					onSecure={() => setSecure(!secure)}
					onChangeText={(text: any) => {
						setValue('password', text, {shouldValidate: true});
					}}
					error={errors.password}
				/>
				<Input
					mode={'outlined'}
					name={'Confirm Password'}
					placeholder={'Type again your password'}
					password={true}
					secureTextEntry={secureConf}
					onSecure={() => setSecureConf(!secureConf)}
					onChangeText={(text: any) => {
						setValue('confirmPswd', text, {shouldValidate: true});
					}}
					error={errors.confirmPswd}
				/>
			</View>

			<Button
				uppercase={false}
				mode={'contained'}
				onPress={() => handleSubmit(onSubmit)()}
			>
				Sign Up
			</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
		padding: Mixins.scaleSize(12),
  },
	inputWrapper: {
		marginBottom: Mixins.scaleSize(30),
	},
	rightAct: {
		color: Colors.SECONDARY,
		fontSize: Mixins.scaleFont(16),
		marginRight: Mixins.scaleSize(10),
	},
});

export default container(Layout, true, Colors.WHITE);
