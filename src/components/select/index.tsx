import React, {useEffect, useState} from 'react';
import {
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TextInput, Text} from 'react-native-paper';

import {uniq} from 'lodash';

import {Colors, Mixins} from '@utils/index';
import Input from '@components/input';
import Modal from '@components/modal';

interface LayoutProps {
  name: string;
  data: any[] | (() => Promise<any>);
  value?: any;
  valueField?: string;
  textField?: string | Function;
  closeOnSelection?: Boolean;
  style?: StyleProp<ViewStyle>;
  placeholder?: string;
  onOpen?: Function;
  onSelect?: Function;
  error?: any;
	disabled?: boolean;
}

const Select = (props: LayoutProps) => {
  const {
    name,
    data,
    valueField,
    textField,
    closeOnSelection = true,
    placeholder,
    onOpen,
    onSelect,
  } = props;

  const calcDisplayValue = (v: any) => {
    if (v) {
      if (typeof textField === 'function') {
        return textField(v);
      } else {
        if (textField) {
          return v[textField];
        } else {
          return v;
        }
      }
    } else {
      return '';
    }
  };

  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const [value, setValue] = useState(props.value);
  const [displayValue, setDisplayValue] = useState(calcDisplayValue(value));

  const [searchText, setSearchText] = useState('');
  const [dataSource, setDataSource] = useState<any[]>([]);

  let init = async () => {
    setIsLoading(true);
    let source = typeof data === 'function' ? await data() : data;

    source =
      textField === 'function'
        ? source
        : textField
        ? uniq(source, textField)
        : source;

    setDataSource(source);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isModalVisible) {
      init();
    }
  }, [isModalVisible]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setDisplayValue(calcDisplayValue(value));

    if (onSelect) {
      onSelect(value);
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Input
				mode={'outlined'}
				name={name}
				select={true}
        placeholder={placeholder ? placeholder : ''}
				disabled={props?.disabled}
        value={
					props?.value === undefined
						? displayValue
						: props?.value
				}
				error={props?.error}
        onPress={() => {
          setIsModalVisible(true);

          if (onOpen) {
            onOpen();
          }
        }}
      />

      <Modal
        show={isModalVisible}
        loading={false}
        onClose={() => {
          setIsModalVisible(false);
        }}>
        <TextInput
          label="Search"
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
        {isLoading && (
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
        )}

        {!isLoading && (
          <FlatList
            data={dataSource.filter((v) =>
              calcDisplayValue(v)
                .toUpperCase()
                .includes(searchText.toUpperCase()),
            )}
            renderItem={({item, i}: any) => {
              let getItemValue = (v: any) =>
                valueField ? v[valueField] : calcDisplayValue(v);

              let isSelected = () => getItemValue(value) === getItemValue(item);

              let styleSelectItemFirst =
                i === 0 ? styles.selectItemFirst : null;

              let styleSelectItemSelected = isSelected()
                ? styles.selectItemSelected
                : null;

              let itemOnPress = () => {
                setValue(valueField ? item[valueField] : item);
                setDisplayValue(
                  typeof textField === 'function'
                    ? textField(item)
                    : textField
                    ? item[textField]
                    : item,
                );

                if (closeOnSelection === true) {
                  setIsModalVisible(false);
                }
              };

              return (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.selectItem,
                    styleSelectItemFirst,
                    styleSelectItemSelected,
                  ]}
                  onPress={itemOnPress}>
                  {isSelected() ? (
                    <Ionicons
                      name="checkmark-circle-sharp"
                      style={styles.iconSelected}
                    />
                  ) : (
                    <View style={styles.iconSelected} />
                  )}

                  <Text style={styles.textItem}>
                    {typeof textField === 'function'
                      ? textField(item)
                      : textField
                      ? item[textField]
                      : item}
                  </Text>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item, index) => item._id + index.toString()}
          />
        )}
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  selectItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectItemFirst: {},
  selectItemSelected: {
    backgroundColor: Colors.SHADES.dark[20],
    borderRadius: Mixins.scaleSize(8),
  },
  iconSelected: {
    paddingLeft: Mixins.scaleSize(5),
    marginLeft: Mixins.scaleSize(5),
    fontSize: Mixins.scaleFont(25),
    width: Mixins.scaleSize(27),
    height: Mixins.scaleSize(27),
    color: Colors.PRIMARY,
    textAlignVertical: 'center'
  },
  placeholder: {
    color: '#C7C7CD',
  },

  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
  },
  title: {
    fontSize: Mixins.scaleFont(32),
  },

  textItem: {
    flex: 1,
    paddingVertical: Mixins.scaleSize(15),
    paddingLeft: Mixins.scaleSize(15),
    paddingRight: Mixins.scaleSize(30),
    lineHeight: Mixins.scaleSize(18),
  }
});

export default Select;
