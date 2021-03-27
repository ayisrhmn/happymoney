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
		marginBottom: Mixins.scaleSize(16),
	},
});

export default Card;
