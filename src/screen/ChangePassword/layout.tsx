import React from 'react';
import {View, StyleSheet} from 'react-native';
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

	const {
		register,
		handleSubmit,
		setValue,
		formState: {errors},
	} = useForm();

	React.useEffect(() => {
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
			let user = firebase.auth().currentUser;

			if (user) {
				user.updatePassword(val.password)
				.then(() => {
					showMessage({
						message: 'Password changed successfully.',
						type: 'success',
					});

					navigation.replace('Home');
				})
				.catch((error) => {
					showMessage({
						message: error.message,
						type: 'danger',
					});
				});
			}
		}
  };

  return (
    <View style={styles.container}>
			<View style={styles.inputWrapper}>
				<Input
					mode={'outlined'}
					name={'Password'}
					placeholder={'Type your new password'}
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
					placeholder={'Type again your new password'}
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
				Change Password
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
