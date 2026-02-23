import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View, ViewStyle} from 'react-native';
import {colors} from '../../theme/colors';
import {borderRadius, spacing} from '../../theme/spacing';

interface SkeletonBlockProps {
  width?: number | `${number}%` | 'auto';
  height?: number;
  style?: ViewStyle;
}

export const SkeletonBlock: React.FC<SkeletonBlockProps> = ({
  width = '100%',
  height = 12,
  style,
}) => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 850,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 850,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [shimmer]);

  return (
    <Animated.View
      style={[
        styles.block,
        {
          width,
          height,
          opacity: shimmer.interpolate({
            inputRange: [0, 1],
            outputRange: [0.55, 1],
          }),
        },
        style,
      ]}
    />
  );
};

export const FeedSkeleton: React.FC = () => {
  return (
    <View style={styles.feedWrap}>
      {Array.from({length: 4}).map((_, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.row}>
            <SkeletonBlock width={90} height={24} />
            <SkeletonBlock width={70} height={24} />
          </View>
          <SkeletonBlock width="85%" height={18} style={styles.gapSm} />
          <SkeletonBlock width="65%" height={14} style={styles.gapXs} />
          <View style={styles.rowBottom}>
            <SkeletonBlock width={120} height={18} />
            <SkeletonBlock width={90} height={14} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  block: {
    backgroundColor: colors.border,
    borderRadius: borderRadius.md,
  },
  feedWrap: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  card: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowBottom: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gapSm: {
    marginTop: spacing.sm,
  },
  gapXs: {
    marginTop: spacing.xs,
  },
});
