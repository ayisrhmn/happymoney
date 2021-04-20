import React from 'react';
import {Avatar} from 'react-native-paper';
import { Mixins } from 'utils';

interface Props {
  size?: any;
  label?: any;
	color?: any;
};

const PaperAvatar: React.FC<Props> = (props) => {
  return (
		<Avatar.Text
			size={props?.size}
			label={props?.label}
			style={{
				backgroundColor: props?.color,
				marginVertical: Mixins.scaleSize(5),
			}}
		/>
  );
};

export default PaperAvatar;
