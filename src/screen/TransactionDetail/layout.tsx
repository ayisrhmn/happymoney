import React from 'react';
import {View, StyleSheet, BackHandler} from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {useForm, Controller} from 'react-hook-form';
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

	const detail = route.params;

	React.useEffect(() => {
		const backAction = () => {
      navigation.navigate('Transactions', detail.user);

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

	const [dataDetail, setDataDetail] = React.useState({}) as any;

	const [dataCategory, setDataCategory] = React.useState([]) as any;
	const [showDatePicker, setShowDatePicker] = React.useState(false);
	const [dateValue, setDateValue] = React.useState(new Date(detail.data?.date));
	const [modalDate, setModalDate] = React.useState('');

	const [disabled, setDisabled] = React.useState(true);

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
		setDataDetail(detail?.data);
		setModalDate(moment(detail.data?.date).format('DD-MMM-YYYY'));

		firebase.database()
			.ref(`category/${detail.user?.uid}/`)
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
		handleSubmit,
		formState: {errors},
		control,
	} = useForm();

	const errorMessage = {
    form: 'This field is required',
    select: 'This field has not been selected',
  };

	const onSubmit = () => {
		let newData = {
			id: detail.data?.id,
			title: dataDetail.title,
			desc: dataDetail.desc,
			category: dataDetail.category,
			total: parseInt(dataDetail.total),
			type: dataDetail.type,
			date: modalDate,
		};

		firebase.database()
			.ref(`transactions/${detail.user?.uid}/${detail.data?.id}`)
			.update(newData)
			.then(() => {
				showMessage({
					message: 'Transaction updated successfully.',
					type: 'success',
				});
				navigation.replace('Transactions', detail.user);
			})
			.catch((error) => {
				showMessage({
					message: error.message,
					type: 'danger',
				});
			});
	};

	const onDelete = () => {
		firebase.database()
			.ref(`transactions/${detail.user?.uid}/${detail.data?.id}/`)
			.remove()
			.then(() => {
				showMessage({
					message: 'Transaction has been deleted.',
					type: 'danger',
				});
				navigation.replace('Transactions', detail.user);
			})
			.catch((error) => {
				showMessage({
					message: error.message,
					type: 'danger',
				});
			})
	};

  return (
    <View style={styles.container}>
			<View style={styles.inputWrapper}>
				<Controller
					control={control}
					render={({field: {onChange}}) => (
						<Input
							mode={'outlined'}
							name={'Title Transactions'}
							placeholder={'e.g. Saturday Night Date'}
							disabled={disabled}
							value={dataDetail?.title}
							onChangeText={text => {
								setDataDetail({...dataDetail, title: text});
								onChange(text);
							}}
							error={errors.title}
						/>
					)}
					name={'title'}
					rules={{
						required:
							dataDetail?.title === detail.data?.title
								? false
								: errorMessage.form
					}}
					defaultValue={dataDetail?.title}
				/>

				{(dataDetail.desc !== '' || !disabled) && (
					<Controller
						control={control}
						render={({field: {onChange}}) => (
							<Input
								mode={'outlined'}
								name={
									!disabled
										? 'Description (Optional)'
										: 'Description'
								}
								placeholder={'e.g. Watch a movie in 21 Cinema'}
								multiline={true}
								disabled={disabled}
								value={dataDetail?.desc}
								onChangeText={text => {
									setDataDetail({...dataDetail, desc: text});
									onChange(text);
								}}
							/>
						)}
						name={'desc'}
						rules={{required: false}}
						defaultValue={dataDetail?.desc}
					/>
				)}

				<Select
					name={'Category'}
					placeholder={'Select your category transaction'}
					data={dataCategory}
					closeOnSelection={true}
					disabled={disabled}
					value={dataDetail.category}
					onSelect={(text: string) => {
						setDataDetail({...dataDetail, category: text});
					}}
					error={errors.category}
				/>

				<Controller
					control={control}
					render={({field: {onChange}}) => (
						<Input
							mode={'outlined'}
							name={'Total Transactions'}
							placeholder={'e.g. 2.500.000'}
							keyboardType={'numeric'}
							disabled={disabled}
							value={dataDetail.total}
							onChangeText={text => {
								setDataDetail({...dataDetail, total: text});
								onChange(text);
							}}
							error={errors.total}
						/>
					)}
					name={'total'}
					rules={{
						required:
							dataDetail?.total === detail.data?.total
								? false
								: errorMessage.form
					}}
					defaultValue={dataDetail?.total}
				/>

				<Select
					name={'Type'}
					placeholder={'Select your type Debit or Credit'}
					data={typeData}
					closeOnSelection={true}
					disabled={disabled}
					value={dataDetail.type}
					onSelect={(text: string) => {
						setDataDetail({...dataDetail, type: text});
					}}
					error={errors.type}
				/>

				<Input
					mode={'outlined'}
					date={true}
					name={'Date Transaction'}
					disabled={disabled}
					value={modalDate}
					onPress={() => !disabled ? setShowDatePicker(true) : {}}
				/>

				<DateTimePickerModal
					isVisible={showDatePicker}
					date={dateValue}
					mode={'date'}
					onConfirm={confirmDatePicker}
					onCancel={() => setShowDatePicker(false)}
				/>
			</View>

			{disabled && (
				<View style={styles.action}>
					<Button
						uppercase={false}
						mode={'contained'}
						style={{
							width: '48%',
							backgroundColor: Colors.ALERT,
						}}
						onPress={() => onDelete()}
					>
						Delete
					</Button>
					<Button
						uppercase={false}
						mode={'contained'}
						style={{
							width: '48%',
						}}
						onPress={() => setDisabled(false)}
					>
						Edit
					</Button>
				</View>
			)}

			{!disabled && (
				<View style={styles.action}>
					<Button
						uppercase={false}
						mode={'contained'}
						style={{
							width: '48%',
							backgroundColor: Colors.SHADES.dark[50],
						}}
						onPress={() => {
							setDisabled(true);
							getData();
						}}
					>
						Cancel
					</Button>
					<Button
						uppercase={false}
						mode={'contained'}
						style={{
							width: '48%',
						}}
						onPress={() => handleSubmit(onSubmit)()}
					>
						Submit
					</Button>
				</View>
			)}
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
	action: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
});

export default container(Layout, true, Colors.WHITE);
