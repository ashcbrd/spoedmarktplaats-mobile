import React, { type ComponentProps } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { useAuth } from '../../hooks/useAuth';
import { useCreditsStore } from '../../store/creditsStore';

interface MenuItem {
  icon: ComponentProps<typeof Icon>['name'];
  label: string;
  screen: string;
  show?: boolean;
}

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();
  const balance = useCreditsStore(s => s.balance);

  const isProvider = user?.role === 'provider';
  const isB2B = user?.clientType === 'b2b';

  const menuItems: MenuItem[] = [
    {
      icon: 'shield-check',
      label: 'Verificatie',
      screen: 'VerificationCenter',
    },
    { icon: 'credit-card', label: `Credits (${balance})`, screen: 'Credits' },
    { icon: 'bell', label: 'Meldingen', screen: 'Notifications' },
    {
      icon: 'tune',
      label: 'Voorkeuren',
      screen: 'Preferences',
      show: isProvider,
    },
    {
      icon: 'account-group',
      label: 'Privaat Pool',
      screen: 'PrivatePool',
      show: isB2B,
    },
    { icon: 'cog', label: 'Instellingen', screen: 'Settings' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile header */}
      <View style={styles.header}>
        <Avatar name={user?.name} size={72} />
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Badge
          label={isProvider ? 'Vakman' : isB2B ? 'Zakelijk' : 'Particulier'}
          variant={isProvider ? 'primary' : 'info'}
          icon={isProvider ? 'wrench' : 'account'}
        />
      </View>

      {/* Menu items */}
      <View style={styles.menu}>
        {menuItems
          .filter(item => item.show !== false)
          .map(item => (
            <TouchableOpacity
              key={item.screen}
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Icon name={item.icon} size={22} color={colors.textPrimary} />
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Icon
                name="chevron-right"
                size={20}
                color={colors.textTertiary}
              />
            </TouchableOpacity>
          ))}
      </View>

      {/* Logout */}
      <Button
        title="Uitloggen"
        onPress={logout}
        variant="danger"
        style={styles.logoutBtn}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.huge },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    backgroundColor: colors.surface,
  },
  name: { ...typography.h2, color: colors.textPrimary, marginTop: spacing.md },
  email: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  menu: { backgroundColor: colors.surface, marginTop: spacing.lg },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: spacing.md,
  },
  menuLabel: { ...typography.body, color: colors.textPrimary, flex: 1 },
  logoutBtn: { margin: spacing.xl },
});
