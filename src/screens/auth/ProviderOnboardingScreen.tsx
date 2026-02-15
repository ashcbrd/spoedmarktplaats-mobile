import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import {Button} from '../../components/common/Button';
import {Input} from '../../components/common/Input';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing, borderRadius} from '../../theme/spacing';
import {SUBCATEGORIES} from '../../config/constants';

export const ProviderOnboardingScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [step, setStep] = useState(0);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [postcode, setPostcode] = useState('');
  const [radius, setRadius] = useState(15);
  const [minRate, setMinRate] = useState('');
  const [available, setAvailable] = useState(true);

  const toggleCat = (key: string) => {
    setSelectedCats(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key],
    );
  };

  const finish = () => {
    navigation.reset({index: 0, routes: [{name: 'Main'}]});
  };

  const canNext =
    (step === 0 && selectedCats.length > 0) ||
    (step === 1 && postcode.length >= 4) ||
    step === 2;

  return (
    <View style={styles.container}>
      {/* Progress */}
      <View style={styles.progress}>
        {[0, 1, 2].map(i => (
          <View key={i} style={[styles.dot, i <= step && styles.dotActive]} />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {step === 0 && (
          <>
            <Text style={styles.title}>Wat voor werk doe je?</Text>
            <Text style={styles.subtitle}>Selecteer je specialisaties</Text>
            <View style={styles.grid}>
              {SUBCATEGORIES.map(s => {
                const active = selectedCats.includes(s.key);
                return (
                  <TouchableOpacity
                    key={s.key}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => toggleCat(s.key)}>
                    <Icon name={s.icon} size={20} color={active ? colors.white : colors.textPrimary} />
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{s.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {step === 1 && (
          <>
            <Text style={styles.title}>Waar wil je werken?</Text>
            <Text style={styles.subtitle}>Stel je werkgebied in</Text>
            <Input label="Postcode" placeholder="1012 AB" value={postcode} onChangeText={setPostcode} leftIcon="map-marker" />
            <Text style={styles.label}>Straal: {radius} km</Text>
            <View style={styles.radiusRow}>
              {[10, 15, 25, 50].map(r => (
                <TouchableOpacity
                  key={r}
                  style={[styles.radiusChip, radius === r && styles.radiusActive]}
                  onPress={() => setRadius(r)}>
                  <Text style={[styles.radiusText, radius === r && styles.radiusTextActive]}>{r} km</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.title}>Laatste stap</Text>
            <Text style={styles.subtitle}>Stel je tarief en beschikbaarheid in</Text>
            <Input
              label="Minimumtarief (€/uur, optioneel)"
              placeholder="35"
              value={minRate}
              onChangeText={setMinRate}
              keyboardType="numeric"
              leftIcon="cash"
            />
            <View style={styles.switchRow}>
              <View style={styles.switchInfo}>
                <Text style={styles.switchLabel}>Beschikbaar voor spoedklussen</Text>
                <Text style={styles.switchDesc}>Je ontvangt meldingen bij nieuwe opdrachten</Text>
              </View>
              <Switch value={available} onValueChange={setAvailable} trackColor={{true: colors.primary, false: colors.border}} />
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {step > 0 && <Button title="Terug" onPress={() => setStep(step - 1)} variant="ghost" />}
        {step < 2 ? (
          <Button title="Volgende" onPress={() => setStep(step + 1)} disabled={!canNext} style={styles.nextBtn} />
        ) : (
          <Button title="Voltooien" onPress={finish} style={styles.nextBtn} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  progress: {flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, paddingVertical: spacing.md},
  dot: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border},
  dotActive: {backgroundColor: colors.primary, width: 24},
  content: {padding: spacing.xl, paddingBottom: spacing.huge},
  title: {...typography.h2, color: colors.textPrimary, marginBottom: spacing.xs},
  subtitle: {...typography.body, color: colors.textSecondary, marginBottom: spacing.xxl},
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderRadius: borderRadius.md, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border,
  },
  chipActive: {backgroundColor: colors.primary, borderColor: colors.primary},
  chipText: {...typography.body, color: colors.textPrimary},
  chipTextActive: {color: colors.white},
  label: {...typography.captionBold, color: colors.textSecondary, marginBottom: spacing.sm},
  radiusRow: {flexDirection: 'row', gap: spacing.sm},
  radiusChip: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
    borderRadius: borderRadius.full, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border,
  },
  radiusActive: {backgroundColor: colors.primary, borderColor: colors.primary},
  radiusText: {...typography.body, color: colors.textPrimary},
  radiusTextActive: {color: colors.white},
  switchRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.xl, gap: spacing.md},
  switchInfo: {flex: 1},
  switchLabel: {...typography.bodyBold, color: colors.textPrimary},
  switchDesc: {...typography.caption, color: colors.textSecondary},
  footer: {flexDirection: 'row', justifyContent: 'space-between', padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface},
  nextBtn: {flex: 1, marginLeft: spacing.sm},
});
