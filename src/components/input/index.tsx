import React from 'react';
import {
	GestureResponderEvent,
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import {RenderProps} from 'react-native-paper/lib/typescript/components/TextInput/types';
import TextInputMask from 'react-native-text-input-mask';

import {Colors, Mixins} from '@utils/index';

interface Props {
	mode?: 'flat' | 'outlined';
  name?: any;
	focus?: any;
	setFocus?: any;
  placeholder?: any;
  value?: any;
	secureTextEntry?: boolean;
	password?: boolean;
	select?: boolean;
	multiline?: boolean;
	mask?: any;
	keyboardType?: any | 'default';
	onChangeText?: ((text: string) => void) | undefined;
	onPress?: ((event: GestureResponderEvent) => void) | undefined;
	onSecure?: (() => void) | undefined;
};

const inputTheme = {
	roundness: Mixins.scaleSize(5),
	colors: {
		primary: Colors.PRIMARY,
		placeholder: Colors.BLACK,
		text: Colors.BLACK,
	},
};

const Input: React.FC<Props> = (props) => {
	const [focus, setFocus] = React.useState(false);

  return (
		<>
			{!props?.password && !props?.select && (
				<InputText
					{...props}
					focus={focus}
					setFocus={setFocus}
				/>
			)}

			{props?.password && (
				<InputPassword
					{...props}
					focus={focus}
					setFocus={setFocus}
				/>
			)}

			{props?.select && (
				<>
					{props?.onPress !== undefined && (
						<View>
							<TouchableOpacity onPress={props?.onPress} style={styles.touchable} />
							<InputSelect
								{...props}
								focus={focus}
								setFocus={setFocus}
							/>
						</View>
					)}

					{props?.onPress === undefined && (
						<InputSelect
							{...props}
							focus={focus}
							setFocus={setFocus}
						/>
					)}
				</>
			)}
		</>
  );
};

const InputText: React.FC<Props> = (props) => {
  return (
		<>
			<Text style={
				props?.focus
					? [styles.labelActive]
					: [styles.label]
			}>
				{props?.name}
			</Text>
			<TextInput
				{...props}
				placeholderTextColor={Colors.SHADES.dark[50]}
				selectionColor={Colors.SHADES.dark[40]}
				style={
					!props?.multiline
						? styles.input
						: styles.inputTextArea
				}
				theme={inputTheme}
				onFocus={() => props?.setFocus(true)}
				onBlur={() => props?.setFocus(false)}
				render={
					props?.mask
						? (p: RenderProps) => <TextInputMask {...p} mask={props?.mask} />
						: undefined
				}
			/>
		</>
  );
};

const InputPassword: React.FC<Props> = (props) => {
  return (
		<>
			<Text style={
				props?.focus
					? [styles.labelActive]
					: [styles.label]
			}>
				{props?.name}
			</Text>
			<TextInput
				{...props}
				placeholderTextColor={Colors.SHADES.dark[50]}
				selectionColor={Colors.SHADES.dark[40]}
				style={styles.input}
				theme={inputTheme}
				onFocus={() => props?.setFocus(true)}
				onBlur={() => props?.setFocus(false)}
				right={
					<TextInput.Icon
						name={props?.secureTextEntry
									? 'eye-off-outline'
									: 'eye-outline'}
						color={props?.focus ? Colors.PRIMARY : Colors.BLACK}
						style={{marginTop: Mixins.scaleSize(12)}}
						onPress={props?.onSecure}
					/>
				}
			/>
		</>
  );
};

const InputSelect: React.FC<Props> = (props) => {
  return (
		<>
			<Text style={
				props?.focus
					? [styles.labelActive]
					: [styles.label]
			}>
				{props?.name}
			</Text>
			<TextInput
				{...props}
				placeholderTextColor={Colors.SHADES.dark[50]}
				selectionColor={Colors.SHADES.dark[40]}
				style={styles.input}
				theme={inputTheme}
				onFocus={() => props?.setFocus(true)}
				onBlur={() => props?.setFocus(false)}
				right={
					<TextInput.Icon
						name={'chevron-down'}
						color={Colors.BLACK}
						style={{marginTop: Mixins.scaleSize(12)}}
					/>
				}
			/>
		</>
  );
};

const styles = StyleSheet.create({
	label: {
		fontSize: Mixins.scaleFont(12),
		color: Colors.BLACK,
	},
	labelActive: {
		fontSize: Mixins.scaleFont(12),
		fontWeight: 'bold',
		color: Colors.PRIMARY,
	},
  input: {
		height: Mixins.scaleSize(40),
		maxHeight: Mixins.scaleSize(40),
		marginBottom: Mixins.scaleSize(20),
		backgroundColor: 'transparent',
	},
	inputTextArea: {
		marginBottom: Mixins.scaleSize(10),
		backgroundColor: 'transparent',
	},
	touchable: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 3,
  },
});

export default Input;
