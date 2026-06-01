function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function serviceRowTemplate(service = {}) {
  return `
    <article class="editor-row service-editor-row">
      <label>
        Nome
        <input name="serviceName" value="${escapeHTML(service.name || "")}" required>
      </label>
      <label>
        Preço
        <input name="servicePrice" type="number" min="0" step="1" value="${escapeHTML(service.price || 0)}" required>
      </label>
      <label>
        Duração
        <input name="serviceDuration" type="number" min="5" step="5" value="${escapeHTML(service.duration || 30)}" required>
      </label>
      <label class="full">
        Descrição
        <textarea name="serviceDescription" rows="2">${escapeHTML(service.description || "")}</textarea>
      </label>
      <button class="button ghost compact danger-button" type="button" data-remove-row>Remover</button>
    </article>
  `;
}

function vehicleRowTemplate(vehicle = {}) {
  return `
    <article class="editor-row vehicle-editor-row">
      <label>
        Tipo
        <input name="vehicleName" value="${escapeHTML(vehicle.name || "")}" required>
      </label>
      <label>
        Multiplicador
        <input name="vehicleMultiplier" type="number" min="0.1" step="0.05" value="${escapeHTML(vehicle.multiplier || 1)}" required>
      </label>
      <button class="button ghost compact danger-button" type="button" data-remove-row>Remover</button>
    </article>
  `;
}

function timeRowTemplate(time = "") {
  return `
    <article class="editor-row time-editor-row">
      <label>
        Horário
        <input name="availableTime" type="time" value="${escapeHTML(time)}" required>
      </label>
      <button class="button ghost compact danger-button" type="button" data-remove-row>Remover</button>
    </article>
  `;
}

function renderSettingsForm() {
  elements.settingsForm.name.value = business.name;
  elements.settingsForm.type.value = business.type;
  elements.settingsForm.shortName.value = business.shortName;
  elements.settingsForm.whatsapp.value = business.whatsapp;
  elements.settingsForm.address.value = business.address;
  elements.settingsForm.openingLabel.value = business.openingLabel;
  elements.settingsForm.openingHours.value = business.openingHours;
  elements.settingsForm.boxesAvailable.value = business.boxesAvailable;

  elements.serviceEditor.innerHTML = services.map(serviceRowTemplate).join("");
  elements.vehicleEditor.innerHTML = vehicleTypes.map(vehicleRowTemplate).join("");
  elements.timeEditor.innerHTML = availableTimes.map(timeRowTemplate).join("");
}

function addServiceRow() {
  elements.serviceEditor.insertAdjacentHTML("beforeend", serviceRowTemplate({
    name: "Novo serviço",
    description: "",
    price: 50,
    duration: 40
  }));
}

function addVehicleRow() {
  elements.vehicleEditor.insertAdjacentHTML("beforeend", vehicleRowTemplate({
    name: "Novo veículo",
    multiplier: 1
  }));
}

function addTimeRow() {
  elements.timeEditor.insertAdjacentHTML("beforeend", timeRowTemplate("08:00"));
}

function handleSettingsListAction(event) {
  const removeButton = event.target.closest("[data-remove-row]");

  if (!removeButton) return;

  const row = removeButton.closest(".editor-row");
  row.remove();
}

function makeSlug(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function collectServices() {
  return [...elements.serviceEditor.querySelectorAll(".service-editor-row")].map((row, index) => {
    const name = row.querySelector("[name='serviceName']").value.trim();

    return {
      id: makeSlug(name) || `servico-${index + 1}`,
      name,
      description: row.querySelector("[name='serviceDescription']").value.trim(),
      price: Number(row.querySelector("[name='servicePrice']").value),
      duration: Number(row.querySelector("[name='serviceDuration']").value)
    };
  });
}

function collectVehicleTypes() {
  return [...elements.vehicleEditor.querySelectorAll(".vehicle-editor-row")].map((row, index) => {
    const name = row.querySelector("[name='vehicleName']").value.trim();

    return {
      id: makeSlug(name) || `veiculo-${index + 1}`,
      name,
      multiplier: Number(row.querySelector("[name='vehicleMultiplier']").value)
    };
  });
}

function collectAvailableTimes() {
  return [...elements.timeEditor.querySelectorAll("[name='availableTime']")]
    .map((input) => input.value)
    .filter(Boolean)
    .sort();
}

function handleSettingsSave(event) {
  event.preventDefault();

  const formData = new FormData(elements.settingsForm);
  const settings = {
    business: {
      name: formData.get("name").trim(),
      type: formData.get("type").trim(),
      shortName: formData.get("shortName").trim(),
      whatsapp: normalizePhone(formData.get("whatsapp")),
      address: formData.get("address").trim(),
      openingLabel: formData.get("openingLabel").trim(),
      openingHours: formData.get("openingHours").trim(),
      boxesAvailable: Number(formData.get("boxesAvailable"))
    },
    services: collectServices(),
    vehicleTypes: collectVehicleTypes(),
    availableTimes: collectAvailableTimes()
  };

  if (!settings.services.length || !settings.vehicleTypes.length || !settings.availableTimes.length) {
    elements.settingsMessage.textContent = "Mantenha pelo menos um serviço, um veículo e um horário.";
    return;
  }

  saveSettings(settings);
  applySavedSettings();
  renderBusinessInfo();
  elements.settingsMessage.textContent = "Configurações salvas. Cliente e painel já usam esses dados.";
}

function handleSettingsReset() {
  clearSavedSettings();
  applyDefaultSettings();
  location.reload();
}
