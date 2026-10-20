// CHANGE VERSION: HEARTS-UI-ONLY-R6 | Shared heart storage is paused
// Keep this compatibility surface for dormant components. Environment variables
// cannot reactivate storage: the portfolio currently makes no heart API calls.
// Existing database records and previously stored browser IDs are left intact.
const REASON = 'Shared heart storage is paused. The header heart is a visual interaction for this visit.';

export function getPortfolioHeartsConfig() {
  return { configured: false, provider: 'none', url: '', key: '', reason: REASON };
}

export function createPortfolioHeartsClient() {
  const unavailable = async () => { throw new Error(REASON); };
  return { configured: false, provider: 'none', read: unavailable, set: unavailable };
}

export const getPortfolioHeartState = options => createPortfolioHeartsClient().read(options);
export const setPortfolioHeart = (liked, options) => createPortfolioHeartsClient().set(liked, options);
// END OF FILE: HEARTS-UI-ONLY-R6 | portfolioHearts.js
