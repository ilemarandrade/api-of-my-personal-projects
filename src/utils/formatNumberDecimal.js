const formatNumberDecimal = (value) => {
  return Number(parseFloat(value).toFixed(2));
};

module.exports = {
  formatNumberDecimal,
};
