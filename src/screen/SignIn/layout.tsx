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

	const {
		register,
		handleSubmit,
		setValue,
		formState: {errors},
	} = useForm();

	React.useEffect(() => {
		register('email', {required: 'This field is required'});
    register('password', {required: 'This field is required'});

    return () => {};
  }, [register]);

	const onSubmit = (val: any) => {
		firebase.auth()
			.signInWithEmailAndPassword(val.email, val.password)
			.then(() => {
				navigation.replace('Home');
			})
			.catch((error) => {
				showMessage({
					message: error.message,
					type: 'danger',
				});
			});
  };

  return (
    <View style={styles.container}>
			<View style={styles.inputWrapper}>
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
			</View>

			<Button
				uppercase={false}
				mode={'contained'}
				onPress={() => handleSubmit(onSubmit)()}
			>
				Sign In
			</Button>

			<View style={styles.wrapperSignUp}>
				<Text style={styles.labelSignUp}>
					Don't have an account?{' '}
				</Text>
				<TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
					<Text style={styles.labelSignUpTouch}>
						Sign Up
					</Text>
				</TouchableOpacity>
			</View>
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
	wrapperSignUp: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: Mixins.scaleSize(26)
	},
	labelSignUp: {
		fontSize: Mixins.scaleFont(14),
		color: Colors.SHADES.dark[60],
	},
	labelSignUpTouch: {
		fontSize: Mixins.scaleFont(14),
		fontWeight: 'bold',
		color: Colors.PRIMARY,
	},
});

export default container(Layout, true, Colors.WHITE);
