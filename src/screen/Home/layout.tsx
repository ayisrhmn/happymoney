import React, {useContext} from 'react';
import {View} from 'react-native';

import {useIsFocused} from '@react-navigation/native';
import container, {ContainerContext} from '@components/container';
import firebase from '@database/firebase';

import moment from 'moment';

import HomeHeader from './home-header';
import CardSummary from './card-summary';
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
		debit: data
			.filter((v: any) => {
				const filterBy = {
					date: moment(v.date).format('MMMM YYYY') === moment().format('MMMM YYYY'),
					type: v.type === 'Debit',
				}

				if (filterBy.date && filterBy.type) {
					return true;
				}

				return;
			})
			.reduce((i: any, o: any) => o.total + i, 0),
		credit: data
			.filter((v: any) => {
				const filterBy = {
					date: moment(v.date).format('MMMM YYYY') === moment().format('MMMM YYYY'),
					type: v.type === 'Credit',
				}

				if (filterBy.date && filterBy.type) {
					return true;
				}

				return;
			})
			.reduce((i: any, o: any) => o.total + i, 0),
	}

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

			<CardMenu
				user={dataUser}
				category={category}
				navigation={navigation}
			/>
    </View>
  );
};

export default container(Layout);
