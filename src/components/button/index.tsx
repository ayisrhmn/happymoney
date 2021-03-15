import React from 'react';
import {StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';

import {Mixins} from '@utils/index';

interface Props {
  children?: any;
  mode?: any;
	uppercase?: any;
	onPress?: (() => void) | undefined;
};

const PaperButton: React.FC<Props> = (props) => {
  return (
		<Button
			{...props}
			style={styles.button}
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
