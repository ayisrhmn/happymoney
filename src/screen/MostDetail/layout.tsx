import React from 'react';
import {View, StyleSheet, Text, FlatList} from 'react-native';
import EmoticonIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import container from '@components/container';
import {Colors, Helper, Mixins} from '@utils/index';

import moment from 'moment';

type Props = {
  navigation: any;
	route: any;
};

const Layout: React.FC<Props> = (props) => {
  const {navigation, route} = props;

	const {title, subtitle, data} = route.params;

	React.useEffect(() => {
		navigation.setOptions({
			headerTitle: title,
		});

		return () => {};
	}, []);

	const sorting = () => {
		return data.sort((a: any, b: any) => {
			return a.total > b.total ? -1 : 1;
		});
	};

  return (
		<View style={styles.container}>
			<Text style={styles.menuTitle}>
				{subtitle} on {moment().format('MMMM YYYY')}
			</Text>

			<FlatList
				data={sorting()}
				keyExtractor={(item, idx) => idx + item}
				renderItem={({item, index}) => (
					<>
						{title.includes('Income') && (
							<View style={index < 3 && [
								styles.row,
								styles.space,
								styles.cardList,
								styles.cardGreen,
							] || [
								styles.row,
								styles.space,
								styles.cardList,
								styles.cardDefault,
							]}>
								<View style={[styles.row, {alignItems: 'center'}]}>
									<Text style={index < 3 && [
										styles.textLight,
										styles.rank,
									] || [
										styles.textDefault,
										styles.rank,
									]}>
										#{index + 1}
									</Text>
									{index < 3 && (
										<EmoticonIcons
											name={
												index === 0 && 'emoticon-cool' ||
												index === 1 && 'emoticon' ||
												index === 2 && 'emoticon-happy'
											}
											color={'yellow'}
											size={Mixins.scaleFont(24)}
										/>
									)}
									<Text style={index < 3 && [
										styles.textLight,
										styles.ctName,
									] || [
										styles.textDefault,
										styles.ctName,
										{marginLeft: Mixins.scaleSize(35)}
									]}>
										{item.category}
									</Text>
								</View>
								<Text style={index < 3 && styles.textLight || styles.textDefault}>
									{Helper.numberWithSeparator(item.total)}
								</Text>
							</View>
						) || title.includes('Expense') && (
							<View style={index < 3 && [
								styles.row,
								styles.space,
								styles.cardList,
								styles.cardRed,
							] || [
								styles.row,
								styles.space,
								styles.cardList,
								styles.cardDefault,
							]}>
								<View style={[styles.row, {alignItems: 'center'}]}>
									<Text style={index < 3 && [
										styles.textLight,
										styles.rank,
									] || [
										styles.textDefault,
										styles.rank,
									]}>
										#{index + 1}
									</Text>
									{index < 3 && (
										<EmoticonIcons
											name={
												index === 0 && 'emoticon-dead' ||
												index === 1 && 'emoticon-cry' ||
												index === 2 && 'emoticon-sad'
											}
											color={'yellow'}
											size={Mixins.scaleFont(24)}
										/>
									)}
									<Text style={index < 3 && [
										styles.textLight,
										styles.ctName,
									] || [
										styles.textDefault,
										styles.ctName,
										{marginLeft: Mixins.scaleSize(35)}
									]}>
										{item.category}
									</Text>
								</View>
								<Text style={index < 3 && styles.textLight || styles.textDefault}>
									{Helper.numberWithSeparator(item.total)}
								</Text>
							</View>
						)}
					</>
				)}
			/>
		</View>
  );
};

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
	},
	space: {
		justifyContent: 'space-between',
	},
  container: {
		paddingTop: Mixins.scaleSize(14),
	},
	menuTitle: {
		fontSize: Mixins.scaleFont(18),
		color: Colors.SHADES.dark[60],
		textAlign: 'center',
		textAlignVertical: 'center',
		marginBottom: Mixins.scaleSize(24),
	},
	cardList: {
		padding: Mixins.scaleSize(12),
		alignItems: 'center',
		borderRadius: 10,
		marginBottom: Mixins.scaleSize(8),
		marginHorizontal: Mixins.scaleSize(14),
	},
	cardDefault: {
		backgroundColor: Colors.WHITE,
	},
	cardRed: {
		backgroundColor: Colors.ALERT,
	},
	cardGreen: {
		backgroundColor: Colors.SUCCESS,
	},
	textLight: {
		fontSize: Mixins.scaleFont(17),
		fontWeight: 'bold',
		color: Colors.WHITE,
		textAlignVertical: 'center',
	},
	textDefault: {
		fontSize: Mixins.scaleFont(17),
		color: Colors.BLACK,
		textAlignVertical: 'center',
	},
	rank: {
		width: Mixins.scaleSize(32),
	},
	ctName: {
		marginLeft: Mixins.scaleSize(15),
		width: Mixins.scaleSize(120),
	},
});

export default container(Layout);
