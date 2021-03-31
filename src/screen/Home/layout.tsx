import React from 'react';
import {View} from 'react-native';

import container from '@components/container';

import HomeHeader from './home-header';
import CardSummary from './card-summary';
import CardCategory from './card-category';
import CardTransactions from './card-transactions';

type Props = {
  navigation: any;
};

const Layout: React.FC<Props> = (props) => {
  const {navigation} = props;

	const dummyData = {
		user_data: {
			name: 'Muhammad Fariz Rahman',
		},
		summary_data: {
			date: new Date(),
			balance: 5760000,
			debit: 5760000,
			credit: 500000,
		}
	}

	React.useEffect(() => {

    return () => {};
  }, [navigation]);

  return (
    <View>
			<HomeHeader data={dummyData} navigation={navigation} />

      <CardSummary data={dummyData} />

      <CardCategory navigation={navigation} />

			<CardTransactions navigation={navigation} />
    </View>
  );
};

export default container(Layout);
