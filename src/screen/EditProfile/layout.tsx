import React from 'react';
import {View, StyleSheet, BackHandler} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {showMessage} from 'react-native-flash-message';

import container from '@components/container';
import Input from '@components/input';
import Button from '@components/button';
import {Colors, Mixins} from '@utils/index';
import firebase from '@database/firebase';

type Props = {
  navigation: any;
	route: any;
};

const Layout: React.FC<Props> = (props) => {
  const {navigation, route} = props;

	const user = route.params;

	React.useEffect(() => {
		const backAction = () => {
      navigation.navigate('Profile', user);

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

	const [profile, setProfile] = React.useState(user) as any;

	const {
		handleSubmit,
		formState: {errors},
		control,
	} = useForm();

	const errorMessage = {
    form: 'This field is required',
  };

	const onSubmit = () => {
    let data = profile;

		firebase.database()
      .ref(`users/${profile?.uid}/`)
      .update(data)
      .then(() => {
				showMessage({
					message: 'Profile successfully updated.',
					type: 'success',
				});
				navigation.replace('Profile', profile);
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
				<Controller
					control={control}
					render={({field: {onChange}}) => (
						<Input
							mode={'outlined'}
							name={'Full Name'}
							placeholder={'e.g. Peter Parker'}
							value={profile?.name}
							error={errors.name}
							onChangeText={(text: any) => {
								setProfile({...profile, name: text});
								onChange(text);
							}}
						/>
					)}
					name={'name'}
					rules={{
						required:
							profile?.name === user?.name
								? false
								: errorMessage.form
					}}
					defaultValue={profile?.name}
				/>
				<Input
					mode={'outlined'}
					name={'Email Address'}
					placeholder={'e.g. youremail@happymoney.com'}
					disabled={true}
					value={profile?.email}
				/>
			</View>

			<Button
				uppercase={false}
				mode={'contained'}
				onPress={() => handleSubmit(onSubmit)()}
			>
				Update Profile
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
