import en from '../constants/traductions/en.js';
import es from '../constants/traductions/es.js';

const handleTraductions = (lang = 'en') => {
  const traductions = { en, es }[lang];

  const t = (value) => {
    const valueSplit = value.split('.');
    let findValue;

    valueSplit.reduce((acumulator, key, index, array) => {
      if (index === array.length - 1) {
        findValue = acumulator[key];
        return acumulator;
      }

      return acumulator[key] || '';
    }, traductions);

    return findValue || '';
  };

  return { t };
};

export default handleTraductions;
