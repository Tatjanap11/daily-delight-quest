
const STORAGE_VERSION = 1; // Increment this if you change data shape

const STORAGE_VERSION_KEY = "app_storage_version";

// List of keys to clear for a fresh start if version changes
const RESET_KEYS = [
  "userStats",
  "boxHistory",
  "practiceMeta",
  "practiceModeLockedDate",
];

export function checkAndUpgradeStorage() {
  try {
    const existingVersion = Number(localStorage.getItem(STORAGE_VERSION_KEY) || "0");
    if (existingVersion < STORAGE_VERSION) {
      // Reset the relevant keys
      for (const key of RESET_KEYS) {
        localStorage.removeItem(key);
      }
      localStorage.setItem(STORAGE_VERSION_KEY, String(STORAGE_VERSION));
      // Optionally, force reload so app picks up resets. Or just let hooks handle state.
      // location.reload(); // Uncomment to force hard reload if desired
      return true; // indicates cleanup occurred
    } else if (!existingVersion || Number.isNaN(existingVersion)) {
      // No version detected, so set for the first time
      localStorage.setItem(STORAGE_VERSION_KEY, String(STORAGE_VERSION));
    }
  } catch (e) {
    // Ignore - only affects advanced browsers
    console.warn("Couldn't check or set storage version", e);
  }
  return false;
}
