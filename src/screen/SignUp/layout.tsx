import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';

import container from '@components/container';
import Input from '@components/input';
import Button from '@components/button';
import {Colors, Mixins} from '@utils/index';

type Props = {
  navigation: any;
};

const Layout: React.FC<Props> = (props) => {
  const {navigation} = props;
	const [name, setName] = React.useState('');
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [confirmPswd, setConfirmPswd] = React.useState('');
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

  return (
    <View style={styles.container}>
			<View style={styles.inputWrapper}>
				<Input
					mode={'flat'}
					label={'Full Name'}
					value={name}
					onChangeText={text => setName(text)}
				/>
				<Input
					mode={'flat'}
					label={'Email Address'}
					value={email}
					onChangeText={text => setEmail(text)}
				/>
				<Input
					mode={'flat'}
					label={'Password'}
					value={password}
					onChangeText={text => setPassword(text)}
					secureTextEntry={secure}
					password={true}
					onSecure={() => setSecure(!secure)}
				/>
				<Input
					mode={'flat'}
					label={'Confirm Password'}
					value={confirmPswd}
					onChangeText={text => setConfirmPswd(text)}
					secureTextEntry={secureConf}
					password={true}
					onSecure={() => setSecureConf(!secureConf)}
				/>
			</View>

			<Button
				uppercase={false}
				mode={'contained'}
				onPress={() => navigation.replace('SignIn')}
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
		marginBottom: Mixins.scaleSize(40),
	},
	rightAct: {
		color: Colors.SECONDARY,
		fontSize: Mixins.scaleFont(16),
		marginRight: Mixins.scaleSize(10),
	},
});

export default container(Layout, true, Colors.WHITE);
