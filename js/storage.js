function getAppointments() {
  const raw = localStorage.getItem(storageKey);
  return raw ? JSON.parse(raw) : [];
}

function saveAppointments(appointments) {
  localStorage.setItem(storageKey, JSON.stringify(appointments));
}

function getSavedSettings() {
  const raw = localStorage.getItem(settingsStorageKey);
  return raw ? JSON.parse(raw) : null;
}

function saveSettings(settings) {
  localStorage.setItem(settingsStorageKey, JSON.stringify(settings));
}

function clearSavedSettings() {
  localStorage.removeItem(settingsStorageKey);
}

function applySettings(settings) {
  if (settings.business) {
    Object.assign(business, settings.business);
  }

  if (Array.isArray(settings.services)) {
    services.splice(0, services.length, ...settings.services);
  }

  if (Array.isArray(settings.vehicleTypes)) {
    vehicleTypes.splice(0, vehicleTypes.length, ...settings.vehicleTypes);
  }

  if (Array.isArray(settings.availableTimes)) {
    availableTimes.splice(0, availableTimes.length, ...settings.availableTimes);
  }
}

function applyDefaultSettings() {
  applySettings(defaultSettings);
}

function applySavedSettings() {
  const savedSettings = getSavedSettings();

  if (!savedSettings) return;

  applySettings(savedSettings);
}

function getAdminPassword() {
  return localStorage.getItem(authStorageKey) || defaultAdminPassword;
}

function saveAdminPassword(password) {
  localStorage.setItem(authStorageKey, password);
}

function clearAppointments() {
  localStorage.removeItem(storageKey);
}
