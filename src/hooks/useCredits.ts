import {useQuery} from '@tanstack/react-query';
import {useCreditsStore} from '../store/creditsStore';
import {creditsApi} from '../api/endpoints/credits';
import {useCallback} from 'react';
import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useI18n} from '../i18n/I18nProvider';
import {translateText} from '../i18n/translateText';

export const useCredits = () => {
  const {balance, setBalance, deduct} = useCreditsStore();
  const navigation = useNavigation<any>();
  const {language, t} = useI18n();

  // Sync balance from server
  useQuery({
    queryKey: ['credits', 'balance'],
    queryFn: async () => {
      const {balance: serverBalance} = await creditsApi.balance();
      setBalance(serverBalance);
      return serverBalance;
    },
    refetchInterval: 60_000,
  });

  const checkAndConsume = useCallback(
    async (cost: number, actionLabel: string): Promise<boolean> => {
      if (balance < cost) {
        const action = translateText(actionLabel, language);
        const message =
          language === 'en'
            ? `You need ${cost} credit(s) to ${action}. Current balance: ${balance}.`
            : `Je hebt ${cost} credit(s) nodig om ${action}. Huidige balans: ${balance}.`;

        Alert.alert(
          t('Onvoldoende credits'),
          message,
          [
            {text: t('Annuleren'), style: 'cancel'},
            {
              text: t('Bekijk abonnementen'),
              onPress: () => navigation.navigate('ProfileTab', {screen: 'Plans'}),
            },
          ],
        );
        return false;
      }
      deduct(cost); // optimistic
      return true;
    },
    [balance, deduct, language, navigation, t],
  );

  return {balance, checkAndConsume};
};
