import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {colors} from '../../theme/colors';

interface Props {
  uri?: string | null;
  name?: string;
  size?: number;
}

export const Avatar: React.FC<Props> = ({uri, name, size = 40}) => {
  const initials = name
    ?.split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (uri) {
    return (
      <Image
        source={{uri}}
        style={[styles.image, {width: size, height: size, borderRadius: size / 2}]}
      />
    );
  }

  return (
    <View
      style={[
        styles.placeholder,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}>
      <Text style={[styles.initials, {fontSize: size * 0.38}]}>{initials || '?'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {backgroundColor: colors.surfaceSecondary},
  placeholder: {
    backgroundColor: colors.primaryLight + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {color: colors.primary, fontWeight: '700'},
});
