import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

import container from '@components/container';
import {Mixins} from '@utils/index';

type Props = {
  navigation: any;
};

const Layout: React.FC<Props> = (props) => {
  const {navigation} = props;

	React.useEffect(() => {

    return () => {};
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text>Transactions Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Mixins.scaleSize(12),
  },
});

export default container(Layout);
