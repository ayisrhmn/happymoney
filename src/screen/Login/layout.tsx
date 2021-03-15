import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

import container from '@components/container';
import {Colors, Mixins} from '@utils/index';

type Props = {
  navigation: any;
};

const Layout: React.FC<Props> = (props) => {
  const {navigation} = props;

  return (
    <View style={styles.container}>
      <Text>Login Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
		padding: Mixins.scaleSize(12),
  },
});

export default container(Layout, true, Colors.SHADES.dark[40]);
