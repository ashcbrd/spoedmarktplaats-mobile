import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { ImagePickerButton } from '../../components/media/ImagePickerButton';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import {
  SUBCATEGORIES,
  URGENCY_OPTIONS,
  BUDGET_TYPES,
} from '../../config/constants';
import { useCreateJob, usePublishJob } from '../../hooks/useJobs';
import { useCredits } from '../../hooks/useCredits';
import { formatBudget } from '../../utils/formatters';
import type { Asset } from '../../services/media.service';

const TOTAL_STEPS = 8;

export const CreateJobScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const createJob = useCreateJob();
  const publishJob = usePublishJob();
  const { checkAndConsume } = useCredits();

  const [step, setStep] = useState(0);
  const [subcategory, setSubcategory] = useState('');
  const [urgency, setUrgency] = useState('');
  const [postcode, setPostcode] = useState('');
  const [city, setCity] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<Asset[]>([]);
  const [budgetType, setBudgetType] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [ownTools, setOwnTools] = useState(false);
  const [ownTransport, setOwnTransport] = useState(false);
  const [bouwpas, setBouwpas] = useState(false);
  const [vca, setVca] = useState(false);
  const [accessNotes, setAccessNotes] = useState('');
  const [workersNeeded, setWorkersNeeded] = useState(1);
  const [visibility, setVisibility] = useState<'public' | 'private_pool'>(
    'public',
  );
  const [publishing, setPublishing] = useState(false);

  const canNext = useCallback((): boolean => {
    switch (step) {
      case 0:
        return !!subcategory;
      case 1:
        return !!urgency;
      case 2:
        return postcode.length >= 4 && city.length >= 2;
      case 3:
        return title.length >= 5 && description.length >= 20;
      case 4:
        return true; // photos optional
      case 5:
        return !!budgetType;
      case 6:
        return true; // requirements optional
      case 7:
        return true; // review
      default:
        return false;
    }
  }, [
    step,
    subcategory,
    urgency,
    postcode,
    city,
    title,
    description,
    budgetType,
  ]);

  const handlePublish = async () => {
    const ok = await checkAndConsume(1, 'een opdracht te publiceren');
    if (!ok) return;
    setPublishing(true);
    try {
      const job = await createJob.mutateAsync({
        subcategory,
        title,
        description,
        postcode,
        city,
        urgency: urgency as any,
        budgetType: budgetType as any,
        budgetAmount: budgetAmount ? parseFloat(budgetAmount) : undefined,
        budgetMin: budgetMin ? parseFloat(budgetMin) : undefined,
        budgetMax: budgetMax ? parseFloat(budgetMax) : undefined,
        requirements: {
          ownTools,
          ownTransport,
          bouwpasRequired: bouwpas,
          vcaRequired: vca,
          accessNotes,
        },
        workersNeeded,
        visibility,
        attachments: [],
      });
      await publishJob.mutateAsync(job.id);
      Alert.alert('Gelukt!', 'Je opdracht is gepubliceerd.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      // error handled by hooks
    } finally {
      setPublishing(false);
    }
  };

  const subcatObj = SUBCATEGORIES.find(s => s.key === subcategory);

  return (
    <View style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${((step + 1) / (TOTAL_STEPS + 1)) * 100}%` },
          ]}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Step 0: Subcategory */}
        {step === 0 && (
          <>
            <Text style={styles.stepTitle}>Welk type werk?</Text>
            <View style={styles.grid}>
              {SUBCATEGORIES.map(s => (
                <TouchableOpacity
                  key={s.key}
                  style={[
                    styles.catChip,
                    subcategory === s.key && styles.catActive,
                  ]}
                  onPress={() => setSubcategory(s.key)}
                >
                  <Icon
                    name={s.icon}
                    size={24}
                    color={
                      subcategory === s.key ? colors.white : colors.textPrimary
                    }
                  />
                  <Text
                    style={[
                      styles.catText,
                      subcategory === s.key && { color: colors.white },
                    ]}
                  >
                    {s.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Step 1: Urgency */}
        {step === 1 && (
          <>
            <Text style={styles.stepTitle}>Hoe dringend?</Text>
            {URGENCY_OPTIONS.map(u => (
              <TouchableOpacity
                key={u.key}
                style={[
                  styles.urgencyCard,
                  urgency === u.key && styles.urgencyActive,
                ]}
                onPress={() => setUrgency(u.key)}
              >
                <Text
                  style={[
                    styles.urgencyLabel,
                    urgency === u.key && { color: colors.white },
                  ]}
                >
                  {u.label}
                </Text>
                <Text
                  style={[
                    styles.urgencyDesc,
                    urgency === u.key && { color: colors.white + 'CC' },
                  ]}
                >
                  {u.description}
                </Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <>
            <Text style={styles.stepTitle}>Waar is het werk?</Text>
            <Input
              label="Postcode"
              placeholder="1012 AB"
              value={postcode}
              onChangeText={setPostcode}
              leftIcon="map-marker"
            />
            <Input
              label="Stad"
              placeholder="Amsterdam"
              value={city}
              onChangeText={setCity}
              leftIcon="city"
            />
          </>
        )}

        {/* Step 3: Title + Description */}
        {step === 3 && (
          <>
            <Text style={styles.stepTitle}>Beschrijf de opdracht</Text>
            <Input
              label="Titel"
              placeholder="Bijv. Lekkage verhelpen in badkamer"
              value={title}
              onChangeText={setTitle}
              maxLength={120}
            />
            <Input
              label="Omschrijving"
              placeholder="Beschrijf het werk zo duidelijk mogelijk..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={5}
              style={styles.descriptionInput}
            />
          </>
        )}

        {/* Step 4: Photos */}
        {step === 4 && (
          <>
            <Text style={styles.stepTitle}>Foto's toevoegen</Text>
            <Text style={styles.stepDesc}>
              Voeg foto's toe om de opdracht te verduidelijken (optioneel)
            </Text>
            <ImagePickerButton
              assets={photos}
              onChange={setPhotos}
              maxPhotos={5}
            />
          </>
        )}

        {/* Step 5: Budget */}
        {step === 5 && (
          <>
            <Text style={styles.stepTitle}>Budget</Text>
            <View style={styles.grid}>
              {BUDGET_TYPES.map(b => (
                <TouchableOpacity
                  key={b.key}
                  style={[
                    styles.catChip,
                    budgetType === b.key && styles.catActive,
                  ]}
                  onPress={() => setBudgetType(b.key)}
                >
                  <Text
                    style={[
                      styles.catText,
                      budgetType === b.key && { color: colors.white },
                    ]}
                  >
                    {b.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {budgetType === 'fixed' && (
              <Input
                label="Bedrag (€)"
                placeholder="250"
                value={budgetAmount}
                onChangeText={setBudgetAmount}
                keyboardType="numeric"
              />
            )}
            {budgetType === 'hourly' && (
              <Input
                label="Uurtarief (€)"
                placeholder="45"
                value={budgetAmount}
                onChangeText={setBudgetAmount}
                keyboardType="numeric"
              />
            )}
            {budgetType === 'range' && (
              <>
                <Input
                  label="Minimum (€)"
                  placeholder="100"
                  value={budgetMin}
                  onChangeText={setBudgetMin}
                  keyboardType="numeric"
                />
                <Input
                  label="Maximum (€)"
                  placeholder="500"
                  value={budgetMax}
                  onChangeText={setBudgetMax}
                  keyboardType="numeric"
                />
              </>
            )}
          </>
        )}

        {/* Step 6: Requirements */}
        {step === 6 && (
          <>
            <Text style={styles.stepTitle}>Vereisten</Text>
            {[
              { label: 'Eigen gereedschap', value: ownTools, set: setOwnTools },
              {
                label: 'Eigen vervoer',
                value: ownTransport,
                set: setOwnTransport,
              },
              { label: 'Bouwpas vereist', value: bouwpas, set: setBouwpas },
              { label: 'VCA certificaat vereist', value: vca, set: setVca },
            ].map(item => (
              <View key={item.label} style={styles.reqRow}>
                <Text style={styles.reqLabel}>{item.label}</Text>
                <Switch
                  value={item.value}
                  onValueChange={item.set}
                  trackColor={{ true: colors.primary, false: colors.border }}
                />
              </View>
            ))}
            <Input
              label="Toegangsnotities (optioneel)"
              placeholder="Bijv. Sleutel bij buren nr. 4"
              value={accessNotes}
              onChangeText={setAccessNotes}
              multiline
            />
          </>
        )}

        {/* Step 7: Workers + Visibility */}
        {step === 7 && (
          <>
            <Text style={styles.stepTitle}>Laatste details</Text>
            <Text style={styles.label}>Aantal werknemers nodig</Text>
            <View style={styles.stepperRow}>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setWorkersNeeded(Math.max(1, workersNeeded - 1))}
              >
                <Icon name="minus" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.stepperValue}>{workersNeeded}</Text>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setWorkersNeeded(workersNeeded + 1)}
              >
                <Icon name="plus" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.label, { marginTop: spacing.xl }]}>
              Zichtbaarheid
            </Text>
            <View style={styles.grid}>
              <TouchableOpacity
                style={[
                  styles.catChip,
                  visibility === 'public' && styles.catActive,
                ]}
                onPress={() => setVisibility('public')}
              >
                <Icon
                  name="earth"
                  size={20}
                  color={
                    visibility === 'public' ? colors.white : colors.textPrimary
                  }
                />
                <Text
                  style={[
                    styles.catText,
                    visibility === 'public' && { color: colors.white },
                  ]}
                >
                  Openbaar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.catChip,
                  visibility === 'private_pool' && styles.catActive,
                ]}
                onPress={() => setVisibility('private_pool')}
              >
                <Icon
                  name="lock"
                  size={20}
                  color={
                    visibility === 'private_pool'
                      ? colors.white
                      : colors.textPrimary
                  }
                />
                <Text
                  style={[
                    styles.catText,
                    visibility === 'private_pool' && { color: colors.white },
                  ]}
                >
                  Privaat Pool
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Step 8: Review */}
        {step === 8 && (
          <>
            <Text style={styles.stepTitle}>Controleer je opdracht</Text>
            <View style={styles.reviewCard}>
              <Text style={styles.reviewLabel}>Categorie</Text>
              <Text style={styles.reviewValue}>{subcatObj?.label}</Text>
              <Text style={styles.reviewLabel}>Urgentie</Text>
              <Text style={styles.reviewValue}>
                {URGENCY_OPTIONS.find(u => u.key === urgency)?.label}
              </Text>
              <Text style={styles.reviewLabel}>Locatie</Text>
              <Text style={styles.reviewValue}>
                {postcode} {city}
              </Text>
              <Text style={styles.reviewLabel}>Titel</Text>
              <Text style={styles.reviewValue}>{title}</Text>
              <Text style={styles.reviewLabel}>Budget</Text>
              <Text style={styles.reviewValue}>
                {formatBudget(
                  budgetType as any,
                  budgetAmount ? parseFloat(budgetAmount) : undefined,
                  budgetMin ? parseFloat(budgetMin) : undefined,
                  budgetMax ? parseFloat(budgetMax) : undefined,
                )}
              </Text>
              <Text style={styles.reviewLabel}>Werknemers</Text>
              <Text style={styles.reviewValue}>{workersNeeded}</Text>
              <Text style={styles.reviewLabel}>Zichtbaarheid</Text>
              <Text style={styles.reviewValue}>
                {visibility === 'public' ? 'Openbaar' : 'Privaat Pool'}
              </Text>
            </View>
            <Badge
              label="1 credit vereist om te publiceren"
              variant="warning"
              icon="alert-circle"
            />
          </>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {step > 0 && (
          <Button
            title="Terug"
            onPress={() => setStep(step - 1)}
            variant="ghost"
          />
        )}
        <View style={styles.footerSpacer} />
        {step < TOTAL_STEPS ? (
          <Button
            title="Volgende"
            onPress={() => setStep(step + 1)}
            disabled={!canNext()}
          />
        ) : (
          <Button
            title="Publiceren"
            onPress={handlePublish}
            loading={publishing}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  progressBar: { height: 3, backgroundColor: colors.border },
  progressFill: { height: 3, backgroundColor: colors.primary },
  content: { padding: spacing.xl, paddingBottom: spacing.huge },
  stepTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  stepDesc: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  catActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  catText: { ...typography.body, color: colors.textPrimary },
  urgencyCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  urgencyActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  urgencyLabel: { ...typography.h3, color: colors.textPrimary },
  urgencyDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  label: {
    ...typography.captionBold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  reqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  reqLabel: { ...typography.body, color: colors.textPrimary },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  stepperBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    ...typography.h2,
    color: colors.textPrimary,
    minWidth: 40,
    textAlign: 'center',
  },
  reviewCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  reviewLabel: {
    ...typography.captionBold,
    color: colors.textTertiary,
    marginTop: spacing.sm,
  },
  reviewValue: { ...typography.body, color: colors.textPrimary },
  descriptionInput: { height: 120, textAlignVertical: 'top' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  footerSpacer: { flex: 1 },
});
