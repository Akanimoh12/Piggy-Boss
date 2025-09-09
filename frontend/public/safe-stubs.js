// Safe wallet SDK stubs for when Safe wallet is not available
window.SafeAppsProvider = window.SafeAppsProvider || {};
window.SafeAppsSDK = window.SafeAppsSDK || {};

// Provide basic exports to prevent runtime errors
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SafeAppsProvider: {},
    SafeAppsSDK: {}
  };
}
