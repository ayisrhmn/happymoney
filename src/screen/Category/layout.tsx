import React from 'react';
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
} from 'react-native';
import {Chip} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import container from '@components/container';
import Modal from '@components/modal';
import Input from '@components/input';
import Button from '@components/button';
import {Colors, Mixins} from '@utils/index';

type Props = {
  navigation: any;
};

const Layout: React.FC<Props> = (props) => {
  const {navigation} = props;

	const [preview, setPreview] = React.useState(false);
	const [modalDelete, setModalDelete] = React.useState(false);
	const [category, setCategory] = React.useState('');
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

    return () => {};
  }, [navigation]);

	const dummyData = [
		{
			category: 'Salary',
			created_on: new Date(),
		},
		{
			category: 'Boarding House',
			created_on: new Date(),
		},
		{
			category: 'College',
			created_on: new Date(),
		},
	];

	const sorting = () => {
		return dummyData.sort((a, b) => {
			return a.category < b.category ? -1 : 1;
		});
	};

  return (
		<View style={styles.container}>
			<View style={[styles.row, styles.chipContainer]}>
				{dummyData.length != 0 && (
					<>
						{sorting().map((item: any, i: number) => (
							<Chip
								style={styles.chipStyle}
								textStyle={styles.chipText}
								onClose={() => {
									setModalDelete(true)
									setDetail({
										category: item.category,
									});
								}}
								key={i}
							>
								{item.category}
							</Chip>
						))}
					</>
				) || (
					<Text style={styles.textEmpty}>
						No category available
					</Text>
				)}
			</View>

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
						value={category}
						onChangeText={text => setCategory(text)}
					/>
					<View style={styles.action}>
						<Button
							uppercase={false}
							mode={'contained'}
							onPress={() => {
								console.warn('saved');
								setPreview(false);
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
							{detail?.category}
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
							onPress={() => {
								setModalDelete(false);
							}}
						>
							Cancel
						</Button>
						<Button
							uppercase={false}
							mode={'contained'}
							style={{
								width: '47%',
							}}
							onPress={() => {
								console.warn('deleted');
								setModalDelete(false);
							}}
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
