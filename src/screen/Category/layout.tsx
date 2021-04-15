import React, {useContext} from 'react';
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
} from 'react-native';
import {Chip, ActivityIndicator} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useForm} from 'react-hook-form';
import {showMessage} from 'react-native-flash-message';

import {useIsFocused} from '@react-navigation/native';
import container, {ContainerContext} from '@components/container';
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

	const [dataCategory, setDataCategory] = React.useState([] as any);

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

	const ctx = useContext(ContainerContext);

	React.useLayoutEffect(() => {
    ctx.setRefreshCallback({
      func: async () => {
        getCategory();
      },
    });

    return () => {};
  }, [navigation]); // eslint-disable-line react-hooks/exhaustive-deps

	React.useEffect(() => {
		if (isFocused) {
			getCategory();
		}

		return () => {};
	}, [isFocused]);

	const getCategory = () => {
		setRefresh(true);
		setDataCategory([]);
		setDetail({});

		firebase.database()
			.ref(`category/${user.uid}/`)
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
    firebase.database()
			.ref(`category/${user.uid}/`)
			.push(val.category)
			.then(() => {
				setPreview(false);
				getCategory();
			})
			.catch((error) => {
				setPreview(false);
				showMessage({
					message: error.message,
					type: 'danger',
				});
			});
  };

	const onDelete = () => {
		firebase.database()
			.ref(`category/${user.uid}/${detail.id}/`)
			.remove()
			.then(() => {
				setModalDelete(false);
				getCategory();
			})
			.catch((error) => {
				showMessage({
					message: error.message,
					type: 'danger',
				});
				setModalDelete(false);
			})
	};

	const sorting = () => {
		return dataCategory.sort((a: any, b: any) => {
			return a.category < b.category ? -1 : 1;
		});
	};

  return (
		<View style={styles.container}>
			{refresh && (
				<ActivityIndicator
					animating={true}
					size={'large'}
					color={Colors.PRIMARY}
					style={{marginTop: Mixins.scaleSize(10)}}
				/>
			)}

			{!refresh && (
				<View style={[styles.row, styles.chipContainer]}>
					{dataCategory.length == 0 && (
						<Text style={styles.textEmpty}>
							No category available
						</Text>
					) || (
						<>
							{sorting().map((item: any, i: number) => (
								<Chip
									style={styles.chipStyle}
									textStyle={styles.chipText}
									onClose={() => {
										setModalDelete(true)
										setDetail({
											id: item.id,
											category: item.category,
										});
									}}
									key={i}
								>
									{item.category}
								</Chip>
							))}
						</>
					)}
				</View>
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
		</View>
  );
};

const styles = StyleSheet.create({
  container: {
		padding: Mixins.scaleSize(12),
  },
	row: {
		flexDirection: 'row',
	},
	chipContainer: {
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	chipStyle: {
		backgroundColor: Colors.SECONDARY,
		marginBottom: Mixins.scaleSize(12),
		flexBasis: '48%',
	},
	chipText: {
		fontSize: Mixins.scaleFont(16),
	},
	textEmpty: {
		flex: 1,
		textAlign: 'center',
		fontSize: Mixins.scaleFont(18),
		color: Colors.BLACK,
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

export default container(Layout);
