import React from 'react';
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	ScrollView,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-modern-datepicker';

import container from '@components/container';
import Modal from '@components/modal';
import Card from '@components/card';
import {Colors, Helper, Mixins} from '@utils/index';

import moment from 'moment';

type Props = {
  navigation: any;
};

const Layout: React.FC<Props> = (props) => {
  const {navigation} = props;

	const [filter, setFilter] = React.useState('All')
	const [date, setDate] = React.useState(new Date());
	const [displayDate, setDisplayDate] = React.useState('');
	const [selectedMonth, setSelectedMonth] = React.useState(
    moment().format('YYYY/MM'),
  );
	const [isDatePickerShow, setDatePickerShow] = React.useState(false);

	React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
				return (
					<TouchableOpacity
						onPress={() => console.warn('goes to add transactions')}
					>
						<MaterialIcons
							name={'add'}
							size={Mixins.scaleFont(26)}
							color={Colors.WHITE}
						/>
					</TouchableOpacity>
				);
      },
    });

    return () => {};
  }, [navigation]);

	React.useEffect(() => {
		setDate(date);
		setDisplayDate(moment(date).format('MMMM YYYY'));
		setSelectedMonth(moment(date).format('YYYY/MM'));

    return () => {};
  }, [navigation]);

	const handleConfirm = (date: any) => {
    setSelectedMonth(date.replace(' ', '/'));
    const DateString2Date = new Date(date.replace(' ', '-') + '-01');
    const displayDateFormat = moment(DateString2Date)
      .locale('en')
      .format('MMMM YYYY');
    setDisplayDate(displayDateFormat);
    setDate(DateString2Date);
    setDatePickerShow(false);
  };

	const dummyData = [
		{
			title: 'Monthly salary',
			category: 'Salary',
			type: 'Debit',
			value: 6000000,
			created_on: new Date(),
		},
		{
			title: 'Pay boarding',
			category: 'Boarding House',
			type: 'Credit',
			value: 650000,
			created_on: new Date(),
		},
		{
			title: 'Pay college fees',
			category: 'College',
			type: 'Credit',
			value: 1300000,
			created_on: new Date(),
		},
	];

  return (
		<View style={styles.container}>
			<View style={[styles.row, styles.titleContainer]}>
				<Text style={styles.title}>
					List Transactions
				</Text>

				<TouchableOpacity onPress={() => setDatePickerShow(true)}>
					<TextInput
						mode={'flat'}
						value={displayDate}
						style={styles.inputDate}
						editable={false}
					/>
				</TouchableOpacity>

				<Modal
					show={isDatePickerShow}
					loading={false}
					onClose={() => setDatePickerShow(false)}>
					<DatePicker
						mode="monthYear"
						selectorStartingYear={2000}
						current={selectedMonth}
						onMonthYearChange={(selectedDate) => handleConfirm(selectedDate)}
						options={{
							textHeaderColor: Colors.PRIMARY,
							mainColor: Colors.PRIMARY,
						}}
					/>
				</Modal>
			</View>

			<View style={styles.filterContainer}>
				<TouchableOpacity
					onPress={() => setFilter('All')}
				>
					<View style={filter === 'All' && [
						styles.filterButton,
						styles.filterActive
					] || [
						styles.filterButton,
						styles.filterDefault
					]}>
						<Text
							style={filter === 'All'
								? styles.filterLabelActive
								: styles.filterLabel}>
							All
						</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => setFilter('Debit')}
				>
					<View style={filter === 'Debit' && [
						styles.filterButton,
						styles.filterActive
					] || [
						styles.filterButton,
						styles.filterDefault
					]}>
						<Text
							style={filter === 'Debit'
								? styles.filterLabelActive
								: styles.filterLabel}>
							Debit
						</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => setFilter('Credit')}
				>
					<View style={filter === 'Credit' && [
						styles.filterButton,
						styles.filterActive
					] || [
						styles.filterButton,
						styles.filterDefault
					]}>
						<Text
							style={filter === 'Credit'
								? styles.filterLabelActive
								: styles.filterLabel}>
							Credit
						</Text>
					</View>
				</TouchableOpacity>
			</View>

			<ScrollView>
				{dummyData
					.filter((data: any) =>
						filter === 'All'
						? data.type
						: data.type === filter
					)
					.map((data: any, i: number) => (
					<Card
						style={[
							styles.row,
							styles.cardContainer,
							{justifyContent: 'space-between'},
						]}
						key={i}
						onPress={() => console.warn(data.title)}
					>
						<View>
							<Text style={styles.cardTitle}>
								{data.title}
							</Text>

							<View style={styles.row}>
								<MaterialIcons
									name={'category'}
									size={Mixins.scaleFont(18)}
									color={Colors.SHADES.dark[50]}
								/>
								<Text style={styles.cardText}>
									{data.category}
								</Text>
							</View>

							<View style={styles.row}>
								<MaterialIcons
									name={'access-time'}
									size={Mixins.scaleFont(18)}
									color={Colors.SHADES.dark[50]}
								/>
								<Text style={styles.cardText}>
									{moment(data.created_on).fromNow()}
								</Text>
							</View>
						</View>

						<Text style={
							data.type === 'Debit'
							? [styles.cardValue, styles.valueDebit]
							: [styles.cardValue, styles.valueCredit]
						}>
							{Helper.numberWithSeparator(data.value)}
						</Text>

						<View style={
							data.type === 'Debit'
							? [styles.statusBadge, styles.badgeDebit]
							: [styles.statusBadge, styles.badgeCredit]
						}>
							<Text style={styles.statusText}>
								{data.type}
							</Text>
						</View>
					</Card>
				))}
			</ScrollView>
		</View>
  );
};

