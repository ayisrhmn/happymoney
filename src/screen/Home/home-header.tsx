import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Colors, Mixins} from '@utils/index';

type Props = {
  navigation: any;
	user: any;
};

const Layout: React.FC<Props> = (props) => {
  const {navigation, user} = props;

  return (
		<View style={styles.header}>
			<View style={styles.infoWrapper}>
				<Text style={styles.welcomeText}>
					Hello,
				</Text>
				<Text style={styles.welcomeText}>
					{user.name}
				</Text>
			</View>

			<TouchableOpacity
				onPress={() => navigation.navigate('Profile', user)}
			>
				<Ionicons
					name={'person-circle'}
					size={Mixins.scaleFont(54)}
					color={Colors.SECONDARY}
				/>
			</TouchableOpacity>
		</View>
  );
};

const styles = StyleSheet.create({
	header: {
		backgroundColor: Colors.PRIMARY,
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: Mixins.scaleSize(14),
		marginBottom: Mixins.scaleSize(16),
	},
	infoWrapper: {
		justifyContent: 'center',
	},
	welcomeText: {
		color: Colors.WHITE,
		fontSize: Mixins.scaleFont(16),
	},
	divider: {
		backgroundColor: Colors.SHADES.dark[60],
		marginVertical: Mixins.scaleSize(12),
	},
});

export default Layout;
