import React from 'react';
import {StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {Button} from 'react-native-paper';

import {Mixins} from '@utils/index';

interface Props {
  children?: any;
  mode?: any;
	dark?: any;
	disabled?: boolean;
	uppercase?: any;
	color?: any;
	style?: StyleProp<ViewStyle>;
	onPress?: (() => void) | undefined;
};

const PaperButton: React.FC<Props> = (props) => {
  return (
		<Button
			{...props}
			style={[styles.button, props?.style]}
			labelStyle={styles.labelButton}
		>
			{props?.children}
		</Button>
  );
};

const styles = StyleSheet.create({
  button: {
		borderRadius: Mixins.scaleSize(5),
		paddingVertical: Mixins.scaleSize(2),
	},
	labelButton: {
		fontSize: Mixins.scaleFont(16),
	},
});

export default PaperButton;
