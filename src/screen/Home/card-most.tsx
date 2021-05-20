import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {Colors, Helper, Mixins} from '@utils/index';

type Props = {
	mostIncome: any;
	mostExpense: any;
};

const Layout: React.FC<Props> = (props) => {
  const {mostIncome, mostExpense} = props;

  return (
		<View style={[styles.row, {
			justifyContent: 'space-between',
			marginRight: Mixins.scaleSize(12),
		}]}>
			{(mostIncome !== undefined && mostIncome.total !== 0) && (
				<View
					style={[
						styles.maxCardContainer,
						styles.maxDebit,
						{marginLeft: Mixins.scaleSize(12)}
					]}
				>
					<Text style={styles.cardTitle}>
						Most Income
					</Text>

					<View style={styles.row}>
						<MaterialIcons
							name={'category'}
							size={Mixins.scaleFont(20)}
							color={Colors.WHITE}
						/>
						<Text style={styles.cardText}>
							{mostIncome?.category}
						</Text>
					</View>

					<View style={styles.row}>
						<MaterialIcons
							name={'account-balance-wallet'}
							size={Mixins.scaleFont(20)}
							color={Colors.WHITE}
						/>
						<Text style={styles.cardText}>
							{Helper.numberWithSeparator(mostIncome?.total)}
						</Text>
					</View>
				</View>
			)}

			{(mostExpense !== undefined && mostExpense.total !== 0) && (
				<View
					style={[
						styles.maxCardContainer,
						styles.maxCredit,
						{marginLeft: Mixins.scaleSize(12)}
					]}
				>
					<Text style={styles.cardTitle}>
						Most Expense
					</Text>

					<View style={styles.row}>
						<MaterialIcons
							name={'category'}
							size={Mixins.scaleFont(20)}
							color={Colors.WHITE}
						/>
						<Text style={styles.cardText}>
							{mostExpense?.category}
						</Text>
					</View>

					<View style={styles.row}>
						<MaterialIcons
							name={'account-balance-wallet'}
							size={Mixins.scaleFont(20)}
							color={Colors.WHITE}
						/>
						<Text style={styles.cardText}>
							{Helper.numberWithSeparator(mostExpense?.total)}
						</Text>
					</View>
				</View>
			)}
		</View>
  );
};

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
	},
	space: {
		justifyContent: 'space-between',
	},
	mostContent: {
		padding: Mixins.scaleSize(14),
	},
	maxCardContainer: {
		padding: Mixins.scaleSize(14),
		borderRadius: Mixins.scaleSize(6),
		marginBottom: Mixins.scaleSize(10),
		flex: 1,
	},
	maxDebit: {
		backgroundColor: Colors.SUCCESS,
	},
	maxCredit: {
		backgroundColor: Colors.ALERT,
	},
	cardTitle: {
		fontSize: Mixins.scaleFont(16),
		fontWeight: 'bold',
		color: Colors.WHITE,
		marginBottom: Mixins.scaleSize(5),
	},
	cardText: {
		fontSize: Mixins.scaleFont(16),
		textAlignVertical: 'center',
		color: Colors.WHITE,
		marginLeft: Mixins.scaleSize(5),
		marginBottom: Mixins.scaleSize(5),
	},
});

export default Layout;
