const formatNumberDecimal = (value: string): number => {
  return Number(parseFloat(value).toFixed(2));
};

export default formatNumberDecimal;
