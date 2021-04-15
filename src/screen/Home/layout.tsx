import React, {useContext} from 'react';
import {View} from 'react-native';

import {useIsFocused} from '@react-navigation/native';
import container, {ContainerContext} from '@components/container';
import firebase from '@database/firebase';

import HomeHeader from './home-header';
import CardSummary from './card-summary';
import CardMenu from './card-menu';

type Props = {
  navigation: any;
};

const Layout: React.FC<Props> = (props) => {
  const {navigation} = props;

	const ctx = useContext(ContainerContext);

	const isFocused = useIsFocused();

	const [refresh, setRefresh] = React.useState(false);
	const [user, setUser] = React.useState({}) as any;

	React.useLayoutEffect(() => {
    ctx.setRefreshCallback({
      func: async () => {
        getUserData();
      },
    });

    return () => {};
  }, [navigation]); // eslint-disable-line react-hooks/exhaustive-deps

	React.useEffect(() => {
		if (isFocused) {
			getUserData();
		}

		return () => {};
	}, [navigation, isFocused]);

	const getUserData = () => {
		setRefresh(true);

		const user = firebase.auth().currentUser;

		firebase.database()
			.ref(`users/${user?.uid}/`)
			.once('value')
			.then(resDB => {
				if (resDB.val()) {
					setUser(resDB.val());
				}
			})
			.finally(() => setRefresh(false));
  };

	const dummyData = {
		summary_data: {
			date: new Date(),
			balance: 5760000,
			debit: 5760000,
			credit: 500000,
		}
	}

  return (
    <View>
			<HomeHeader
				user={user}
				navigation={navigation}
			/>

			<CardSummary
				data={dummyData}
				refresh={refresh}
			/>

			<CardMenu
				user={user}
				navigation={navigation}
			/>
    </View>
  );
};

export default container(Layout);
