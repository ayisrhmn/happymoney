import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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

	const balance = () => {
		return data.income - data.expense;
	};

	const precentageExpense = () => {
		return (
			data.income == 0
				? data.expense / data.expense * 1
				: data.expense / data.income * 1
		);
	};

	const precentageIncome = () => {
		return (data.income / data.income * 1) - precentageExpense();
	};

	const graphData = [
		{
			x: 'Income',
			y: isNaN(precentageIncome()) ? 0 : precentageIncome(),
		},
		{
			x: 'Expense',
			y: isNaN(precentageExpense()) ? 0 : precentageExpense(),
		},
	];

  return (
		<Card style={styles.cardContainer}>
			<View style={[styles.row, styles.summary]}>
				<View style={styles.row}>
					<MaterialIcons
						name={'account-balance-wallet'}
						size={Mixins.scaleFont(24)}
						color={Colors.PRIMARY}
					/>
					<View>
						<Text style={styles.title}>
							Balance
						</Text>
						<Text style={styles.title}>
							{Helper.numberWithSeparator(balance())}
						</Text>
					</View>
				</View>
				<View style={styles.row}>
					<Ionicons
						name={'time'}
						size={Mixins.scaleFont(24)}
						color={Colors.BLACK}
					/>
					<View>
						<Text style={styles.date}>
							{moment().format('MMMM YYYY')}
						</Text>
					</View>
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
						colorScale={[Colors.SUCCESS, Colors.ALERT]}
						labels={({datum}) => `${datum.y.toFixed(2) * 100}%`}
						style={{
							labels: {
								fontSize: Mixins.scaleSize(14),
								fontWeight: 'bold',
								color: Colors.BLACK,
							}
						}}
					/>
				</View>
			)}

			<View style={[styles.row, styles.legendContainer]}>
				{graphData.map((item: any, i: any) => (
					<View style={{alignItems: 'center'}}>
						<View style={styles.row} key={i}>
							<View style={
								item.x === 'Income' && [styles.legend, styles.income] ||
								item.x === 'Expense' && [styles.legend, styles.expense]
							} />
							<View>
								<Text style={
									item.x === 'Income' && [styles.textLegend, styles.textIncome] ||
									item.x === 'Expense' && [styles.textLegend, styles.textExpense]
								}>
									{item.x}
								</Text>
								<Text style={
									item.x === 'Income' && [styles.textLegend, styles.textIncome] ||
									item.x === 'Expense' && [styles.textLegend, styles.textExpense]
								}>
									{Helper.numberWithSeparator(
										item.x === 'Income' ? data.income : data.expense
									)}
								</Text>
							</View>
						</View>
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
		color: Colors.PRIMARY,
		fontSize: Mixins.scaleFont(16),
		fontWeight: 'bold',
		textAlignVertical: 'center',
		marginLeft: Mixins.scaleSize(5),
	},
	date: {
		color: Colors.BLACK,
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
	income: {
		backgroundColor: Colors.SUCCESS,
	},
	expense: {
		backgroundColor: Colors.ALERT,
	},
	textLegend: {
		marginLeft: Mixins.scaleSize(5),
		fontSize: Mixins.scaleFont(14),
		fontWeight: 'bold',
		color: Colors.BLACK,
	},
	textIncome: {
		color: Colors.SUCCESS,
	},
	textExpense: {
		color: Colors.ALERT,
	},
});

export default Layout;
