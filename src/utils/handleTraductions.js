const en = require("../constants/traductions/en");
const es = require("../constants/traductions/es");

const handleTraductions = (lang = "en") => {
  const traductions = { en, es }[lang];

  const t = (value) => {
    const valueSplit = value.split(".");
    let findValue;

    valueSplit.reduce((acumulator, key, index, array) => {
      if (index === array.length - 1) {
        findValue = acumulator[key];
        return acumulator;
      }

      return acumulator[key] || "";
    }, traductions);

    return findValue || "";
  };

  return { t };
};

module.exports = handleTraductions;
