function createAppointment(formData) {
  const service = findService(formData.get("service"));
  const vehicle = findVehicle(formData.get("vehicleType"));

  return {
    id: crypto.randomUUID(),
    customerName: formData.get("customerName").trim(),
    customerPhone: formData.get("customerPhone").trim(),
    vehiclePlate: formData.get("vehiclePlate").trim().toUpperCase(),
    vehicleName: vehicle.name,
    serviceName: service.name,
    serviceId: service.id,
    date: formData.get("bookingDate"),
    time: formData.get("bookingTime"),
    notes: formData.get("notes").trim(),
    price: calculatePrice(service.id, vehicle.id),
    status: "Agendado",
    createdAt: new Date().toISOString()
  };
}

function countBookingsAtSameTime(appointment, appointments) {
  return appointments.filter(
    (item) =>
      item.date === appointment.date &&
      item.time === appointment.time &&
      !finishedStatuses.includes(item.status)
  ).length;
}

function handleBooking(event) {
  event.preventDefault();

  const formData = new FormData(elements.bookingForm);
  const appointment = createAppointment(formData);
  const appointments = getAppointments();
  const bookingsAtSameTime = countBookingsAtSameTime(appointment, appointments);

  if (bookingsAtSameTime >= business.boxesAvailable) {
    elements.formMessage.textContent = "Todos os boxes estão reservados nesse horário. Escolha outro horário.";
    return;
  }

  saveAppointments([...appointments, appointment]);
  if (elements.panelDateInput) {
    elements.panelDateInput.value = appointment.date;
    renderAppointments();
  }
  elements.bookingForm.reset();
  elements.bookingDateInput.value = todayISO();
  updateSummary();
  elements.formMessage.textContent = "Agendamento confirmado. O painel já foi atualizado.";
}

function handleStatusChange(event) {
  if (!event.target.matches(".status-select")) return;

  const id = event.target.dataset.id;
  const appointments = getAppointments().map((appointment) =>
    appointment.id === id ? { ...appointment, status: event.target.value } : appointment
  );

  saveAppointments(appointments);
  renderAppointments();
}

function handleLookup(event) {
  event.preventDefault();
  renderCustomerAppointments(elements.lookupPhoneInput.value);
}

function handleCustomerAction(event) {
  const button = event.target.closest("[data-cancel-id]");
  if (!button) return;

  const id = button.dataset.cancelId;
  const appointments = getAppointments().map((appointment) =>
    appointment.id === id ? { ...appointment, status: "Cancelado" } : appointment
  );

  saveAppointments(appointments);
  renderCustomerAppointments(elements.lookupPhoneInput.value);
  renderAppointments();
}

function handleAdminAction(event) {
  const button = event.target.closest("[data-cancel-id]");
  if (!button) return;

  const id = button.dataset.cancelId;
  const appointments = getAppointments().map((appointment) =>
    appointment.id === id ? { ...appointment, status: "Cancelado" } : appointment
  );

  saveAppointments(appointments);
  renderAppointments();
}

function handleStatusFilter(event) {
  const button = event.target.closest("[data-status]");
  if (!button) return;

  elements.statusFilters
    .querySelectorAll(".filter-button")
    .forEach((filterButton) => filterButton.classList.remove("active"));

  button.classList.add("active");
  renderAppointments();
}

function clearFinishedAppointments() {
  const appointments = getAppointments().filter((appointment) => !finishedStatuses.includes(appointment.status));
  saveAppointments(appointments);
  renderAppointments();
}
