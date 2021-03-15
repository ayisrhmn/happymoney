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
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [secure, setSecure] = React.useState(true);

	React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
				return (
					<TouchableOpacity
						onPress={() => navigation.navigate('SignUp')}
					>
						<Text style={styles.rightAct}>
							Sign Up
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
			</View>

			<Button
				uppercase={false}
				mode={'contained'}
				onPress={() => navigation.replace('Home')}
			>
				Sign In
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

export default container(Layout);