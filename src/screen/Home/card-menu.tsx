import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Card from '@components/card';
import {Colors, Mixins} from '@utils/index';

type Props = {
	navigation: any;
	user: any;
};

const Layout: React.FC<Props> = (props) => {
  const {navigation, user} = props;

	const listMenu: Array<any> = [
		{
			menu: 'Category',
			navigate: 'Category',
			icon: 'category',
			iconColor: Colors.SHADES.purple[80],
		},
		{
			menu: 'Transactions',
			navigate: 'Transactions',
			icon: 'wallet',
			iconColor: Colors.PRIMARY,
		},
	];

  return (
		<>
			{listMenu.map((item: any, i: number) => (
				<Card
					style={styles.cardContainer}
					onPress={() => navigation.navigate(item.navigate, user)}
					key={i}
				>
					<View style={[
						styles.row,
						styles.space,
						{alignItems: 'center'},
					]}>
						<View style={styles.row}>
							{item.menu === 'Category' && (
								<MaterialIcons
									name={item.icon}
									size={Mixins.scaleFont(52)}
									color={item.iconColor}
									style={{marginRight: Mixins.scaleSize(14)}}
								/>
							)}
							{item.menu === 'Transactions' && (
								<Ionicons
									name={item.icon}
									size={Mixins.scaleFont(52)}
									color={item.iconColor}
									style={{marginRight: Mixins.scaleSize(14)}}
								/>
							)}
							<Text style={styles.titleBig}>
								{item.menu}
							</Text>
						</View>

						<Ionicons
							name={'chevron-forward'}
							size={Mixins.scaleFont(32)}
							color={Colors.BLACK}
						/>
					</View>
				</Card>
			))}
		</>
  );
};

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
	},
	space: {
		justifyContent: 'space-between',
	},
	cardContainer: {
		marginHorizontal: Mixins.scaleSize(12),
	},
	titleBig: {
		color: Colors.BLACK,
		fontSize: Mixins.scaleFont(20),
		fontWeight: 'bold',
		textAlignVertical: 'center',
	},
	text: {
		color: Colors.BLACK,
		fontSize: Mixins.scaleFont(14),
		marginBottom: Mixins.scaleSize(2),
	},
});

export default Layout;