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
	error?: any;
	secureTextEntry?: boolean;
	password?: boolean;
	select?: boolean;
	date?: boolean;
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
		<View style={styles.inputWrapper}>
			{(!props?.password && !props?.select && !props?.date) && (
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

			{props?.date && (
				<>
					{props?.onPress !== undefined && (
						<View>
							<TouchableOpacity onPress={props?.onPress} style={styles.touchable} />
							<InputDate
								{...props}
								focus={focus}
								setFocus={setFocus}
							/>
						</View>
					)}

					{props?.onPress === undefined && (
						<InputDate
							{...props}
							focus={focus}
							setFocus={setFocus}
						/>
					)}
				</>
			)}

			{props?.error && (
        <Text
          style={{
            fontSize: Mixins.scaleFont(12),
            paddingTop: Mixins.scaleSize(3),
            color: Colors.ALERT,
          }}>
          {props.error.message}
        </Text>
      )}
		</View>
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
				style={styles.input}
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
					/>
				}
			/>
		</>
  );
};

const InputDate: React.FC<Props> = (props) => {
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
			/>
		</>
  );
};

const styles = StyleSheet.create({
	label: {
		fontSize: Mixins.scaleFont(14),
		color: Colors.BLACK,
	},
	labelActive: {
		fontSize: Mixins.scaleFont(14),
		fontWeight: 'bold',
		color: Colors.PRIMARY,
	},
	inputWrapper: {
		marginBottom: Mixins.scaleSize(14),
	},
  input: {
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
