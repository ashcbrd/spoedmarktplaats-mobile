import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Loading } from '../../components/common/Loading';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { SUBCATEGORIES } from '../../config/constants';
import { useAuthStore } from '../../store/authStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../../api/endpoints/users';

export const PreferencesScreen: React.FC = () => {
  const userId = useAuthStore(s => s.user?.id ?? '');
  const qc = useQueryClient();
  const { data: profile, isLoading } = useQuery({
    queryKey: ['provider', userId],
    queryFn: () => usersApi.getProviderProfile(userId),
    enabled: !!userId,
  });

  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [postcode, setPostcode] = useState('');
  const [radius, setRadius] = useState(15);
  const [minRate, setMinRate] = useState('');
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    if (profile) {
      setSubcategories(profile.subcategories);
      setPostcode(profile.serviceAreaPostcode);
      setRadius(profile.radiusKm);
      setMinRate(profile.minRate?.toString() ?? '');
      setAvailable(profile.availabilityToggle);
    }
  }, [profile]);

  const saveMutation = useMutation({
    mutationFn: () =>
      usersApi.updateProviderProfile(userId, {
        subcategories,
        serviceAreaPostcode: postcode,
        radiusKm: radius,
        minRate: minRate ? parseFloat(minRate) : undefined,
        availabilityToggle: available,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['provider'] });
      Alert.alert('Opgeslagen', 'Je voorkeuren zijn bijgewerkt.');
    },
  });

  const toggleCat = (key: string) => {
    setSubcategories(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key],
    );
  };

  if (isLoading) return <Loading />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Specialisaties</Text>
      <View style={styles.grid}>
        {SUBCATEGORIES.map(s => {
          const active = subcategories.includes(s.key);
          return (
            <TouchableOpacity
              key={s.key}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => toggleCat(s.key)}
            >
              <Icon
                name={s.icon}
                size={16}
                color={active ? colors.white : colors.textPrimary}
              />
              <Text
                style={[styles.chipText, active && { color: colors.white }]}
              >
                {s.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Werkgebied</Text>
      <Input
        label="Postcode"
        value={postcode}
        onChangeText={setPostcode}
        leftIcon="map-marker"
      />
      <Text style={styles.label}>Straal: {radius} km</Text>
      <View style={styles.radiusRow}>
        {[10, 15, 25, 50].map(r => (
          <TouchableOpacity
            key={r}
            style={[styles.radiusChip, radius === r && styles.radiusActive]}
            onPress={() => setRadius(r)}
          >
            <Text
              style={[
                styles.radiusText,
                radius === r && { color: colors.white },
              ]}
            >
              {r} km
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Tarief</Text>
      <Input
        label="Minimumtarief (€/uur)"
        placeholder="35"
        value={minRate}
        onChangeText={setMinRate}
        keyboardType="numeric"
        leftIcon="cash"
      />

      <Text style={styles.sectionTitle}>Beschikbaarheid</Text>
      <View style={styles.switchRow}>
        <View style={styles.switchTextWrap}>
          <Text style={styles.switchLabel}>Beschikbaar voor spoedklussen</Text>
          <Text style={styles.switchDesc}>
            Je ontvangt meldingen bij nieuwe opdrachten
          </Text>
        </View>
        <Switch
          value={available}
          onValueChange={setAvailable}
          trackColor={{ true: colors.primary, false: colors.border }}
        />
      </View>

      <Button
        title="Opslaan"
        onPress={() => saveMutation.mutate()}
        loading={saveMutation.isPending}
        style={styles.saveBtn}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.huge },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { ...typography.caption, color: colors.textPrimary },
  label: {
    ...typography.captionBold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  radiusRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  radiusChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  radiusActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  radiusText: { ...typography.body, color: colors.textPrimary },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  switchTextWrap: { flex: 1 },
  switchLabel: { ...typography.bodyBold, color: colors.textPrimary },
  switchDesc: { ...typography.caption, color: colors.textSecondary },
  saveBtn: { marginTop: spacing.xxl },
});
