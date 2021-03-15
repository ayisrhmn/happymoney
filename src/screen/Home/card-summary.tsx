import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Card from '@components/card';
import {Colors, Helper, Mixins} from '@utils/index';

import moment from 'moment';

type Props = {
	data: any;
};

const Layout: React.FC<Props> = (props) => {
  const {data} = props;

  return (
		<Card style={styles.cardContainer}>
			<View style={[styles.row, styles.summary]}>
				<Text style={styles.title}>
					Summary
				</Text>
				<View style={styles.row}>
					<Ionicons
						name={'time'}
						size={Mixins.scaleFont(25)}
						color={Colors.SUCCESS}
					/>
					<Text style={styles.time}>
						{moment(data.date).format('MMM-YYYY')}
					</Text>
				</View>
			</View>

			<View style={[styles.row, styles.space]}>
				<Text style={styles.text}>
					Balance
				</Text>
				<Text style={styles.title}>
					{Helper.numberWithSeparator(data.balance)}
				</Text>
			</View>
			<View style={[styles.row, styles.space]}>
				<Text style={styles.text}>
					Biggest Debit
				</Text>
				<Text style={styles.title}>
					{Helper.numberWithSeparator(data.debit)}
				</Text>
			</View>
			<View style={[styles.row, styles.space]}>
				<Text style={styles.text}>
					Biggest Credit
				</Text>
				<Text style={styles.title}>
					{Helper.numberWithSeparator(data.credit)}
				</Text>
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
	summary: {
		justifyContent: 'space-between',
		marginBottom: Mixins.scaleSize(16),
	},
	title: {
		color: Colors.BLACK,
		fontSize: Mixins.scaleFont(16),
		fontWeight: 'bold',
		textAlignVertical: 'center',
	},
	time: {
		color: Colors.SUCCESS,
		fontSize: Mixins.scaleFont(16),
		fontWeight: 'bold',
		textAlignVertical: 'center',
		marginLeft: Mixins.scaleSize(5),
	},
	text: {
		color: Colors.BLACK,
		fontSize: Mixins.scaleFont(14),
		marginBottom: Mixins.scaleSize(2),
	},
});

export default Layout;
