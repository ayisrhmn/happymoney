import React from 'react';
import {View, StyleSheet} from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {useForm} from 'react-hook-form';
import {showMessage} from 'react-native-flash-message';

import container from '@components/container';
import Input from '@components/input';
import Button from '@components/button';
import Select from '@components/select';
import {Colors, Mixins} from '@utils/index';
import firebase from '@database/firebase';

import moment from 'moment';

type Props = {
  navigation: any;
	route: any;
};

const Layout: React.FC<Props> = (props) => {
  const {navigation, route} = props;

	const user = route.params;

	const [dataCategory, setDataCategory] = React.useState([]) as any;
	const [showDatePicker, setShowDatePicker] = React.useState(false);
	const [dateValue, setDateValue] = React.useState(new Date());
	const [modalDate, setModalDate] = React.useState('');

	const [desc, setDesc] = React.useState('');

	React.useEffect(() => {
		getData();

		return () => {};
	}, []);

	const confirmDatePicker = (d: Date) => {
    setShowDatePicker(false);
    const displayD = moment(d).format('DD-MMM-YYYY');
    setModalDate(displayD);
    setDateValue(d);
  };

	const getData = () => {
		setModalDate(moment().format('DD-MMM-YYYY'));

		firebase.database()
			.ref(`category/${user?.uid}/`)
			.once('value', (res) => {
				if (res.val()) {
					const dataRes = res.val();
					const allData = [] as any;

					Object.keys(dataRes).map((key) => {
            allData.push(dataRes[key]);
          });

					setDataCategory(allData);
				}
			});
	};

	const typeData = [
		'Debit',
		'Credit',
	];

	const {
		register,
		handleSubmit,
		setValue,
		formState: {errors},
	} = useForm();

	React.useEffect(() => {
    register('title', {required: 'This field is required'});
    register('category', {required: 'This field has not been selected'});
    register('total', {required: 'This field is required'});
    register('type', {required: 'This field has not been selected'});

    return () => {};
  }, [register]);

	const onSubmit = (val: any) => {
		let data = {
			title: val.title,
			desc: desc,
			category: val.category,
			total: val.total,
			type: val.type,
			date: modalDate,
		};

		firebase.database()
			.ref(`transactions/${user?.uid}/`)
			.push(data)
			.then(() => {
				showMessage({
					message: 'Transactions added successfully.',
					type: 'success',
				});
				navigation.replace('Transactions', user);
			})
			.catch((error) => {
				showMessage({
					message: error.message,
					type: 'danger',
				});
			});
	};

  return (
    <View style={styles.container}>
			<View style={styles.inputWrapper}>
				<Input
					mode={'outlined'}
					name={'Title Transactions'}
					placeholder={'e.g. Saturday Night Date'}
					onChangeText={text => {
						setValue('title', text, {shouldValidate: true});
					}}
					error={errors.title}
				/>

				<Input
					mode={'outlined'}
					name={'Description (Optional)'}
					placeholder={'e.g. Watch a movie in 21 Cinema'}
					multiline={true}
					onChangeText={text => {
						setDesc(text);
					}}
				/>

				<Select
					name={'Category'}
					placeholder={'Select your category transaction'}
					data={dataCategory}
					closeOnSelection={true}
					onSelect={(text: string) => {
						setValue('category', text, {shouldValidate: true});
					}}
					error={errors.category}
				/>

				<Input
					mode={'outlined'}
					name={'Total Transactions'}
					placeholder={'e.g. 2.500.000'}
					keyboardType={'numeric'}
					onChangeText={text => {
						setValue('total', parseInt(text), {shouldValidate: true});
					}}
					error={errors.total}
				/>

				<Select
					name={'Type'}
					placeholder={'Select your type Debit or Credit'}
					data={typeData}
					closeOnSelection={true}
					onSelect={(text: string) => {
						setValue('type', text, {shouldValidate: true});
					}}
					error={errors.type}
				/>

				<Input
					mode={'outlined'}
					date={true}
					name={'Date Transaction'}
					value={modalDate}
					onPress={() => setShowDatePicker(true)}
				/>

				<DateTimePickerModal
					isVisible={showDatePicker}
					date={dateValue}
					mode={'date'}
					onConfirm={confirmDatePicker}
					onCancel={() => setShowDatePicker(false)}
				/>
			</View>

			<Button
				uppercase={false}
				mode={'contained'}
				onPress={() => handleSubmit(onSubmit)()}
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
});

export default container(Layout, true, Colors.WHITE);
