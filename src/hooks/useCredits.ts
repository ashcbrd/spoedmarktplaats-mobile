import {useQuery} from '@tanstack/react-query';
import {useCreditsStore} from '../store/creditsStore';
import {creditsApi} from '../api/endpoints/credits';
import {useCallback} from 'react';
import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export const useCredits = () => {
  const {balance, setBalance, deduct} = useCreditsStore();
  const navigation = useNavigation<any>();

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
        Alert.alert(
          'Onvoldoende credits',
          `Je hebt ${cost} credit(s) nodig om ${actionLabel}. Huidige balans: ${balance}.`,
          [
            {text: 'Annuleren', style: 'cancel'},
            {
              text: 'Bekijk abonnementen',
              onPress: () => navigation.navigate('ProfileTab', {screen: 'Plans'}),
            },
          ],
        );
        return false;
      }
      deduct(cost); // optimistic
      return true;
    },
    [balance, deduct, navigation],
  );

  return {balance, checkAndConsume};
};
