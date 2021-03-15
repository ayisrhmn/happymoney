import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Card from '@components/card';
import {Colors, Mixins} from '@utils/index';

type Props = {
	navigation: any;
};

const Layout: React.FC<Props> = (props) => {
  const {navigation} = props;

  return (
		<Card
			style={styles.cardContainer}
			onPress={() => navigation.navigate('Transactions')}
		>
			<View style={[
				styles.row,
				styles.space,
				{alignItems: 'center'},
			]}>
				<View style={styles.row}>
					<Ionicons
						name={'wallet'}
						size={Mixins.scaleFont(52)}
						color={Colors.PRIMARY}
						style={{marginRight: Mixins.scaleSize(14)}}
					/>
					<Text style={styles.titleBig}>
						Transactions
					</Text>
				</View>

				<Ionicons
					name={'chevron-forward'}
					size={Mixins.scaleFont(32)}
					color={Colors.BLACK}
				/>
			</View>
		</Card>
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
		marginHorizontal: Mixins.scaleSize(14),
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
