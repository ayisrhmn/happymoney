import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';

import Avatar from '@components/avatar';
import {Colors, Mixins, Helper} from '@utils/index';

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
				<Avatar
					size={Mixins.scaleFont(50)}
					label={Helper.getInitialName(user.name?.toUpperCase())}
					color={user.avatar_color}
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
