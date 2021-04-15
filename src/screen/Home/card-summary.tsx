import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {ActivityIndicator} from 'react-native-paper'
import Ionicons from 'react-native-vector-icons/Ionicons';

import Card from '@components/card';
import {Colors, Helper, Mixins} from '@utils/index';

import moment from 'moment';

type Props = {
	data: any;
	refresh: any;
};

const Layout: React.FC<Props> = (props) => {
  const {data, refresh} = props;

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
						{moment(data.summary_data.date).format('MMM-YYYY')}
					</Text>
				</View>
			</View>

			{refresh && (
				<ActivityIndicator
					animating={true}
					size={'large'}
					color={Colors.PRIMARY}
					style={{marginTop: Mixins.scaleSize(10)}}
				/>
			)}

			{!refresh && (
				<>
					<View style={[styles.row, styles.space]}>
						<Text style={styles.text}>
							Balance
						</Text>
						<Text style={styles.title}>
							{Helper.numberWithSeparator(data.summary_data.balance)}
						</Text>
					</View>
					<View style={[styles.row, styles.space]}>
						<Text style={styles.text}>
							Biggest Debit
						</Text>
						<Text style={styles.title}>
							{Helper.numberWithSeparator(data.summary_data.debit)}
						</Text>
					</View>
					<View style={[styles.row, styles.space]}>
						<Text style={styles.text}>
							Biggest Credit
						</Text>
						<Text style={styles.title}>
							{Helper.numberWithSeparator(data.summary_data.credit)}
						</Text>
					</View>
				</>
			)}
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
		marginHorizontal: Mixins.scaleSize(12),
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
