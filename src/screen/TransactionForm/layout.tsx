import React from 'react';
import {View, StyleSheet} from 'react-native';

import container from '@components/container';
import Input from '@components/input';
import Button from '@components/button';
import Select from '@components/select';
import {Colors, Mixins} from '@utils/index';

import moment from 'moment';

type Props = {
  navigation: any;
};

const Layout: React.FC<Props> = (props) => {
  const {navigation} = props;
	const [desc, setDesc] = React.useState('');
	const [total, setTotal] = React.useState({
		total: 0,
	});
	const [categoryData, setCategoryData] = React.useState([]) as any;
	const [category, setCategory] = React.useState('');
	const [typeData, setTypeData] = React.useState([]) as any;
	const [type, setType] = React.useState('');
	const [email, setEmail] = React.useState('');

	React.useEffect(() => {
		getData();

		return () => {};
	}, []);

	const getData = () => {
		setCategoryData([
			'Boarding House',
			'College',
			'Salary',
		]);

		setTypeData([
			'Debit',
			'Credit',
		]);
	};

  return (
    <View style={styles.container}>
			<View style={styles.inputWrapper}>
				<Input
					mode={'outlined'}
					name={'Transaction Description'}
					placeholder={'e.g. Watch a movie'}
					multiline={true}
					value={desc}
					onChangeText={text => setDesc(text)}
				/>
				<Select
					name={'Category'}
					placeholder={'Select your category transaction'}
					data={categoryData}
					closeOnSelection={true}
					// error={errors.category}
					onSelect={(text: string) => setCategory(text)}
				/>
				<Input
					mode={'outlined'}
					name={'Total Transactions'}
					placeholder={'e.g. 2.500.000'}
					value={total.total ? total.total.toString() : ''}
					keyboardType={'numeric'}
					onChangeText={text => setTotal({...total, total: parseInt(text)})}
				/>
				<Select
					name={'Type'}
					placeholder={'Select your type Debit or Credit'}
					data={typeData}
					closeOnSelection={true}
					// error={errors.category}
					onSelect={(text: string) => setType(text)}
				/>
				<Input
					mode={'outlined'}
					name={'Date Transaction'}
					placeholder={moment(new Date()).format('DD-MMM-YYYY')}
					value={email}
					onChangeText={text => setEmail(text)}
				/>
			</View>

			<Button
				uppercase={false}
				mode={'contained'}
				onPress={() => navigation.replace('SignIn')}
			>
				Submit
			</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
		padding: Mixins.scaleSize(12),
  },
	inputWrapper: {
		marginBottom: Mixins.scaleSize(30),
	},
	rightAct: {
		color: Colors.SECONDARY,
		fontSize: Mixins.scaleFont(16),
		marginRight: Mixins.scaleSize(10),
	},
});

export default container(Layout, true, Colors.WHITE);
