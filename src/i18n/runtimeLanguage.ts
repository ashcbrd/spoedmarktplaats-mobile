import {Language} from './translateText';

let runtimeLanguage: Language = 'nl';

export const getRuntimeLanguage = (): Language => runtimeLanguage;

export const setRuntimeLanguage = (language: Language): void => {
  runtimeLanguage = language;
};