const styles = StyleSheet.create({
  container: {
		flex: 1,
  },
	row: {
		flexDirection: 'row',
	},
	titleContainer: {
		justifyContent: 'space-between',
		paddingVertical: Mixins.scaleSize(12),
		paddingHorizontal: Mixins.scaleSize(12),
		marginBottom: Mixins.scaleSize(6),
	},
	title: {
		fontSize: Mixins.scaleFont(16),
		fontWeight: 'bold',
		color: Colors.BLACK,
		textAlignVertical: 'center',
	},
	inputDate: {
		backgroundColor: 'transparent',
		height: Mixins.scaleSize(32),
		maxHeight: Mixins.scaleSize(32),
		fontSize: Mixins.scaleFont(16),
		color: Colors.BLACK,
	},
	filterContainer: {
		flexDirection: 'row',
		paddingHorizontal: Mixins.scaleSize(12),
		marginBottom: Mixins.scaleSize(10),
	},
	filterButton: {
		borderColor: Colors.BLACK,
		borderWidth: Mixins.scaleSize(1),
		borderRadius: Mixins.scaleSize(50),
		paddingVertical: Mixins.scaleSize(5),
		paddingHorizontal: Mixins.scaleSize(24),
		marginRight: Mixins.scaleSize(12),
	},
	filterDefault: {
		backgroundColor: Colors.WHITE,
	},
	filterActive: {
		backgroundColor: Colors.PRIMARY,
	},
	filterLabel: {
		textAlign: 'center',
		textAlignVertical: 'center',
		fontSize: Mixins.scaleFont(14),
		color: Colors.BLACK,
	},
	filterLabelActive: {
		textAlign: 'center',
		textAlignVertical: 'center',
		fontSize: Mixins.scaleFont(14),
		color: Colors.WHITE,
	},
	cardContainer: {
		marginHorizontal: Mixins.scaleSize(12),
		marginBottom: Mixins.scaleSize(10),
	},
	cardTitle: {
		fontSize: Mixins.scaleFont(16),
		color: Colors.BLACK,
		marginBottom: Mixins.scaleSize(5),
	},
	cardText: {
		fontSize: Mixins.scaleFont(14),
		textAlignVertical: 'center',
		color: Colors.SHADES.dark[50],
		marginLeft: Mixins.scaleSize(5),
		marginBottom: Mixins.scaleSize(5),
	},
	cardValue: {
		fontSize: Mixins.scaleFont(16),
		fontWeight: 'bold',
		textAlign: 'right',
	},
	valueDebit: {
		color: Colors.SUCCESS,
	},
	valueCredit: {
		color: Colors.ALERT,
	},
	statusBadge: {
		paddingVertical: Mixins.scaleSize(5),
		borderRadius: Mixins.scaleSize(50),
		marginTop: Mixins.scaleSize(6),
		position: 'absolute',
		width: Mixins.scaleSize(64),
		right: 12,
		top: 38,
	},
	badgeDebit: {
		backgroundColor: Colors.SUCCESS,
	},
	badgeCredit: {
		backgroundColor: Colors.ALERT,
	},
	statusText: {
		fontSize: Mixins.scaleSize(14),
		fontWeight: 'bold',
		textAlign: 'center',
		color: Colors.WHITE,
	},
});

export default container(Layout, false);
