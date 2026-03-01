import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { usePlaceBid } from '../../hooks/useBids';
import { useCredits } from '../../hooks/useCredits';
import { useVerification } from '../../hooks/useVerification';
import { CREDIT_COSTS } from '../../config/constants';
import type { FeedStackParamList } from '../../types/navigation';

export const PlaceBidScreen: React.FC = () => {
  const route = useRoute<RouteProp<FeedStackParamList, 'PlaceBid'>>();
  const navigation = useNavigation<any>();
  const { jobId } = route.params;
  const { verification, canBid } = useVerification();
  const { checkAndConsume } = useCredits();
  const placeBid = usePlaceBid();

  const [priceType, setPriceType] = useState<'fixed' | 'hourly'>('fixed');
  const [priceAmount, setPriceAmount] = useState('');
  const [eta, setEta] = useState('');
  const [crewSize, setCrewSize] = useState(1);
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    // Gate: verification
    const check = canBid(verification);
    if (!check.allowed) {
      Alert.alert('Verificatie vereist', check.reason, [
        {
          text: 'OK',
          onPress: () =>
            navigation.navigate('ProfileTab', { screen: 'VerificationCenter' }),
        },
      ]);
      return;
    }

    // Gate: credits
    const ok = await checkAndConsume(
      CREDIT_COSTS.PLACE_BID,
      'een bod te plaatsen',
    );
    if (!ok) return;

    if (!priceAmount || parseFloat(priceAmount) <= 0) {
      Alert.alert('Fout', 'Voer een geldig bedrag in');
      return;
    }

    try {
      await placeBid.mutateAsync({
        jobId,
        priceType,
        priceAmount: parseFloat(priceAmount),
        eta: eta || new Date().toISOString(),
        crewSize,
        message: message || undefined,
      });
      Alert.alert('Gelukt!', 'Je bod is geplaatst.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      // handled by hook
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Plaats je bod</Text>
      <Text style={styles.subtitle}>1 credit vereist</Text>

      {/* Price type */}
      <Text style={styles.label}>Type prijs</Text>
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggle, priceType === 'fixed' && styles.toggleActive]}
          onPress={() => setPriceType('fixed')}
        >
          <Text
            style={[
              styles.toggleText,
              priceType === 'fixed' && styles.toggleTextActive,
            ]}
          >
            Vast bedrag
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggle, priceType === 'hourly' && styles.toggleActive]}
          onPress={() => setPriceType('hourly')}
        >
          <Text
            style={[
              styles.toggleText,
              priceType === 'hourly' && styles.toggleTextActive,
            ]}
          >
            Uurtarief
          </Text>
        </TouchableOpacity>
      </View>

      {/* Price */}
      <Input
        label={priceType === 'hourly' ? 'Uurtarief (€)' : 'Bedrag (€)'}
        placeholder="0.00"
        value={priceAmount}
        onChangeText={setPriceAmount}
        keyboardType="numeric"
        leftIcon="cash"
      />

      {/* ETA */}
      <Input
        label="Verwachte starttijd"
        placeholder="Bijv. Vandaag 14:00"
        value={eta}
        onChangeText={setEta}
        leftIcon="clock-outline"
      />

      {/* Crew size */}
      <Text style={styles.label}>Crew grootte</Text>
      <View style={styles.stepperRow}>
        <TouchableOpacity
          style={styles.stepperBtn}
          onPress={() => setCrewSize(Math.max(1, crewSize - 1))}
        >
          <Icon name="minus" size={18} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.stepperValue}>{crewSize}</Text>
        <TouchableOpacity
          style={styles.stepperBtn}
          onPress={() => setCrewSize(crewSize + 1)}
        >
          <Icon name="plus" size={18} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Message */}
      <Input
        label="Bericht (optioneel)"
        placeholder="Toelichting op je bod..."
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={3}
        style={styles.messageInput}
        maxLength={500}
      />

      <Button
        title="Bod plaatsen"
        onPress={handleSubmit}
        loading={placeBid.isPending}
        style={styles.submitBtn}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.huge },
  title: { ...typography.h2, color: colors.textPrimary },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xxl,
  },
  label: {
    ...typography.captionBold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  toggle: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  toggleText: { ...typography.bodyBold, color: colors.textPrimary },
  toggleTextActive: { color: colors.white },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    ...typography.h3,
    color: colors.textPrimary,
    minWidth: 30,
    textAlign: 'center',
  },
  messageInput: { height: 80, textAlignVertical: 'top' },
  submitBtn: { marginTop: spacing.xxl },
});
