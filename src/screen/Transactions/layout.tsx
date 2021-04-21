import React from 'react';
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	FlatList,
	BackHandler,
} from 'react-native';
import {TextInput, ActivityIndicator} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-modern-datepicker';

import {useIsFocused} from '@react-navigation/native';
import container from '@components/container';
import Modal from '@components/modal';
import Card from '@components/card';
import {Colors, Helper, Mixins} from '@utils/index';
import firebase from '@database/firebase';

import moment from 'moment';

type Props = {
  navigation: any;
	route: any;
};

const Layout: React.FC<Props> = (props) => {
  const {navigation, route} = props;

	const user = route.params;

	React.useEffect(() => {
		const backAction = () => {
      navigation.navigate('Home');

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

	const isFocused = useIsFocused();

	const [refresh, setRefresh] = React.useState(false);
	const [data, setData] = React.useState([]) as any;

	const [filter, setFilter] = React.useState('All');
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
						onPress={() => navigation.navigate('TransactionForm', user)}
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
		if (isFocused) {
			setDate(date);
			setDisplayDate(moment(date).format('MMMM YYYY'));
			setSelectedMonth(moment(date).format('YYYY/MM'));
			getData();
		}

    return () => {};
  }, [navigation, isFocused]);

	const getData = () => {
		setRefresh(true);
		setData([]);

		firebase.database()
			.ref(`transactions/${user?.uid}/`)
			.once('value', (res) => {
				if (res.val()) {
					const dataRes = res.val();
					const allData = [] as any;

					Object.keys(dataRes).map((key) => {
            allData.push({
              id: key,
              transaction: dataRes[key],
            });
          });

					setData(allData);
				}
			})
			.then(() => setRefresh(false));
	};

	const handleConfirm = (date: any) => {
    setSelectedMonth(date.replace(' ', '/'));
    const DateString2Date = new Date(date.replace(' ', '-') + '-01');
    const displayDateFormat = moment(DateString2Date)
      .locale('en')
      .format('MMMM YYYY');
    setDisplayDate(displayDateFormat);
    setDate(DateString2Date);
    setDatePickerShow(false);
		getData();
  };

	const filterData = () => {
		return data?.filter((item: any) => {
			const filterBy = {
				date: moment(item.transaction.date).format('MMMM YYYY') === displayDate,
				type: filter !== 'All'
					? item.transaction.type === filter
					: item.transaction.type,
			};

			if (filterBy.date && filterBy.type) {
				return true;
			}

			return;
		}).sort((a: any, b: any) => {
			return a.transaction.date < b.transaction.date ? -1 : 1;
		});
	};

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
						onMonthYearChange={(selectedDate: any) => handleConfirm(selectedDate)}
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
					{filterData().length === 0 && (
						<Text style={styles.textEmpty}>
							No transaction available
						</Text>
					) || (
						<FlatList
							data={filterData()}
							keyExtractor={item => item.id}
							refreshing={refresh}
							onRefresh={getData}
							renderItem={({item}) => (
								<Card
									style={[
										styles.row,
										styles.cardContainer,
										{justifyContent: 'space-between'},
									]}
									onPress={() => {
										navigation.navigate('TransactionDetail', {
											user: {
												...user,
											},
											data: {
												id: item.id,
												title: item.transaction.title,
												desc: item.transaction.desc,
												category: item.transaction.category,
												total: item.transaction.total.toString(),
												type: item.transaction.type,
												date: item.transaction.date,
											},
										});
									}}
								>
									<View>
										<Text style={styles.cardTitle}>
											{item.transaction.title}
										</Text>

										<View style={styles.row}>
											<MaterialIcons
												name={'category'}
												size={Mixins.scaleFont(18)}
												color={Colors.SHADES.dark[50]}
											/>
											<Text style={styles.cardText}>
												{item.transaction.category}
											</Text>
										</View>

										<View style={styles.row}>
											<MaterialIcons
												name={'access-time'}
												size={Mixins.scaleFont(18)}
												color={Colors.SHADES.dark[50]}
											/>
											<Text style={styles.cardText}>
												{moment(item.transaction.date).format('DD-MMM-YYYY')}
											</Text>
										</View>
									</View>

									<Text style={
										item.transaction.type === 'Debit'
										? [styles.cardValue, styles.valueDebit]
										: [styles.cardValue, styles.valueCredit]
									}>
										{Helper.numberWithSeparator(item.transaction.total)}
									</Text>

									<View style={
										item.transaction.type === 'Debit'
										? [styles.statusBadge, styles.badgeDebit]
										: [styles.statusBadge, styles.badgeCredit]
									}>
										<Text style={styles.statusText}>
											{item.transaction.type}
										</Text>
									</View>
								</Card>
							)}
						/>
					)}
				</>
			)}
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
	textEmpty: {
		flex: 1,
		textAlign: 'center',
		fontSize: Mixins.scaleFont(18),
		color: Colors.BLACK,
	},
});

export default container(Layout, false);
