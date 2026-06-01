function initCustomerPage() {
  renderServices();
  fillSelects();

  elements.bookingDateInput.min = todayISO();
  elements.bookingDateInput.value = todayISO();

  updateSummary();

  elements.serviceSelect.addEventListener("change", updateSummary);
  elements.vehicleTypeSelect.addEventListener("change", updateSummary);
  elements.bookingForm.addEventListener("submit", handleBooking);
  elements.lookupForm.addEventListener("submit", handleLookup);
  elements.customerAppointments.addEventListener("click", handleCustomerAction);
}

function initSettingsPage() {
  renderSettingsForm();

  elements.settingsForm.addEventListener("submit", handleSettingsSave);
  elements.serviceEditor.addEventListener("click", handleSettingsListAction);
  elements.vehicleEditor.addEventListener("click", handleSettingsListAction);
  elements.timeEditor.addEventListener("click", handleSettingsListAction);
  elements.addServiceButton.addEventListener("click", addServiceRow);
  elements.addVehicleButton.addEventListener("click", addVehicleRow);
  elements.addTimeButton.addEventListener("click", addTimeRow);
  elements.resetSettingsButton.addEventListener("click", handleSettingsReset);
}

function initPanelPage() {
  renderStatusFilters();
  elements.panelDateInput.value = todayISO();
  renderAppointments();
  initBackupTools();
  initDemoTools();

  elements.panelDateInput.addEventListener("change", renderAppointments);
  elements.appointmentsList.addEventListener("change", handleStatusChange);
  elements.appointmentsList.addEventListener("click", handleAdminAction);
  elements.statusFilters.addEventListener("click", handleStatusFilter);
  elements.clearDoneButton.addEventListener("click", clearFinishedAppointments);
}

function initProtectedAdminPage() {
  if (elements.panelDateInput && !elements.panelDateInput.dataset.ready) {
    elements.panelDateInput.dataset.ready = "true";
    initPanelPage();
  }

  if (elements.settingsForm && !elements.settingsForm.dataset.ready) {
    elements.settingsForm.dataset.ready = "true";
    initSettingsPage();
  }
}

function init() {
  applySavedSettings();
  renderBusinessInfo();
  initAuth();

  if (elements.bookingForm) {
    initCustomerPage();
    return;
  }

  if (elements.loginPanel || elements.adminContent) {
    if (requireAdminAuth()) {
      initProtectedAdminPage();
    }
    return;
  }

  initProtectedAdminPage();
}

init();
