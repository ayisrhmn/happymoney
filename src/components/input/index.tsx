import React from 'react';
import {StyleSheet} from 'react-native';
import {TextInput} from 'react-native-paper';

import {Colors, Mixins} from '@utils/index';

interface Props {
  mode?: any;
  label?: any;
  value?: any;
	secureTextEntry?: boolean;
	password?: boolean;
	onChangeText?: ((text: string) => void) | undefined;
	onSecure?: (() => void) | undefined;
};

const Input: React.FC<Props> = (props) => {
  return (
		<>
			{!props?.password && (
				<InputText {...props} />
			)}

			{props?.password && (
				<InputPassword {...props} />
			)}
		</>
  );
};

const InputText: React.FC<Props> = (props) => {
  return (
		<TextInput
			{...props}
			style={styles.input}
			theme={{
				colors: {
					primary: Colors.PRIMARY,
					placeholder: Colors.BLACK,
					text: Colors.BLACK,
				},
			}}
		/>
  );
};

const InputPassword: React.FC<Props> = (props) => {
	const [focus, setFocus] = React.useState(false);

  return (
		<TextInput
			{...props}
			style={styles.input}
			onFocus={() => setFocus(true)}
			onBlur={() => setFocus(false)}
			theme={{
				colors: {
					primary: Colors.PRIMARY,
					placeholder: Colors.BLACK,
					text: Colors.BLACK,
				},
			}}
			right={
				<TextInput.Icon
					name={props?.secureTextEntry
								? 'eye-off-outline'
								: 'eye-outline'}
					color={focus ? Colors.PRIMARY : Colors.BLACK}
					onPress={props?.onSecure}
				/>
			}
		/>
  );
};

const styles = StyleSheet.create({
  input: {
		height: Mixins.scaleSize(56),
		maxHeight: Mixins.scaleSize(56),
		fontSize: Mixins.scaleFont(16),
		marginBottom: Mixins.scaleSize(10),
		backgroundColor: 'transparent',
	},
});

export default Input;
