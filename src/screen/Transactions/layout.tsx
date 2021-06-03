import React from 'react';
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	FlatList,
	BackHandler,
	ScrollView,
} from 'react-native';
import {TextInput, ActivityIndicator, RadioButton} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-modern-datepicker';
import {Modalize} from 'react-native-modalize';

import {useIsFocused} from '@react-navigation/native';
import container from '@components/container';
import Modal from '@components/modal';
import Card from '@components/card';
import Button from '@components/button';
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
	const [dataCategory, setDataCategory] = React.useState([]) as any;

	const [date, setDate] = React.useState(user.date);
	const [displayDate, setDisplayDate] = React.useState('');
	const [selectedMonth, setSelectedMonth] = React.useState(
    moment(user.date).format('YYYY/MM'),
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

		firebase.database()
			.ref(`category/${user?.uid}/`)
			.once('value', (res) => {
				if (res.val()) {
					const dataRes = res.val();
					const allData = [] as any;

					Object.keys(dataRes).map((key) => {
            allData.push({
              id: key,
              category: dataRes[key],
            });
          });

					setDataCategory(allData);
				}
			});
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

	// filter data
	const [selectedFilter, setSelectedFilter] = React.useState({
		sort: 'Oldest',
		type: '',
		category: '',
	});
	const [valFilter, setValFilter] = React.useState({
		sort: 'Oldest',
		type: '',
		category: '',
	});

	const filterData = () => {
		return data?.filter((item: any) => {
			const filterBy = {
				date: moment(item.transaction.date).format('MMMM YYYY') === displayDate,
				type: valFilter.type !== ''
					? item.transaction.type === valFilter.type
					: item.transaction.type,
				category: valFilter.category !== ''
					? item.transaction.category === valFilter.category
					: item.transaction.category,
			};

			if (filterBy.date && filterBy.type && filterBy.category) {
				return true;
			}

			return;
		}).sort((a: any, b: any) => {
			return (
				valFilter.sort === 'Oldest'
					? a.transaction.date < b.transaction.date ? -1 : 1
					: a.transaction.date > b.transaction.date ? -1 : 1
			);
		});
	};
	// end filter data

	// bottom sheet filter
	const filterRef = React.useRef<Modalize>(null);
  const filterOpen = () => {
    filterRef.current?.open();
  };
	const filterClose = () => {
    filterRef.current?.close();
  };

	const sortRef = React.useRef<Modalize>(null);
  const sortOpen = () => {
    sortRef.current?.open();
  };
	const sortClose = () => {
    sortRef.current?.close();
  };

	const categoryRef = React.useRef<Modalize>(null);
  const categoryOpen = () => {
    categoryRef.current?.open();
  };
	const categoryClose = () => {
    categoryRef.current?.close();
  };
	// end bottom sheet filter

	const sorting = () => {
		return dataCategory.sort((a: any, b: any) => {
			return a.category.toLowerCase() < b.category.toLowerCase() ? -1 : 1;
		});
	};

  return (
		<>
			<Modalize
				ref={filterRef}
				modalHeight={450}
				onOpen={() => {
					setSelectedFilter({
						sort: valFilter.sort,
						type: valFilter.type,
						category: valFilter.category,
					});
				}}
			>
				<View style={styles.panelContainer}>
					<View style={styles.panelHeader}>
						<Text style={styles.panelTitle}>
							Filter Transaction
						</Text>
						<TouchableOpacity
							onPress={() => {
								setSelectedFilter({
									sort: 'Oldest',
									type: '',
									category: '',
								});
							}}
						>
							<View style={
								selectedFilter.sort === 'Oldest'
									&& selectedFilter.type === ''
										&& selectedFilter.category === ''
											? [styles.removeFilter, styles.removeDefault]
											: [styles.removeFilter, styles.removeActive]
							}>
								<Text
									style={
										selectedFilter.sort === 'Oldest'
											&& selectedFilter.type === ''
												&& selectedFilter.category === ''
													? styles.removeLabel
													: styles.removeLabelActive
									}>
									Remove filter
								</Text>
							</View>
						</TouchableOpacity>
					</View>
					<View style={{marginTop: Mixins.scaleSize(20)}}>
						<View style={styles.contentSection}>
							<Text style={styles.contentTitle}>
								Sort
							</Text>
							<View style={{marginBottom: Mixins.scaleSize(8)}}>
								<RadioButton.Group
									onValueChange={value => {
										setSelectedFilter({
											...selectedFilter,
											sort: value,
										});
									}}
									value={selectedFilter.sort}
								>
									<RadioButton.Item
										style={styles.radioContainer}
										labelStyle={styles.radioLabel}
										label={'Oldest'}
										value={'Oldest'}
									/>
									<RadioButton.Item
										style={styles.radioContainer}
										labelStyle={styles.radioLabel}
										label={'Newest'}
										value={'Newest'}
									/>
								</RadioButton.Group>
							</View>
						</View>
						<View style={styles.contentSection}>
							<Text style={styles.contentTitle}>
								Type
							</Text>
							<View style={{marginBottom: Mixins.scaleSize(8)}}>
								<RadioButton.Group
									onValueChange={value => {
										setSelectedFilter({
											...selectedFilter,
											type: value,
										});
									}}
									value={selectedFilter.type}
								>
									<RadioButton.Item
										style={styles.radioContainer}
										labelStyle={styles.radioLabel}
										label={'Income'}
										value={'Income'}
									/>
									<RadioButton.Item
										style={styles.radioContainer}
										labelStyle={styles.radioLabel}
										label={'Expense'}
										value={'Expense'}
									/>
								</RadioButton.Group>
							</View>
						</View>
						<View style={[styles.contentSection, {borderBottomWidth: 0}]}>
							<Text style={[styles.contentTitle, {marginBottom: Mixins.scaleSize(18)}]}>
								Category
							</Text>
							<View style={styles.filterCategory}>
								{sorting().map((item: any) => (
									<TouchableOpacity
										onPress={() => {
											let found = [selectedFilter.category].find((v: any) => {
												return v === item.category;
											});

											if (found) {
												setSelectedFilter({
													...selectedFilter,
													category: '',
												});
											} else {
												setSelectedFilter({
													...selectedFilter,
													category: item.category,
												});
											}
										}}
										key={item.id}
									>
										<View style={
											selectedFilter.category === item.category
												? [styles.filterXS, styles.filterXSActive]
												: [styles.filterXS, styles.filterXSDefault]
										}>
											<Text
												style={
													selectedFilter.category === item.category
														? styles.filterXSLabelActive
														: styles.filterXSLabel
													}>
												{item.category}
											</Text>
										</View>
									</TouchableOpacity>
								))}
							</View>
						</View>
						<Button
							uppercase={false}
							mode={'contained'}
							onPress={() => {
								setValFilter({
									sort: selectedFilter.sort,
									type: selectedFilter.type,
									category: selectedFilter.category,
								});
								filterClose();
							}}
							style={{marginHorizontal: Mixins.scaleSize(14)}}
						>
							Use filter
						</Button>
					</View>
				</View>
			</Modalize>

			<Modalize
				ref={sortRef}
				modalHeight={160}
				onOpen={() => {
					setSelectedFilter({
						sort: valFilter.sort,
						type: valFilter.type,
						category: valFilter.category,
					});
				}}
			>
				<View style={styles.panelContainer}>
					<View style={styles.panelHeader}>
						<Text style={styles.panelTitle}>
							Sort Transaction
						</Text>
					</View>
					<View style={{marginTop: Mixins.scaleSize(20)}}>
						<View style={[styles.contentSection, {borderBottomWidth: 0}]}>
							<View style={{marginBottom: Mixins.scaleSize(8)}}>
								<RadioButton.Group
									onValueChange={value => {
										setSelectedFilter({
											...selectedFilter,
											sort: value,
										});
										setValFilter({
											...valFilter,
											sort: value,
										});
										sortClose();
									}}
									value={selectedFilter.sort}
								>
									<RadioButton.Item
										style={styles.radioContainer}
										labelStyle={styles.radioLabel}
										label={'Oldest'}
										value={'Oldest'}
									/>
									<RadioButton.Item
										style={styles.radioContainer}
										labelStyle={styles.radioLabel}
										label={'Newest'}
										value={'Newest'}
									/>
								</RadioButton.Group>
							</View>
						</View>
					</View>
				</View>
			</Modalize>

			<Modalize
				ref={categoryRef}
				modalHeight={240}
				onOpen={() => {
					setSelectedFilter({
						sort: valFilter.sort,
						type: valFilter.type,
						category: valFilter.category,
					});
				}}
			>
				<View style={styles.panelContainer}>
					<View style={styles.panelHeader}>
						<Text style={styles.panelTitle}>
							Filter Transaction by Category
						</Text>
					</View>
					<View style={{marginTop: Mixins.scaleSize(20)}}>
						<View style={[styles.contentSection, {borderBottomWidth: 0}]}>
							<View style={styles.filterCategory}>
								{sorting().map((item: any) => (
									<TouchableOpacity
										onPress={() => {
											setSelectedFilter({
												...selectedFilter,
												category: item.category,
											});
											setValFilter({
												...valFilter,
												category: item.category,
											});
											categoryClose();
										}}
										key={item.id}
									>
										<View style={
											selectedFilter.category === item.category
												? [styles.filterXS, styles.filterXSActive]
												: [styles.filterXS, styles.filterXSDefault]
										}>
											<Text
												style={
													selectedFilter.category === item.category
														? styles.filterXSLabelActive
														: styles.filterXSLabel
													}>
												{item.category}
											</Text>
										</View>
									</TouchableOpacity>
								))}
							</View>
						</View>
					</View>
				</View>
			</Modalize>

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
						onPress={() => filterOpen()}
					>
						<View style={
							valFilter.sort === 'Oldest'
								&& valFilter.type === ''
									&& valFilter.category === ''
										? [styles.filterButton, styles.filterDefault]
										: [styles.filterButton, styles.filterActive]
							}>
							<MaterialIcons
								name={'filter-list'}
								size={Mixins.scaleFont(18)}
								color={
									valFilter.sort === 'Oldest'
										&& valFilter.type === ''
											&& valFilter.category === ''
												? Colors.BLACK
												: Colors.WHITE
								}
							/>
							<Text
								style={
									valFilter.sort === 'Oldest'
										&& valFilter.type === ''
											&& valFilter.category === ''
												? styles.filterLabel
												: styles.filterLabelActive
								}>
								{' '}Filter
							</Text>
						</View>
					</TouchableOpacity>
					<ScrollView
						horizontal={true}
						showsHorizontalScrollIndicator={false}
					>
						<TouchableOpacity
							onPress={() => {
								let found = [valFilter.type].find((v: any) => {
									return v === 'Income';
								});

								if (found) {
									setValFilter({
										...valFilter,
										type: '',
									});
									setSelectedFilter({
										...valFilter,
										type: '',
									});
								} else {
									setValFilter({
										...valFilter,
										type: 'Income',
									});
									setSelectedFilter({
										...valFilter,
										type: 'Income',
									});
								}
							}}
						>
							<View style={
								valFilter.type === 'Income'
									? [styles.filterButton, styles.filterActive]
									: [styles.filterButton, styles.filterDefault]
								}>
								<MaterialIcons
									name={'trending-up'}
									size={Mixins.scaleFont(18)}
									color={
										valFilter.type === 'Income'
											? Colors.WHITE
											: Colors.BLACK
									}
								/>
								<Text
									style={
										valFilter.type === 'Income'
											? styles.filterLabelActive
											: styles.filterLabel
										}>
									{' '}Income
								</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								let found = [valFilter.type].find((v: any) => {
									return v === 'Expense';
								});

								if (found) {
									setValFilter({
										...valFilter,
										type: '',
									});
									setSelectedFilter({
										...valFilter,
										type: '',
									});
								} else {
									setValFilter({
										...valFilter,
										type: 'Expense',
									});
									setSelectedFilter({
										...valFilter,
										type: 'Expense',
									});
								}
							}}
						>
							<View style={
								valFilter.type === 'Expense'
									? [styles.filterButton, styles.filterActive]
									: [styles.filterButton, styles.filterDefault]
								}>
								<MaterialIcons
									name={'trending-down'}
									size={Mixins.scaleFont(18)}
									color={
										valFilter.type === 'Expense'
											? Colors.WHITE
											: Colors.BLACK
									}
								/>
								<Text
									style={
										valFilter.type === 'Expense'
											? styles.filterLabelActive
											: styles.filterLabel
										}>
									{' '}Expense
								</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => sortOpen()}
						>
							<View style={
								valFilter.sort === 'Newest'
									? [styles.filterButton, styles.filterActive]
									: [styles.filterButton, styles.filterDefault]
							}>
								<MaterialIcons
									name={'keyboard-arrow-down'}
									size={Mixins.scaleFont(18)}
									color={
										valFilter.sort === 'Newest'
											? Colors.WHITE
											: Colors.BLACK
									}
								/>
								<Text
									style={
										valFilter.sort === 'Newest'
											? styles.filterLabelActive
											: styles.filterLabel
									}>
									{' '}Sort
								</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => categoryOpen()}
						>
							<View style={
								valFilter.category !== ''
								? [styles.filterButton, styles.filterActive]
								: [styles.filterButton, styles.filterDefault]
							}>
								<MaterialIcons
									name={'category'}
									size={Mixins.scaleFont(18)}
									color={
										valFilter.category !== ''
											? Colors.WHITE
											: Colors.BLACK
									}
								/>
								<Text
									style={
										valFilter.category !== ''
											? styles.filterLabelActive
											: styles.filterLabel
									}>
									{' '}Category
								</Text>
							</View>
						</TouchableOpacity>
					</ScrollView>
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
											item.transaction.type === 'Income'
											? [styles.cardValue, styles.valueIncome]
											: [styles.cardValue, styles.valueExpense]
										}>
											{Helper.numberWithSeparator(item.transaction.total)}
										</Text>

										<View style={
											item.transaction.type === 'Income'
											? [styles.statusBadge, styles.badgeIncome]
											: [styles.statusBadge, styles.badgeExpense]
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
		</>
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
		paddingLeft: Mixins.scaleSize(12),
		marginBottom: Mixins.scaleSize(10),
	},
	filterButton: {
		flexDirection: 'row',
		borderColor: Colors.BLACK,
		borderWidth: Mixins.scaleSize(1),
		borderRadius: Mixins.scaleSize(50),
		paddingVertical: Mixins.scaleSize(5),
		paddingHorizontal: Mixins.scaleSize(12),
		marginRight: Mixins.scaleSize(8),
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
	panelContainer: {
		paddingTop: Mixins.scaleSize(24),
		paddingBottom: Mixins.scaleSize(14),
	},
	panelHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: Mixins.scaleSize(14),
	},
	panelTitle: {
		fontSize: Mixins.scaleFont(18),
		fontWeight: 'bold',
		color: Colors.BLACK,
	},
	removeFilter: {
		flexDirection: 'row',
		borderColor: Colors.SHADES.dark[50],
		borderWidth: Mixins.scaleSize(1),
		borderRadius: Mixins.scaleSize(50),
		paddingVertical: Mixins.scaleSize(4),
		paddingHorizontal: Mixins.scaleSize(10),
		marginRight: Mixins.scaleSize(8),
	},
	removeDefault: {
		backgroundColor: Colors.WHITE,
	},
	removeActive: {
		backgroundColor: Colors.ALERT,
		borderColor: Colors.ALERT,
	},
	removeLabel: {
		textAlign: 'center',
		textAlignVertical: 'center',
		fontSize: Mixins.scaleFont(12),
		fontWeight: 'bold',
		color: Colors.SHADES.dark[50],
	},
	removeLabelActive: {
		textAlign: 'center',
		textAlignVertical: 'center',
		fontSize: Mixins.scaleFont(12),
		color: Colors.WHITE,
	},
	contentSection: {
		borderBottomWidth: 1,
		borderBottomColor: Colors.SHADES.dark[40],
		marginBottom: Mixins.scaleSize(14),
	},
	contentTitle: {
		fontSize: Mixins.scaleFont(14),
		fontWeight: 'bold',
		color: Colors.BLACK,
		paddingHorizontal: Mixins.scaleSize(14),
		marginBottom: Mixins.scaleSize(8),
	},
	radioContainer: {
		marginVertical: Mixins.scaleSize(-8),
	},
	radioLabel: {
		fontSize: Mixins.scaleFont(14),
		color: Colors.BLACK,
	},
	filterXS: {
		flexDirection: 'row',
		borderColor: Colors.BLACK,
		borderWidth: Mixins.scaleSize(1),
		borderRadius: Mixins.scaleSize(50),
		paddingVertical: Mixins.scaleSize(4),
		paddingHorizontal: Mixins.scaleSize(10),
		marginRight: Mixins.scaleSize(8),
		marginBottom: Mixins.scaleSize(8),
	},
	filterXSDefault: {
		backgroundColor: Colors.WHITE,
	},
	filterXSActive: {
		backgroundColor: Colors.PRIMARY,
	},
	filterXSLabel: {
		textAlign: 'center',
		textAlignVertical: 'center',
		fontSize: Mixins.scaleFont(12),
		fontWeight: 'bold',
		color: Colors.BLACK,
	},
	filterXSLabelActive: {
		textAlign: 'center',
		textAlignVertical: 'center',
		fontSize: Mixins.scaleFont(12),
		color: Colors.WHITE,
	},
	filterCategory: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginBottom: Mixins.scaleSize(8),
		marginHorizontal: Mixins.scaleSize(14),
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
	valueIncome: {
		color: Colors.SUCCESS,
	},
	valueExpense: {
		color: Colors.ALERT,
	},
	statusBadge: {
		paddingVertical: Mixins.scaleSize(5),
		borderRadius: Mixins.scaleSize(50),
		marginTop: Mixins.scaleSize(6),
		position: 'absolute',
		width: Mixins.scaleSize(76),
		right: 12,
		top: 38,
	},
	badgeIncome: {
		backgroundColor: Colors.SUCCESS,
	},
	badgeExpense: {
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
