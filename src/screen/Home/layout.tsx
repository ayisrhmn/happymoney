import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

import container from '@components/container';
import {Colors} from '@utils/index';

type Props = {
  navigation: any;
};

const Layout: React.FC<Props> = (props) => {
  const {navigation} = props;

  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.SHADES.dark[20],
  },
});

export default container(Layout, true, Colors.SHADES.dark[20]);
