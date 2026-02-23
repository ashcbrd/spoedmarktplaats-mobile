import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import {Button} from '../common/Button';
import {Chip} from '../common/Chip';
import {Input} from '../common/Input';
import {SheetModal} from '../common/SheetModal';
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        <Chip
          icon="filter-variant"
          label={`Filters${activeCount > 0 ? ` (${activeCount})` : ''}`}
          selected={activeCount > 0}
          onPress={() => setShowModal(true)}
        />
        {URGENCY_OPTIONS.map(u => (
          <Chip
            key={u.key}
            label={u.label}
            selected={filters.urgency === u.key}
            onPress={() =>
              onChange({
                ...filters,
                urgency: filters.urgency === u.key ? undefined : (u.key as any),
              })
            }
          />
        ))}
      </ScrollView>

      <SheetModal
        visible={showModal}
        title="Filters"
        onClose={() => setShowModal(false)}
        footer={
          <View style={styles.modalFooter}>
            <Button title="Wissen" onPress={clear} variant="ghost" />
            <Button title="Toepassen" onPress={apply} />
          </View>
        }
      >
        <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Categorie</Text>
          <View style={styles.optionGrid}>
            {SUBCATEGORIES.map(s => (
              <TouchableOpacity
                key={s.key}
                style={[styles.optionChip, draft.subcategory === s.key && styles.optionActive]}
                onPress={() =>
                  setDraft({
                    ...draft,
                    subcategory: draft.subcategory === s.key ? undefined : s.key,
                  })
                }
              >
                <Icon
                  name={s.icon}
                  size={16}
                  color={draft.subcategory === s.key ? colors.white : colors.textPrimary}
                />
                <Text
                  style={[
                    styles.optionText,
                    draft.subcategory === s.key && styles.optionTextActive,
                  ]}
                >
                  {s.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Budget type</Text>
          <View style={styles.optionGrid}>
            {BUDGET_TYPES.map(b => (
              <TouchableOpacity
                key={b.key}
                style={[styles.optionChip, draft.budgetType === b.key && styles.optionActive]}
                onPress={() =>
                  setDraft({
                    ...draft,
                    budgetType: draft.budgetType === b.key ? undefined : (b.key as any),
                  })
                }
              >
                <Text
                  style={[
                    styles.optionText,
                    draft.budgetType === b.key && styles.optionTextActive,
                  ]}
                >
                  {b.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Locatie</Text>
          <Input
            placeholder="Postcode (bijv. 1012)"
            value={draft.postcode ?? ''}
            onChangeText={v => setDraft({...draft, postcode: v || undefined})}
            leftIcon="map-marker"
          />
        </ScrollView>
      </SheetModal>
    </>
  );
};

const styles = StyleSheet.create({
  chipRow: {paddingHorizontal: spacing.xl, paddingVertical: spacing.md},
  modalBody: {maxHeight: 500},
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  optionGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  optionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  optionActive: {backgroundColor: colors.secondary, borderColor: colors.secondary},
  optionText: {...typography.caption, color: colors.textPrimary},
  optionTextActive: {color: colors.white},
});
