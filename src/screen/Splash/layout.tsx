import React from 'react';
import {View, StyleSheet, Text, StatusBar} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Colors, Mixins} from '@utils/index';

type Props = {
  navigation: any;
};

const Layout: React.FC<Props> = (props) => {
  const {navigation} = props;

	React.useEffect(() => {
		setTimeout(() => {
			navigation.replace('SignIn');
		}, 3000);

		return () => {};
	}, []);

  return (
		<>
			<StatusBar
				barStyle="dark-content"
				backgroundColor={Colors.WHITE}
			/>
			<View style={styles.container}>
				<Ionicons
					name={'wallet'}
					size={Mixins.scaleFont(72)}
					color={Colors.PRIMARY}
				/>
				<Text style={styles.appName}>
					HappyMoney
				</Text>
				<Text style={styles.tagline}>
					Budget {'&'} Expenses Tracker
				</Text>
			</View>
		</>
  );
};

const styles = StyleSheet.create({
  container: {
		flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
	},
	appName: {
		color: Colors.BLACK,
		fontSize: Mixins.scaleFont(30),
		fontWeight: 'bold',
	},
	tagline: {
		color: Colors.BLACK,
		marginTop: Mixins.scaleSize(3),
		fontSize: Mixins.scaleFont(12),
		fontStyle: 'italic',
	},
});

export default Layout;
