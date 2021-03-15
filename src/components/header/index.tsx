import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Appbar} from 'react-native-paper';
import {Colors, Mixins} from 'utils';

interface Props {
  navigation?: any;
  scene?: any;
  showNotification?: boolean;
  showSearch?: boolean;
  showFilter?: boolean;
}

const Header: React.FC<Props> = ({navigation, scene}) => {
  var title = scene.descriptor.options.headerTitle;
  if (!title) {
    title = scene.route.name;
  }

  const [right, setRight] = React.useState(null);
  const [left, setLeft] = React.useState(null);

  React.useLayoutEffect(() => {
    const {
      options: {headerRight, headerLeft},
    } = scene.descriptor;

    if (headerRight) {
      setRight(headerRight);
    }

    if (headerLeft) {
      setLeft(headerLeft);
    }

    return () => {
      setRight(null);
      setLeft(null);
    };
  }, [scene]);

  return (
    <Appbar.Header>
      {['Home', 'Login'].indexOf(scene.route.name) < 0 && (
        <Appbar.BackAction
					onPress={() => navigation.goBack()}
					color={Colors.BLACK}
				/>
      )}
      {left}
			<Appbar.Content
				title={title}
				titleStyle={styles.headerContent}
			/>
      {right}
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  headerContent: {
    fontSize: Mixins.scaleFont(18),
    color: Colors.BLACK,
  },
});

export default Header;
