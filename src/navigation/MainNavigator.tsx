import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useAuthStore } from '../store/authStore';
import { useNotificationsStore } from '../store/notificationsStore';
import type {
  MainTabParamList,
  FeedStackParamList,
  JobsStackParamList,
  DealsStackParamList,
  ProfileStackParamList,
} from '../types/navigation';

// ── Screens ──────────────────────────────────
import { JobFeedScreen } from '../screens/feed/JobFeedScreen';
import { JobDetailScreen } from '../screens/feed/JobDetailScreen';
import { PlaceBidScreen } from '../screens/bids/PlaceBidScreen';
import { MyJobsScreen } from '../screens/jobs/MyJobsScreen';
import { CreateJobScreen } from '../screens/jobs/CreateJobScreen';
import { JobManagementScreen } from '../screens/jobs/JobManagementScreen';
import { MyBidsScreen } from '../screens/bids/MyBidsScreen';
import { ActiveDealsScreen } from '../screens/deals/ActiveDealsScreen';
import { DealDetailScreen } from '../screens/deals/DealDetailScreen';
import { ChatScreen } from '../screens/deals/ChatScreen';
import { CompletionUploadScreen } from '../screens/deals/CompletionUploadScreen';
import { ReviewScreen } from '../screens/reviews/ReviewScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { SettingsScreen } from '../screens/profile/SettingsScreen';
import { VerificationCenterScreen } from '../screens/profile/VerificationCenterScreen';
import { CreditsScreen } from '../screens/profile/CreditsScreen';
import { PlansScreen } from '../screens/profile/PlansScreen';
import { PreferencesScreen } from '../screens/profile/PreferencesScreen';
import { PrivatePoolScreen } from '../screens/profile/PrivatePoolScreen';
import { NotificationsScreen } from '../screens/profile/NotificationsScreen';

// ── Stack defaults ───────────────────────────
const stackScreenOptions = {
  headerTintColor: colors.primary,
  headerTitleStyle: { ...typography.h4, color: colors.textPrimary },
  headerShadowVisible: false,
  headerBackTitleVisible: false,
  contentStyle: { backgroundColor: colors.background },
};

// ── Feed Stack ──────────────────────────────
const FeedStack = createNativeStackNavigator<FeedStackParamList>();
const FeedNavigator = () => (
  <FeedStack.Navigator
    initialRouteName="JobFeed"
    screenOptions={stackScreenOptions}
  >
    <FeedStack.Screen
      name="JobFeed"
      component={JobFeedScreen}
      options={{ title: 'Spoedmarktplaats' }}
    />
    <FeedStack.Screen
      name="JobDetail"
      component={JobDetailScreen}
      options={{ title: 'Opdracht' }}
    />
    <FeedStack.Screen
      name="PlaceBid"
      component={PlaceBidScreen}
      options={{ title: 'Bod plaatsen', presentation: 'modal' }}
    />
  </FeedStack.Navigator>
);

// ── Jobs / Bids Stack ───────────────────────
const JobsStack = createNativeStackNavigator<JobsStackParamList>();
const JobsNavigator = () => {
  const role = useAuthStore(s => s.user?.role);
  return (
    <JobsStack.Navigator
      initialRouteName={role === 'provider' ? 'MyBids' : 'MyJobs'}
      screenOptions={stackScreenOptions}
    >
      {role === 'provider' ? (
        <JobsStack.Screen
          name="MyBids"
          component={MyBidsScreen}
          options={{ title: 'Mijn biedingen' }}
        />
      ) : (
        <>
          <JobsStack.Screen
            name="MyJobs"
            component={MyJobsScreen}
            options={{ title: 'Mijn opdrachten' }}
          />
          <JobsStack.Screen
            name="CreateJob"
            component={CreateJobScreen}
            options={{ title: 'Opdracht plaatsen', presentation: 'modal' }}
          />
          <JobsStack.Screen
            name="JobManagement"
            component={JobManagementScreen}
            options={{ title: 'Beheren' }}
          />
        </>
      )}
    </JobsStack.Navigator>
  );
};

