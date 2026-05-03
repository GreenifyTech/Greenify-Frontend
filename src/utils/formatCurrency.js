/**
 * Standardizes currency display across the application.
 * Currently formatted for the Egyptian market (LE).
 * @param {number|string} price 
 * @returns {string}
 */
export const formatPrice = (price) => {
  const numericPrice = Number(price) || 0;
  return `LE ${numericPrice.toFixed(2)}`;
};
