import React from 'react';
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	FlatList,
	Animated,
} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import {ActivityIndicator} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useForm} from 'react-hook-form';
import {showMessage} from 'react-native-flash-message';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import {useIsFocused} from '@react-navigation/native';
import container from '@components/container';
import Modal from '@components/modal';
import Input from '@components/input';
import Button from '@components/button';
import {Colors, Mixins} from '@utils/index';
import firebase from '@database/firebase';

type Props = {
  navigation: any;
	route: any;
};

const Layout: React.FC<Props> = (props) => {
  const {navigation, route} = props;

	const user = route.params;

	const isFocused = useIsFocused();

	const [dataCategory, setDataCategory] = React.useState([]) as any;
	const [transaction, setTransaction] = React.useState([]) as any;

	const [refresh, setRefresh] = React.useState(false);
	const [preview, setPreview] = React.useState(false);
	const [modalDelete, setModalDelete] = React.useState(false);
	const [detail, setDetail] = React.useState({}) as any;

	React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
				return (
					<TouchableOpacity
						onPress={() => setPreview(true)}
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
			getData();
		}

		return () => {};
	}, [isFocused]);

	const getData = () => {
		setRefresh(true);
		setDataCategory([]);
		setDetail({});

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
			})
			.then(() => setRefresh(false));

		firebase.database()
			.ref(`transactions/${user?.uid}/`)
			.once('value', (res) => {
				if (res.val()) {
					const dataRes = res.val();
					const allData = [] as any;

					Object.keys(dataRes).map((key) => {
						allData.push({
							id: key,
							category: dataRes[key].category,
						});
					});

					setTransaction(allData);
				}
			});
	};

	const {
		register,
		handleSubmit,
		setValue,
		formState: {errors},
	} = useForm();

	React.useEffect(() => {
    register('category', {required: 'This field is required'});

    return () => {};
  }, [register]);

	const onSubmit = (val: any) => {
		const checkData = dataCategory.find(
			(dt: any) => dt.category.toLowerCase() === val.category.toLowerCase()
		);

		if (checkData === undefined) {
			firebase.database()
				.ref(`category/${user?.uid}/`)
				.push(val.category)
				.then(() => {
					setPreview(false);
					getData();
					showMessage({
						message: 'Category added successfully.',
						type: 'success',
					});
				})
				.catch((error) => {
					setPreview(false);
					showMessage({
						message: error.message,
						type: 'danger',
					});
				});
		} else {
			setPreview(false);
			showMessage({
				message: 'Category is already exists.',
				type: 'danger',
			});
		}
  };

	const onDelete = () => {
		const checkData = transaction.find(
			(dt: any) => dt.category === detail?.category
		);

		if (checkData === undefined) {
			firebase.database()
				.ref(`category/${user?.uid}/${detail?.id}/`)
				.remove()
				.then(() => {
					setModalDelete(false);
					getData();
					showMessage({
						message: 'Category deleted successfully.',
						type: 'danger',
					});
				})
				.catch((error) => {
					setModalDelete(false);
					showMessage({
						message: error.message,
						type: 'danger',
					});
				})
		} else {
			setModalDelete(false);
			showMessage({
				message: 'Category is already exists in Transactions.',
				type: 'danger',
			});
		}
	};

	const sorting = () => {
		return dataCategory.sort((a: any, b: any) => {
			return a.category.toLowerCase() < b.category.toLowerCase() ? -1 : 1;
		});
	};

  return (
		<>
			{refresh && (
				<ActivityIndicator
					animating={true}
					size={'large'}
					color={Colors.PRIMARY}
					style={{marginTop: Mixins.scaleSize(24)}}
				/>
			)}

			{!refresh && (
				<>
					{dataCategory.length == 0 && (
						<Text style={styles.textEmpty}>
							No category available
						</Text>
					) || (
						<FlatList
							data={sorting()}
							keyExtractor={(item, idx) => idx + item}
							refreshing={refresh}
							onRefresh={getData}
							renderItem={({item}) => (
								<Swipeable
									renderRightActions={(dragX: any) => {
										const trans = dragX.interpolate({
											inputRange: [-80, 0],
											outputRange: [1, 0],
										});

										return (
											<Animated.View
												style={{
													transform: [{translateX: trans}],
													backgroundColor: 'red',
													marginBottom: 5,
												}}>
												<RectButton
													style={{
														justifyContent: 'center',
														alignItems: 'center',
														flex: 1,
														paddingHorizontal: Mixins.scaleSize(20),
													}}
													onPress={() => {
														setModalDelete(true)
														setDetail({
															id: item.id,
															category: item.category,
														});
													}}
												>
													<MaterialIcons
														name={'delete'}
														size={Mixins.scaleFont(26)}
														color={Colors.WHITE}
													/>
												</RectButton>
											</Animated.View>
										);
									}}>
									<View style={styles.listItem}>
										<Text style={styles.listText}>
											{item.category}
										</Text>
									</View>
								</Swipeable>
							)}
						/>
					)}
				</>
			)}

			<Modal
				show={preview}
				loading={false}
				showCloseButton={true}
				onClose={() => setPreview(false)}
			>
				<View style={styles.modalHeader}>
					<Text style={styles.modalTitle}>
						Add Category
					</Text>
				</View>

				<View style={styles.modalBody}>
					<Input
						mode={'outlined'}
						name={'Category Name'}
						placeholder={'e.g. Holiday'}
						onChangeText={text => {
							setValue('category', text, {shouldValidate: true});
						}}
						error={errors.category}
					/>
					<View style={styles.action}>
						<Button
							uppercase={false}
							mode={'contained'}
							onPress={() => {
								handleSubmit(onSubmit)();
							}}
						>
							Save
						</Button>
					</View>
				</View>
			</Modal>

			<Modal
				show={modalDelete}
				loading={false}
				showCloseButton={true}
				onClose={() => setModalDelete(false)}
			>
				<View style={styles.modalHeader}>
					<Text style={styles.modalTitle}>
						Delete Category
					</Text>
				</View>

				<View style={styles.modalBody}>
					<Text style={styles.text}>
						Are you sure delete{' '}
						<Text style={{fontWeight: 'bold'}}>
							{detail.category}
						</Text>
						?
					</Text>

					<View style={[styles.action, styles.actionTwoBtn]}>
						<Button
							uppercase={false}
							mode={'contained'}
							color={Colors.SHADES.dark[40]}
							style={{
								width: '47%',
							}}
							onPress={() => setModalDelete(false)}
						>
							Cancel
						</Button>
						<Button
							uppercase={false}
							mode={'contained'}
							dark={true}
							color={Colors.ALERT}
							style={{
								width: '47%',
							}}
							onPress={() => onDelete()}
						>
							Delete
						</Button>
					</View>
				</View>
			</Modal>
		</>
  );
};

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
	},
	listItem: {
		padding: Mixins.scaleSize(12),
		backgroundColor: Colors.WHITE,
		marginBottom: 5,
	},
	listText: {
		fontSize: Mixins.scaleFont(16),
		color: Colors.BLACK,
	},
	textEmpty: {
		flex: 1,
		textAlign: 'center',
		fontSize: Mixins.scaleFont(18),
		color: Colors.BLACK,
		marginTop: Mixins.scaleSize(12),
	},
	modalHeader: {
		padding: Mixins.scaleSize(12),
	},
	modalTitle: {
		fontSize: Mixins.scaleFont(16),
		fontWeight: 'bold',
		color: Colors.BLACK,
	},
	modalBody: {
		padding: Mixins.scaleSize(12),
	},
	action: {
		marginTop: Mixins.scaleSize(14),
		marginBottom: Mixins.scaleSize(10),
	},
	actionTwoBtn: {
		marginTop: Mixins.scaleSize(26),
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	text: {
		fontSize: Mixins.scaleFont(16),
		color: Colors.BLACK,
		textAlign: 'center',
	},
});

export default container(Layout, false);
