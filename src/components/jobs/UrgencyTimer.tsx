import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import {getTimeLeft, getTimeLeftMs} from '../../utils/date';
import type {Urgency} from '../../types/models';

interface Props {
  bidWindowEnd: string;
  urgency: Urgency;
}

const urgencyColor: Record<Urgency, string> = {
  ASAP: colors.urgencyASAP,
  TODAY: colors.urgencyToday,
  SCHEDULED: colors.urgencyScheduled,
  FLEXIBLE: colors.urgencyFlexible,
};

export const UrgencyTimer: React.FC<Props> = ({bidWindowEnd, urgency}) => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(bidWindowEnd));
  const expired = getTimeLeftMs(bidWindowEnd) <= 0;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(bidWindowEnd));
    }, 30_000);
    return () => clearInterval(interval);
  }, [bidWindowEnd]);

  const color = expired ? colors.textTertiary : urgencyColor[urgency];

  return (
    <View style={[styles.container, {backgroundColor: color + '15'}]}>
      <Icon name={expired ? 'clock-alert' : 'clock-fast'} size={14} color={color} />
      <Text style={[styles.text, {color}]}>
        {expired ? 'Verlopen' : timeLeft}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.captionBold,
    marginLeft: spacing.xxs,
  },
});