// ── Deals Stack ─────────────────────────────
const DealsStack = createNativeStackNavigator<DealsStackParamList>();
const DealsNavigator = () => (
  <DealsStack.Navigator
    initialRouteName="ActiveDeals"
    screenOptions={stackScreenOptions}
  >
    <DealsStack.Screen
      name="ActiveDeals"
      component={ActiveDealsScreen}
      options={{ title: 'Deals' }}
    />
    <DealsStack.Screen
      name="DealDetail"
      component={DealDetailScreen}
      options={{ title: 'Deal' }}
    />
    <DealsStack.Screen
      name="Chat"
      component={ChatScreen}
      options={{ title: 'Chat' }}
    />
    <DealsStack.Screen
      name="CompletionUpload"
      component={CompletionUploadScreen}
      options={{ title: 'Werk afronden', presentation: 'modal' }}
    />
    <DealsStack.Screen
      name="Review"
      component={ReviewScreen}
      options={{ title: 'Review schrijven', presentation: 'modal' }}
    />
  </DealsStack.Navigator>
);

// ── Profile Stack ───────────────────────────
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const ProfileNavigator = () => (
  <ProfileStack.Navigator
    initialRouteName="Profile"
    screenOptions={stackScreenOptions}
  >
    <ProfileStack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ title: 'Profiel' }}
    />
    <ProfileStack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ title: 'Instellingen' }}
    />
    <ProfileStack.Screen
      name="VerificationCenter"
      component={VerificationCenterScreen}
      options={{ title: 'Verificatie' }}
    />
    <ProfileStack.Screen
      name="Credits"
      component={CreditsScreen}
      options={{ title: 'Credits' }}
    />
    <ProfileStack.Screen
      name="Plans"
      component={PlansScreen}
      options={{ title: 'Abonnementen' }}
    />
    <ProfileStack.Screen
      name="Preferences"
      component={PreferencesScreen}
      options={{ title: 'Voorkeuren' }}
    />
    <ProfileStack.Screen
      name="PrivatePool"
      component={PrivatePoolScreen}
      options={{ title: 'Privaat Pool' }}
    />
    <ProfileStack.Screen
      name="Notifications"
      component={NotificationsScreen}
      options={{ title: 'Meldingen' }}
    />
  </ProfileStack.Navigator>
);

// ── Main Tab Navigator ──────────────────────
const Tab = createBottomTabNavigator<MainTabParamList>();

type TabIconProps = { focused: boolean; color: string; size: number };

const SearchTabIcon = ({ color, size }: TabIconProps) => (
  <Icon name="magnify" size={size} color={color} />
);

const DealsTabIcon = ({ color, size }: TabIconProps) => (
  <Icon name="handshake" size={size} color={color} />
);

const ProfileTabIcon = ({ color, size }: TabIconProps) => (
  <Icon name="account" size={size} color={color} />
);

const ProviderJobsTabIcon = ({ color, size }: TabIconProps) => (
  <Icon name="hand-back-right" size={size} color={color} />
);

const ClientJobsTabIcon = ({ color, size }: TabIconProps) => (
  <Icon name="clipboard-text" size={size} color={color} />
);

export const MainNavigator: React.FC = () => {
  const role = useAuthStore(s => s.user?.role);
  const unreadCount = useNotificationsStore(s => s.unreadCount);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: typography.tabLabel,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.borderLight,
        },
      }}
    >
      <Tab.Screen
        name="FeedTab"
        component={FeedNavigator}
        options={{
          tabBarLabel: 'Zoeken',
          tabBarIcon: SearchTabIcon,
        }}
      />
      <Tab.Screen
        name="JobsTab"
        component={JobsNavigator}
        options={{
          tabBarLabel: role === 'provider' ? 'Biedingen' : 'Opdrachten',
          tabBarIcon:
            role === 'provider' ? ProviderJobsTabIcon : ClientJobsTabIcon,
        }}
      />
      <Tab.Screen
        name="DealsTab"
        component={DealsNavigator}
        options={{
          tabBarLabel: 'Deals',
          tabBarIcon: DealsTabIcon,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={{
          tabBarLabel: 'Profiel',
          tabBarIcon: ProfileTabIcon,
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
        }}
      />
    </Tab.Navigator>
  );
};
