import React from 'react';
import {View} from 'react-native';

import container from '@components/container';

import HomeHeader from './home-header';
import CardSummary from './card-summary';
import CardTransactions from './card-transactions';

type Props = {
  navigation: any;
};

const Layout: React.FC<Props> = (props) => {
  const {navigation} = props;

	const user_data = {
		name: 'Muhammad Fariz Rahman'
	};

	const summary_data = {
		date: new Date(),
		balance: 5760000,
		debit: 5760000,
		credit: 500000,
	}

	React.useEffect(() => {

    return () => {};
  }, [navigation]);

  return (
    <View>
			<HomeHeader data={user_data} navigation={navigation} />

      <CardSummary data={summary_data} />

      <CardTransactions navigation={navigation} />
    </View>
  );
};

export default container(Layout);
