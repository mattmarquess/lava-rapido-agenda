function getCurrentSettingsSnapshot() {
  return {
    business: { ...business },
    services: services.map((service) => ({ ...service })),
    vehicleTypes: vehicleTypes.map((vehicle) => ({ ...vehicle })),
    availableTimes: [...availableTimes]
  };
}

function createBackupPayload() {
  return {
    app: "brilhomax-lava-rapido",
    version: 1,
    exportedAt: new Date().toISOString(),
    settings: getSavedSettings() || getCurrentSettingsSnapshot()
  };
}

function downloadJSON(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

async function handleExportData() {
  const date = todayISO();
  const filename = `backup-brilhomax-${date}.json`;
  const payload = createBackupPayload();

  payload.appointments = await getAppointments();
  downloadJSON(filename, payload);
  elements.backupMessage.textContent = "Backup exportado.";
}

function validateBackupPayload(payload) {
  return (
    payload &&
    payload.app === "brilhomax-lava-rapido" &&
    Array.isArray(payload.appointments) &&
    payload.settings &&
    payload.settings.business &&
    Array.isArray(payload.settings.services) &&
    Array.isArray(payload.settings.vehicleTypes) &&
    Array.isArray(payload.settings.availableTimes)
  );
}

async function importBackupPayload(payload) {
  await saveAppointments(payload.appointments);
  saveSettings(payload.settings);
  applySavedSettings();
  renderBusinessInfo();
  await renderAppointments();
}

function handleImportData(event) {
  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.addEventListener("load", async () => {
    try {
      const payload = JSON.parse(reader.result);

      if (!validateBackupPayload(payload)) {
        elements.backupMessage.textContent = "Arquivo de backup inválido.";
        return;
      }

      await importBackupPayload(payload);
      elements.backupMessage.textContent = "Backup importado com sucesso.";
    } catch (error) {
      elements.backupMessage.textContent = "Não foi possível ler o arquivo.";
    } finally {
      elements.importDataInput.value = "";
    }
  });

  reader.readAsText(file);
}

async function handleClearAllData() {
  const confirmed = confirm("Tem certeza que deseja apagar agendamentos e configurações deste navegador?");

  if (!confirmed) return;

  await clearAppointments();
  clearSavedSettings();
  applyDefaultSettings();
  renderBusinessInfo();
  await renderAppointments();
  elements.backupMessage.textContent = "Dados locais apagados.";
}

function initBackupTools() {
  if (!elements.exportDataButton) return;

  elements.exportDataButton.addEventListener("click", handleExportData);
  elements.importDataInput.addEventListener("change", handleImportData);
  elements.clearAllDataButton.addEventListener("click", handleClearAllData);
}
