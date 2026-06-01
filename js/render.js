function renderBusinessInfo() {
  const fullName = `${business.name} ${business.type}`;

  if (elements.brandMark) elements.brandMark.textContent = business.shortName;
  if (elements.brandName) elements.brandName.textContent = business.name;
  if (elements.brandType) elements.brandType.textContent = business.type;
  if (elements.heroTitle) elements.heroTitle.textContent = fullName;
  if (elements.heroWhatsapp) elements.heroWhatsapp.href = `https://wa.me/${business.whatsapp}`;
  if (elements.openingLabel) elements.openingLabel.textContent = business.openingLabel;
  if (elements.openingHours) elements.openingHours.textContent = business.openingHours;
  if (elements.businessAddress) elements.businessAddress.textContent = business.address;
  if (elements.footerBusiness) elements.footerBusiness.textContent = fullName;
}

function renderServices() {
  if (!elements.serviceGrid) return;

  elements.serviceGrid.innerHTML = services
    .map(
      (service) => `
        <article class="service-card">
          <h3>${service.name}</h3>
          <p>${service.description}</p>
          <div class="service-meta">
            <span>${money.format(service.price)}</span>
            <span>${service.duration} min</span>
          </div>
        </article>
      `
    )
    .join("");
}

function fillSelects() {
  if (!elements.serviceSelect || !elements.vehicleTypeSelect || !elements.bookingTimeSelect) return;

  elements.serviceSelect.innerHTML = services
    .map((service) => `<option value="${service.id}">${service.name}</option>`)
    .join("");

  elements.vehicleTypeSelect.innerHTML = vehicleTypes
    .map((vehicle) => `<option value="${vehicle.id}">${vehicle.name}</option>`)
    .join("");

  elements.bookingTimeSelect.innerHTML = availableTimes
    .map((time) => `<option value="${time}">${time}</option>`)
    .join("");
}

function updateSummary() {
  if (!elements.bookingSummary || !elements.serviceSelect || !elements.vehicleTypeSelect) return;

  const service = findService(elements.serviceSelect.value);
  const vehicle = findVehicle(elements.vehicleTypeSelect.value);
  const price = calculatePrice(service.id, vehicle.id);

  elements.bookingSummary.innerHTML = `
    <span class="summary-pill">${service.duration} minutos</span>
    <span class="summary-pill">${vehicle.name}</span>
    <span class="summary-pill">${money.format(price)}</span>
  `;
}

function renderPanelStats(appointments) {
  if (!elements.panelStats) return;

  const total = appointments.length;
  const revenue = appointments.reduce((sum, appointment) => sum + appointment.price, 0);
  const active = appointments.filter((appointment) => !finishedStatuses.includes(appointment.status)).length;
  const byStatus = appointmentStatuses
    .map((status) => {
      const count = appointments.filter((appointment) => appointment.status === status).length;
      return count ? `<span class="stat-pill status-${getStatusClass(status)}">${status}: ${count}</span>` : "";
    })
    .join("");

  elements.panelStats.innerHTML = `
    <span class="stat-pill">${total} agendamentos</span>
    <span class="stat-pill">${active} ativos</span>
    <span class="stat-pill">${money.format(revenue)}</span>
    ${byStatus}
  `;
}

function renderAppointments() {
  if (!elements.panelDateInput || !elements.appointmentsList) return;

  const date = elements.panelDateInput.value;
  const activeFilter = elements.statusFilters?.querySelector(".active")?.dataset.status || "Todos";
  const appointments = getAppointments()
    .filter((appointment) => appointment.date === date)
    .filter((appointment) => activeFilter === "Todos" || appointment.status === activeFilter)
    .sort((a, b) => a.time.localeCompare(b.time));
  const appointmentsForStats = getAppointments().filter((appointment) => appointment.date === date);

  renderPanelStats(appointmentsForStats);

  if (!appointments.length) {
    elements.appointmentsList.innerHTML = `
      <div class="empty-state">Nenhum agendamento para esta data.</div>
    `;
    return;
  }

  elements.appointmentsList.innerHTML = appointments
    .map(
      (appointment) => `
        <article>
          <div>
            <h3 class="appointment-title">
              <span>${appointment.time} - ${appointment.customerName}</span>
              <span class="status-badge status-${getStatusClass(appointment.status)}">${appointment.status}</span>
            </h3>
            <p class="appointment-details">
              <span>${appointment.serviceName}</span>
              <span>${appointment.vehicleName}</span>
              <span>${appointment.vehiclePlate}</span>
              <span>${appointment.customerPhone}</span>
              <span>${money.format(appointment.price)}</span>
            </p>
            ${appointment.notes ? `<p class="appointment-notes">${appointment.notes}</p>` : ""}
          </div>
          <div class="appointment-admin-actions">
            <select class="status-select" data-id="${appointment.id}" aria-label="Status do agendamento">
              ${appointmentStatuses.map(
                (status) =>
                  `<option value="${status}" ${status === appointment.status ? "selected" : ""}>${status}</option>`
              ).join("")}
            </select>
            <a class="button ghost compact" href="${buildCustomerWhatsAppLink(appointment)}" target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <button class="button ghost compact danger-button" type="button" data-cancel-id="${appointment.id}">
              Cancelar
            </button>
          </div>
        </article>
      `
    )
    .join("");
}

function renderStatusFilters() {
  if (!elements.statusFilters) return;

  const filters = ["Todos", ...appointmentStatuses];

  elements.statusFilters.innerHTML = filters
    .map(
      (status, index) => `
        <button class="filter-button ${index === 0 ? "active" : ""}" type="button" data-status="${status}">
          ${status}
        </button>
      `
    )
    .join("");
}

function renderCustomerAppointments(phone) {
  if (!elements.customerAppointments) return;

  const normalizedPhone = normalizePhone(phone);
  const appointments = getAppointments()
    .filter((appointment) => normalizePhone(appointment.customerPhone) === normalizedPhone)
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

  if (!appointments.length) {
    elements.customerAppointments.innerHTML = `
      <div class="empty-state">Nenhum agendamento encontrado para este WhatsApp.</div>
    `;
    return;
  }

  elements.customerAppointments.innerHTML = appointments
    .map(
      (appointment) => `
        <article>
          <div>
            <h3 class="appointment-title">${appointment.date} às ${appointment.time}</h3>
            <p class="appointment-details">
              <span>${appointment.serviceName}</span>
              <span>${appointment.vehicleName}</span>
              <span>${appointment.vehiclePlate}</span>
              <span>${appointment.status}</span>
              <span>${money.format(appointment.price)}</span>
            </p>
          </div>
          <div class="appointment-actions">
            <a class="button ghost compact" href="${buildWhatsAppLink(appointment)}" target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <button class="button ghost compact danger-button" type="button" data-cancel-id="${appointment.id}">
              Cancelar
            </button>
          </div>
        </article>
      `
    )
    .join("");
}
