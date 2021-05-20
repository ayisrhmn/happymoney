import React, {useContext} from 'react';
import {View} from 'react-native';

import {useIsFocused} from '@react-navigation/native';
import container, {ContainerContext} from '@components/container';
import firebase from '@database/firebase';

import moment from 'moment';

import HomeHeader from './home-header';
import CardSummary from './card-summary';
import CardMost from './card-most';
import CardMenu from './card-menu';

type Props = {
  navigation: any;
};

const Layout: React.FC<Props> = (props) => {
  const {navigation} = props;

	const user = firebase.auth().currentUser;

	const isFocused = useIsFocused();

	const [refresh, setRefresh] = React.useState(false);
	const [dataUser, setDataUser] = React.useState({}) as any;
	const [category, setCategory] = React.useState([]) as any;
	const [data, setData] = React.useState([]) as any;

	const ctx = useContext(ContainerContext);

	React.useLayoutEffect(() => {
    ctx.setRefreshCallback({
      func: async () => {
        getData();
      },
    });

    return () => {};
  }, [navigation]); // eslint-disable-line react-hooks/exhaustive-deps

	React.useEffect(() => {
		if (isFocused) {
			getData();
		}

		return () => {};
	}, [navigation, isFocused]);

	const getData = () => {
		setRefresh(true);
		setDataUser({});
		setCategory([]);
		setData([]);

		firebase.database()
			.ref(`users/${user?.uid}/`)
			.once('value')
			.then(resDB => {
				if (resDB.val()) {
					setDataUser(resDB.val());
				}
			});

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

					setCategory(allData);
				}
			});

		firebase.database()
			.ref(`transactions/${user?.uid}/`)
			.once('value', (res) => {
				if (res.val()) {
					const dataRes = res.val();
					const allData = [] as any;

					Object.keys(dataRes).map((key) => {
            allData.push({
              id: key,
							title: dataRes[key].title,
							category: dataRes[key].category,
              total: dataRes[key].total,
              type: dataRes[key].type,
              date: dataRes[key].date,
            });
          });

					setData(allData);
				}
			})
			.then(() => setRefresh(false));
  };

	const sumData = {
		income:
			data
				.filter((v: any) => {
					const filterBy = {
						date: moment(v.date).format('MMMM YYYY') === moment().format('MMMM YYYY'),
						type: v.type === 'Income',
					}

					if (filterBy.date && filterBy.type) {
						return true;
					}

					return;
				})
				.reduce((i: any, o: any) => o.total + i, 0),
		expense:
			data
				.filter((v: any) => {
					const filterBy = {
						date: moment(v.date).format('MMMM YYYY') === moment().format('MMMM YYYY'),
						type: v.type === 'Expense',
					}

					if (filterBy.date && filterBy.type) {
						return true;
					}

					return;
				})
				.reduce((i: any, o: any) => o.total + i, 0),
	};

	// get most income function
	const calculateMostIncome = () => {
		let getData = [] as any;

		category.map((ct: any) => {
			let getIncome =
				data
					.filter((v: any) => {
						const filterBy = {
							date: moment(v.date).format('MMMM YYYY') === moment().format('MMMM YYYY'),
							type: v.type === 'Income',
							category: v.category === ct.category,
						}

						if (filterBy.date && filterBy.type && filterBy.category) {
							return true;
						}

						return;
					})
					.reduce((i: any, o: any) => o.total + i, 0);

			return getData = [
				...getData,
				{
					category: ct.category,
					total: getIncome,
				},
			];
		});

		return getData;
	};

	const getMostIncome = () => {
		let totalMax = Math.max.apply(
			Math, calculateMostIncome().map((o: any) => {
				return o.total;
			})
		);

		let mostIncome = calculateMostIncome().filter((o: any) => {
			return o.total == totalMax;
		});

		return mostIncome[0];
	};
	// end get most income function

	// get most expense function
	const calculateMostExpense = () => {
		let getData = [] as any;

		category.map((ct: any) => {
			let getExpense =
				data
					.filter((v: any) => {
						const filterBy = {
							date: moment(v.date).format('MMMM YYYY') === moment().format('MMMM YYYY'),
							type: v.type === 'Expense',
							category: v.category === ct.category,
						}

						if (filterBy.date && filterBy.type && filterBy.category) {
							return true;
						}

						return;
					})
					.reduce((i: any, o: any) => o.total + i, 0);

			return getData = [
				...getData,
				{
					category: ct.category,
					total: getExpense,
				},
			];
		});

		return getData;
	};

	const getMostExpense = () => {
		let totalMax = Math.max.apply(
			Math, calculateMostExpense().map((o: any) => {
				return o.total;
			})
		);

		let mostExpense = calculateMostExpense().filter((o: any) => {
			return o.total == totalMax;
		});

		return mostExpense[0];
	};
	// end get most credit function

  return (
    <View>
			<HomeHeader
				user={dataUser}
				navigation={navigation}
			/>

			<CardSummary
				data={sumData}
				refresh={refresh}
			/>

			<CardMost
				mostIncome={getMostIncome()}
				mostExpense={getMostExpense()}
			/>

			<CardMenu
				user={dataUser}
				category={category}
				navigation={navigation}
			/>
    </View>
  );
};

export default container(Layout);
