import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Loading } from '../../components/common/Loading';
import { EmptyState } from '../../components/common/EmptyState';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { usePoolMembers, usePoolActions } from '../../hooks/usePool';
import { CSV_TEMPLATE_EXAMPLE } from '../../services/csv.service';
import { useI18n } from '../../i18n/I18nProvider';
import type { PoolMember } from '../../types/models';

export const PrivatePoolScreen: React.FC = () => {
  const {t} = useI18n();
  // In real app, orgId comes from user's organization
  const orgId = 'current-org';
  const { data: members, isLoading } = usePoolMembers(orgId);
  const { addMember, removeMember } = usePoolActions(orgId);

  const [showAddModal, setShowAddModal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const statusVariant: Record<string, 'warning' | 'success' | 'error'> = {
    invited: 'warning',
    accepted: 'success',
    declined: 'error',
  };

  const handleAdd = async () => {
    if (!firstName || !lastName || !email) {
      Alert.alert(t('Fout'), t('Voornaam, achternaam en e-mail zijn verplicht.'));
      return;
    }
    await addMember({ firstName, lastName, email, phone: phone || undefined });
    setShowAddModal(false);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
  };

  const handleCsvImport = () => {
    // In real app, use document picker. Here we show placeholder
    Alert.alert(
      t('CSV Import'),
      t('In de volledige versie kun je hier een CSV bestand uploaden.\n\nTemplate format:\n') +
        CSV_TEMPLATE_EXAMPLE,
    );
  };

  const handleRemove = (member: PoolMember) => {
    Alert.alert(
      t('Lid verwijderen'),
      t(`Weet je zeker dat je ${member.firstName} ${member.lastName} wilt verwijderen?`),
      [
        { text: t('Annuleren'), style: 'cancel' },
        {
          text: t('Verwijderen'),
          style: 'destructive',
          onPress: () => removeMember(member.id),
        },
      ],
    );
  };

  const renderMember = ({ item }: { item: PoolMember }) => (
    <Card style={styles.memberCard}>
      <View style={styles.memberRow}>
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>
            {item.firstName} {item.lastName}
          </Text>
          <Text style={styles.memberEmail}>{item.email}</Text>
        </View>
        <Badge
          label={
            item.status === 'invited'
              ? t('Uitgenodigd')
              : item.status === 'accepted'
              ? t('Geaccepteerd')
              : t('Afgewezen')
          }
          variant={statusVariant[item.status]}
          small
        />
      </View>
      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => handleRemove(item)}
      >
        <Icon name="close" size={16} color={colors.error} />
      </TouchableOpacity>
    </Card>
  );

  if (isLoading) return <Loading />;

  return (
    <View style={styles.container}>
      <View style={styles.headerActions}>
        <Button
          title={t('Lid toevoegen')}
          onPress={() => setShowAddModal(true)}
          size="sm"
        />
        <Button
          title={t('CSV importeren')}
          onPress={handleCsvImport}
          variant="outline"
          size="sm"
        />
      </View>

      <FlatList
        data={members ?? []}
        keyExtractor={item => item.id}
        renderItem={renderMember}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="account-group-outline"
            title={t('Lege pool')}
            message={t('Voeg vakmannen toe aan je privaat pool')}
          />
        }
      />

      {/* Add member modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={typography.h3}>{t('Lid toevoegen')}</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Icon name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            <Input
              label={t('Voornaam')}
              value={firstName}
              onChangeText={setFirstName}
            />
            <Input
              label={t('Achternaam')}
              value={lastName}
              onChangeText={setLastName}
            />
            <Input
              label={t('E-mail')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input
              label={t('Telefoon (optioneel)')}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </ScrollView>
          <View style={styles.modalFooter}>
            <Button title={t('Toevoegen')} onPress={handleAdd} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerActions: { flexDirection: 'row', gap: spacing.sm, padding: spacing.lg },
  list: { padding: spacing.lg, paddingTop: 0, paddingBottom: 40 },
  memberCard: { marginBottom: spacing.sm, position: 'relative' },
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberInfo: { flex: 1 },
  memberName: { ...typography.bodyBold, color: colors.textPrimary },
  memberEmail: { ...typography.caption, color: colors.textSecondary },
  removeBtn: { position: 'absolute', top: spacing.sm, right: spacing.sm },
  modal: { flex: 1, backgroundColor: colors.background },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  modalBody: { flex: 1, padding: spacing.lg },
  modalFooter: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
});
