import React from 'react';
import {View, StyleSheet, Text, BackHandler} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {showMessage} from 'react-native-flash-message';

import container from '@components/container';
import Card from '@components/card';
import {Colors, Mixins} from '@utils/index';
import firebase from '@database/firebase';

type Props = {
  navigation: any;
	route: any;
};

const Layout: React.FC<Props> = (props) => {
  const {navigation, route} = props;

	const user = route.params;

	React.useEffect(() => {
		const backAction = () => {
      navigation.navigate('Home');

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

	const signOut = () => {
		firebase.auth()
      .signOut()
      .then(() => {
        navigation.replace('SignIn');
      })
      .catch((error) => {
        showMessage({
					message: error.message,
					type: 'danger',
				});
      });
	};

	const listMenu: Array<any> = [
		{
			menu: 'Edit Profile',
			icon: 'person',
			iconColor: Colors.SHADES.brown[100],
			navigate: 'EditProfile',
		},
		{
			menu: 'Change Password',
			icon: 'settings',
			iconColor: Colors.SHADES.dark[50],
			navigate: 'ChangePassword',
		},
		{
			menu: 'Sign Out',
			icon: 'log-out',
			iconColor: Colors.ALERT,
			navigate: 'signout',
		},
	];

  return (
    <>
			<View style={styles.header}>
				<Ionicons
					name={'person-circle'}
					size={Mixins.scaleFont(72)}
					color={Colors.SECONDARY}
				/>
				<View style={styles.infoWrapper}>
					<Text style={styles.infoTitle}>
						{user.name}
					</Text>
					<Text style={styles.infoSub}>
						{user.email}
					</Text>
				</View>
			</View>

			{listMenu.map((item: any, i: number) => (
				<Card
					style={styles.cardContainer}
					onPress={() => {
						item.navigate === 'signout'
							? signOut()
							: navigation.navigate(item.navigate, user)
					}}
					key={i}
				>
					<View style={[
						styles.row,
						styles.space,
						{alignItems: 'center'},
					]}>
						<View style={styles.row}>
							<Ionicons
								name={item.icon}
								size={Mixins.scaleFont(24)}
								color={item.iconColor}
								style={{marginRight: Mixins.scaleSize(14)}}
							/>
							<Text style={styles.listTitle}>
								{item.menu}
							</Text>
						</View>

						<Ionicons
							name={'chevron-forward'}
							size={Mixins.scaleFont(20)}
							color={Colors.BLACK}
						/>
					</View>
				</Card>
			))}
		</>
  );
};

const styles = StyleSheet.create({
  header: {
		backgroundColor: Colors.PRIMARY,
		padding: Mixins.scaleSize(14),
		marginBottom: Mixins.scaleSize(16),
		justifyContent: 'center',
		alignItems: 'center',
	},
	infoWrapper: {
		marginTop: Mixins.scaleSize(5),
		marginBottom: Mixins.scaleSize(10),
		justifyContent: 'center',
		alignItems: 'center',
	},
	infoTitle: {
		color: Colors.WHITE,
		fontSize: Mixins.scaleFont(18),
		fontWeight: 'bold',
		marginBottom: Mixins.scaleSize(2),
	},
	infoSub: {
		color: Colors.WHITE,
		fontSize: Mixins.scaleFont(14),
	},
	divider: {
		backgroundColor: Colors.SHADES.dark[60],
		marginVertical: Mixins.scaleSize(12),
	},

	row: {
		flexDirection: 'row',
	},
	space: {
		justifyContent: 'space-between',
	},
	cardContainer: {
		marginHorizontal: Mixins.scaleSize(12),
	},
	listTitle: {
		color: Colors.BLACK,
		fontSize: Mixins.scaleFont(16),
		fontWeight: 'bold',
		textAlignVertical: 'center',
	},
	text: {
		color: Colors.BLACK,
		fontSize: Mixins.scaleFont(14),
		marginBottom: Mixins.scaleSize(2),
	},
});

export default container(Layout);
