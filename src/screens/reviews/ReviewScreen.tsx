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
import { useSubmitReview } from '../../hooks/useReviews';
import {
  REVIEW_TAGS_POSITIVE,
  REVIEW_TAGS_NEGATIVE,
} from '../../config/constants';
import type { DealsStackParamList } from '../../types/navigation';

export const ReviewScreen: React.FC = () => {
  const route = useRoute<RouteProp<DealsStackParamList, 'Review'>>();
  const navigation = useNavigation<any>();
  const { dealId } = route.params;
  const submitReview = useSubmitReview();

  const [stars, setStars] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [text, setText] = useState('');

  const toggleTag = (tag: string) => {
    setTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag],
    );
  };

  const handleSubmit = async () => {
    if (stars === 0) {
      Alert.alert('Fout', 'Geef minimaal 1 ster');
      return;
    }
    try {
      await submitReview.mutateAsync({
        dealId,
        stars,
        tags,
        text: text || undefined,
      });
      Alert.alert('Bedankt!', 'Je review is geplaatst.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      // handled by hook
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Hoe was je ervaring?</Text>

      {/* Stars */}
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map(s => (
          <TouchableOpacity key={s} onPress={() => setStars(s)}>
            <Icon
              name={s <= stars ? 'star' : 'star-outline'}
              size={44}
              color={s <= stars ? colors.warning : colors.border}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Positive tags */}
      <Text style={styles.sectionTitle}>Wat ging goed?</Text>
      <View style={styles.tagGrid}>
        {REVIEW_TAGS_POSITIVE.map(tag => (
          <TouchableOpacity
            key={tag}
            style={[styles.tag, tags.includes(tag) && styles.tagActive]}
            onPress={() => toggleTag(tag)}
          >
            <Icon
              name="thumb-up"
              size={14}
              color={tags.includes(tag) ? colors.white : colors.success}
            />
            <Text
              style={[
                styles.tagText,
                tags.includes(tag) && styles.tagTextActive,
              ]}
            >
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Negative tags */}
      <Text style={styles.sectionTitle}>Wat kan beter?</Text>
      <View style={styles.tagGrid}>
        {REVIEW_TAGS_NEGATIVE.map(tag => (
          <TouchableOpacity
            key={tag}
            style={[styles.tag, tags.includes(tag) && styles.tagActiveBad]}
            onPress={() => toggleTag(tag)}
          >
            <Icon
              name="thumb-down"
              size={14}
              color={tags.includes(tag) ? colors.white : colors.error}
            />
            <Text
              style={[
                styles.tagText,
                tags.includes(tag) && styles.tagTextActive,
              ]}
            >
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Text review */}
      <Input
        label="Toelichting (optioneel)"
        placeholder="Vertel meer over je ervaring..."
        value={text}
        onChangeText={setText}
        multiline
        numberOfLines={4}
        style={styles.reviewInput}
        maxLength={1000}
      />

      <Button
        title="Review plaatsen"
        onPress={handleSubmit}
        loading={submitReview.isPending}
        disabled={stars === 0}
        style={styles.submitBtn}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.huge },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  tagGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagActive: { backgroundColor: colors.success, borderColor: colors.success },
  tagActiveBad: { backgroundColor: colors.error, borderColor: colors.error },
  tagText: { ...typography.caption, color: colors.textPrimary },
  tagTextActive: { color: colors.white },
  reviewInput: { height: 100, textAlignVertical: 'top' },
  submitBtn: { marginTop: spacing.xxl },
});
