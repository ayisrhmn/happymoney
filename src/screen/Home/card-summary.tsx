import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {ActivityIndicator} from 'react-native-paper'
import Ionicons from 'react-native-vector-icons/Ionicons';

import Card from '@components/card';
import {Colors, Helper, Mixins} from '@utils/index';

import {VictoryPie, VictoryTheme} from 'victory-native';
import moment from 'moment';

type Props = {
	data: any;
	refresh: any;
};

const Layout: React.FC<Props> = (props) => {
  const {data, refresh} = props;

	const balance = data.debit - data.credit;

	const graphData = [
		{
			x: 'Balance',
			y: balance,
		},
		{
			x: 'Debit',
			y: data.debit
		},
		{
			x: 'Credit',
			y: data.credit
		},
	];

  return (
		<Card style={styles.cardContainer}>
			<View style={[styles.row, styles.summary]}>
				<Text style={styles.title}>
					Summary Chart
				</Text>
				<View style={styles.row}>
					<Ionicons
						name={'time'}
						size={Mixins.scaleFont(25)}
						color={Colors.PRIMARY}
					/>
					<Text style={styles.time}>
						{moment().format('MMMM YYYY')}
					</Text>
				</View>
			</View>

			{refresh && (
				<ActivityIndicator
					animating={true}
					size={'large'}
					color={Colors.PRIMARY}
					style={{marginVertical: Mixins.scaleSize(50)}}
				/>
			)}

			{!refresh && (
				<View style={styles.chartContainer}>
					<VictoryPie
						data={graphData}
						height={Mixins.scaleSize(230)}
						theme={VictoryTheme.material}
						colorScale={[Colors.PRIMARY, Colors.SUCCESS, Colors.ALERT]}
						labels={({datum}) => `${Helper.numberWithSeparator(datum.y)}`}
					/>
				</View>
			)}

			<View style={[styles.row, styles.legendContainer]}>
				{graphData.map((item: any, i: any) => (
					<View style={styles.row} key={i}>
						<View style={
							item.x === 'Balance' && [styles.legend, styles.balance] ||
							item.x === 'Debit' && [styles.legend, styles.debit] ||
							item.x === 'Credit' && [styles.legend, styles.credit]
						} />
						<Text style={styles.textLegend}>
							{item.x}
						</Text>
					</View>
				))}
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
		marginHorizontal: Mixins.scaleSize(12),
		padding: 0,
	},
	chartContainer: {
		alignItems: 'center',
	},
	summary: {
		justifyContent: 'space-between',
		paddingTop: Mixins.scaleSize(14),
		paddingHorizontal: Mixins.scaleSize(14),
	},
	title: {
		color: Colors.BLACK,
		fontSize: Mixins.scaleFont(16),
		fontWeight: 'bold',
		textAlignVertical: 'center',
	},
	time: {
		color: Colors.PRIMARY,
		fontSize: Mixins.scaleFont(16),
		fontWeight: 'bold',
		textAlignVertical: 'center',
		marginLeft: Mixins.scaleSize(5),
	},
	legendContainer: {
		justifyContent: 'space-around',
		paddingHorizontal: Mixins.scaleSize(14),
		paddingBottom: Mixins.scaleSize(24),
	},
	legend: {
		width: Mixins.scaleSize(16),
		height: Mixins.scaleSize(16),
		borderRadius: Mixins.scaleSize(50),
	},
	balance: {
		backgroundColor: Colors.PRIMARY,
	},
	debit: {
		backgroundColor: Colors.SUCCESS,
	},
	credit: {
		backgroundColor: Colors.ALERT,
	},
	textLegend: {
		marginLeft: Mixins.scaleSize(5),
		fontSize: Mixins.scaleFont(14),
	},
});

export default Layout;
