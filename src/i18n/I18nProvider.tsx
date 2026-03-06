import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {Alert, AlertButton, AlertOptions} from 'react-native';
import {setRuntimeLanguage} from './runtimeLanguage';
import {Language, translateNode, translateText} from './translateText';

const LANGUAGE_STORAGE_KEY = '@spoed:language';

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (value: string) => string;
  tNode: (node: React.ReactNode) => React.ReactNode;
};

const defaultValue: I18nContextValue = {
  language: 'nl',
  setLanguage: () => undefined,
  toggleLanguage: () => undefined,
  t: value => value,
  tNode: node => node,
};

const I18nContext = createContext<I18nContextValue>(defaultValue);

export const I18nProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [language, setLanguageState] = useState<Language>('nl');
  const [languageLoaded, setLanguageLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
      .then(stored => {
        if (stored === 'nl' || stored === 'en') {
          setLanguageState(stored);
          setRuntimeLanguage(stored);
        }
        setLanguageLoaded(true);
      })
      .catch(() => setLanguageLoaded(true));
  }, []);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    setRuntimeLanguage(nextLanguage);
    AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage).catch(() => undefined);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'nl' ? 'en' : 'nl');
  }, [language, setLanguage]);

  const t = useCallback((value: string) => translateText(value, language), [language]);

  const tNode = useCallback(
    (node: React.ReactNode) => {
      return translateNode(node, t);
    },
    [t],
  );

  useEffect(() => {
    const originalAlert = Alert.alert;

    Alert.alert = (
      title: string,
      message?: string,
      buttons?: AlertButton[],
      options?: AlertOptions,
    ) => {
      const translatedButtons = buttons?.map(button => ({
        ...button,
        text: button.text ? t(button.text) : button.text,
      }));

      return originalAlert(
        t(title),
        typeof message === 'string' ? t(message) : message,
        translatedButtons,
        options,
      );
    };

    return () => {
      Alert.alert = originalAlert;
    };
  }, [t]);

  const value = useMemo<I18nContextValue>(() => {
    return {
      language,
      setLanguage,
      toggleLanguage,
      t,
      tNode,
    };
  }, [language, setLanguage, t, tNode, toggleLanguage]);

  if (!languageLoaded) return null;

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextValue => {
  return useContext(I18nContext);
};
