import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import {Button} from '../common/Button';
import {Input} from '../common/Input';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing, borderRadius} from '../../theme/spacing';
import {SUBCATEGORIES, URGENCY_OPTIONS, BUDGET_TYPES} from '../../config/constants';
import type {JobFilters as FilterType} from '../../types/models';

interface Props {
  filters: FilterType;
  onChange: (filters: FilterType) => void;
}

export const JobFilters: React.FC<Props> = ({filters, onChange}) => {
  const [showModal, setShowModal] = useState(false);
  const [draft, setDraft] = useState<FilterType>(filters);

  const activeCount = [
    filters.subcategory,
    filters.urgency,
    filters.budgetType,
    filters.postcode,
  ].filter(Boolean).length;

  const apply = () => {
    onChange(draft);
    setShowModal(false);
  };

  const clear = () => {
    const empty: FilterType = {};
    setDraft(empty);
    onChange(empty);
    setShowModal(false);
  };

  return (
    <>
      {/* Quick filter chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        <TouchableOpacity
          style={[styles.chip, activeCount > 0 && styles.chipActive]}
          onPress={() => setShowModal(true)}>
          <Icon name="filter-variant" size={16} color={activeCount > 0 ? colors.white : colors.textPrimary} />
          <Text style={[styles.chipText, activeCount > 0 && styles.chipTextActive]}>
            Filters{activeCount > 0 ? ` (${activeCount})` : ''}
          </Text>
        </TouchableOpacity>

        {URGENCY_OPTIONS.map(u => (
          <TouchableOpacity
            key={u.key}
            style={[styles.chip, filters.urgency === u.key && styles.chipActive]}
            onPress={() => onChange({...filters, urgency: filters.urgency === u.key ? undefined : u.key as any})}>
            <Text
              style={[
                styles.chipText,
                filters.urgency === u.key && styles.chipTextActive,
              ]}>
              {u.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Full filter modal */}
      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={typography.h3}>Filters</Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Icon name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {/* Subcategory */}
            <Text style={styles.sectionTitle}>Categorie</Text>
            <View style={styles.optionGrid}>
              {SUBCATEGORIES.map(s => (
                <TouchableOpacity
                  key={s.key}
                  style={[styles.optionChip, draft.subcategory === s.key && styles.optionActive]}
                  onPress={() => setDraft({...draft, subcategory: draft.subcategory === s.key ? undefined : s.key})}>
                  <Icon name={s.icon} size={16} color={draft.subcategory === s.key ? colors.white : colors.textPrimary} />
                  <Text style={[styles.optionText, draft.subcategory === s.key && styles.optionTextActive]}>
                    {s.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Budget type */}
            <Text style={styles.sectionTitle}>Budget type</Text>
            <View style={styles.optionGrid}>
              {BUDGET_TYPES.map(b => (
                <TouchableOpacity
                  key={b.key}
                  style={[styles.optionChip, draft.budgetType === b.key && styles.optionActive]}
                  onPress={() => setDraft({...draft, budgetType: draft.budgetType === b.key ? undefined : b.key as any})}>
                  <Text style={[styles.optionText, draft.budgetType === b.key && styles.optionTextActive]}>
                    {b.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Postcode */}
            <Text style={styles.sectionTitle}>Locatie</Text>
            <Input
              placeholder="Postcode (bijv. 1012)"
              value={draft.postcode ?? ''}
              onChangeText={v => setDraft({...draft, postcode: v || undefined})}
              leftIcon="map-marker"
            />
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button title="Wissen" onPress={clear} variant="ghost" />
            <Button title="Toepassen" onPress={apply} />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  chipRow: {paddingHorizontal: spacing.lg, paddingVertical: spacing.sm},
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceSecondary,
    marginRight: spacing.sm,
    gap: spacing.xxs,
  },
  chipActive: {backgroundColor: colors.primary},
  chipText: {...typography.caption, color: colors.textPrimary},
  chipTextActive: {color: colors.white},
  modal: {flex: 1, backgroundColor: colors.background},
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  modalBody: {flex: 1, padding: spacing.lg},
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.md,
  },
  sectionTitle: {...typography.h4, color: colors.textPrimary, marginTop: spacing.lg, marginBottom: spacing.sm},
  optionGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  optionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceSecondary,
    gap: spacing.xs,
  },
  optionActive: {backgroundColor: colors.primary},
  optionText: {...typography.caption, color: colors.textPrimary},
  optionTextActive: {color: colors.white},
});
