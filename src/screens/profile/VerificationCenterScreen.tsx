import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { DocumentUpload } from '../../components/verification/DocumentUpload';
import { Card } from '../../components/common/Card';
import { Loading } from '../../components/common/Loading';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { useVerification } from '../../hooks/useVerification';
import { useAuthStore } from '../../store/authStore';
import { DOCUMENT_TYPES } from '../../config/constants';
import { pickPhotos } from '../../services/media.service';

export const VerificationCenterScreen: React.FC = () => {
  const user = useAuthStore(s => s.user);
  const { verification, isLoading, uploadId, verifyKvk, uploadDocument } =
    useVerification();

  if (isLoading) return <Loading />;

  const v = verification;
  const completedCount = [
    user?.phoneVerified,
    v?.idVerified === 'verified',
    v?.isZzp ? v?.kvkVerified === 'verified' : true,
    v?.isZzp ? v?.ibanVerified === 'verified' : true,
  ].filter(Boolean).length;
  const totalCount = v?.isZzp ? 4 : 2;

  const handleIdUpload = async () => {
    const assets = await pickPhotos(2);
    if (assets.length === 0) return;
    const formData = new FormData();
    assets.forEach((a, i) => {
      formData.append('files', {
        uri: a.uri,
        type: a.type,
        name: `id_${i}.jpg`,
      } as any);
    });
    await uploadId(formData);
    Alert.alert('Gelukt', 'ID is geupload en wordt geverifieerd.');
  };

  const handleDocUpload = async (docType: string) => {
    const assets = await pickPhotos(1);
    if (assets.length === 0) return;
    const formData = new FormData();
    formData.append('documentType', docType);
    formData.append('file', {
      uri: assets[0].uri,
      type: assets[0].type,
      name: `${docType}.jpg`,
    } as any);
    await uploadDocument(formData);
    Alert.alert('Gelukt', 'Document is geupload.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Progress */}
      <Card style={styles.progressCard}>
        <Text style={styles.progressTitle}>Verificatie voortgang</Text>
        <Text style={styles.progressValue}>
          {completedCount}/{totalCount} geverifieerd
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(completedCount / totalCount) * 100}%` },
            ]}
          />
        </View>
      </Card>

      {/* Phone */}
      <DocumentUpload
        label="Telefoonnummer"
        status={user?.phoneVerified ? 'verified' : 'none'}
        onUpload={() =>
          Alert.alert(
            'Info',
            'Telefoonverificatie is al gedaan bij registratie.',
          )
        }
      />

      {/* ID */}
      <DocumentUpload
        label="ID-verificatie"
        status={
          v?.idVerified === 'verified'
            ? 'verified'
            : v?.idVerified === 'pending'
            ? 'uploaded'
            : 'none'
        }
        onUpload={handleIdUpload}
      />

      {/* KvK (ZZP only) */}
      {v?.isZzp && (
        <>
          <Text style={styles.sectionTitle}>ZZP / Bedrijf</Text>
          <DocumentUpload
            label="KvK-verificatie"
            status={
              v.kvkVerified === 'verified'
                ? 'verified'
                : v.kvkVerified === 'pending'
                ? 'uploaded'
                : 'none'
            }
            onUpload={() => {
              Alert.prompt?.(
                'KvK-nummer',
                'Voer je 8-cijferige KvK-nummer in',
                [
                  { text: 'Annuleren', style: 'cancel' },
                  {
                    text: 'Verifieer',
                    onPress: (val?: string) => val && verifyKvk(val),
                  },
                ],
              ) ??
                Alert.alert('KvK', 'Voer je KvK-nummer in via het invoerveld.');
            }}
          />
          <DocumentUpload
            label="IBAN-verificatie"
            status={
              v.ibanVerified === 'verified'
                ? 'verified'
                : v.ibanVerified === 'pending'
                ? 'uploaded'
                : 'none'
            }
            onUpload={() => {
              Alert.alert('IBAN', 'Voer je IBAN in via het invoerveld.');
            }}
          />
        </>
      )}

      {/* Documents */}
      <Text style={styles.sectionTitle}>Documenten & Certificaten</Text>
      {DOCUMENT_TYPES.map(doc => {
        const uploaded = v?.documents?.find(d => d.documentType === doc.key);
        return (
          <DocumentUpload
            key={doc.key}
            label={doc.label}
            status={uploaded?.status ?? 'none'}
            onUpload={() => handleDocUpload(doc.key)}
          />
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.huge },
  progressCard: { marginBottom: spacing.xl },
  progressTitle: { ...typography.captionBold, color: colors.textSecondary },
  progressValue: {
    ...typography.h3,
    color: colors.textPrimary,
    marginVertical: spacing.sm,
  },
  progressBar: { height: 6, backgroundColor: colors.border, borderRadius: 3 },
  progressFill: { height: 6, backgroundColor: colors.success, borderRadius: 3 },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
});
