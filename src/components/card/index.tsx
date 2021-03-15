import React from 'react';
import {View, StyleSheet, StyleProp, ViewStyle, TouchableOpacity} from 'react-native';

import {Colors, Mixins} from '@utils/index';

interface Props {
  children?: any;
	style?: StyleProp<ViewStyle> | {};
	onPress?: (() => void) | undefined;
};

const Card: React.FC<Props> = (props) => {
  return (
		<TouchableOpacity
			onPress={props?.onPress}
			activeOpacity={props?.onPress === undefined ? 1 : 0.2}
		>
			<View style={[styles.card, props?.style]}>
				{props?.children}
			</View>
		</TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
		backgroundColor: Colors.WHITE,
		padding: Mixins.scaleSize(14),
		borderRadius: Mixins.scaleSize(6),
		shadowColor: Colors.BLACK,
		shadowOffset: {
			width: Mixins.scaleSize(0),
			height: Mixins.scaleSize(2),
		},
		shadowOpacity: Mixins.scaleSize(0.23),
		shadowRadius: Mixins.scaleSize(2.62),
		elevation: Mixins.scaleSize(4),
		marginBottom: Mixins.scaleSize(16),
	},
});

export default Card;
