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

async function handleBooking(event) {
  event.preventDefault();

  const formData = new FormData(elements.bookingForm);
  const appointment = createAppointment(formData);

  let appointments = [];

  try {
    appointments = await getAppointments();
  } catch (error) {
    elements.formMessage.textContent = `Não foi possível carregar a agenda: ${error.message}`;
    return;
  }

  const bookingsAtSameTime = countBookingsAtSameTime(appointment, appointments);

  if (bookingsAtSameTime >= business.boxesAvailable) {
    elements.formMessage.textContent = "Todos os boxes estão reservados nesse horário. Escolha outro horário.";
    return;
  }

  try {
    await addAppointment(appointment);
  } catch (error) {
    elements.formMessage.textContent = `Não foi possível confirmar: ${error.message}`;
    return;
  }

  if (elements.panelDateInput) {
    elements.panelDateInput.value = appointment.date;
    await renderAppointments();
  }
  elements.bookingForm.reset();
  elements.bookingDateInput.value = todayISO();
  updateSummary();
  elements.formMessage.textContent = "Agendamento confirmado. O painel já foi atualizado.";
}

async function handleStatusChange(event) {
  if (!event.target.matches(".status-select")) return;

  const id = event.target.dataset.id;

  await updateAppointmentStatus(id, event.target.value);
  await renderAppointments();
}

async function handleLookup(event) {
  event.preventDefault();
  await renderCustomerAppointments(elements.lookupPhoneInput.value);
}

async function handleCustomerAction(event) {
  const button = event.target.closest("[data-cancel-id]");
  if (!button) return;

  const id = button.dataset.cancelId;
  await updateAppointmentStatus(id, "Cancelado");
  await renderCustomerAppointments(elements.lookupPhoneInput.value);
  await renderAppointments();
}

async function handleAdminAction(event) {
  const button = event.target.closest("[data-cancel-id]");
  if (!button) return;

  const id = button.dataset.cancelId;
  await updateAppointmentStatus(id, "Cancelado");
  await renderAppointments();
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

async function clearFinishedAppointments() {
  const appointments = (await getAppointments()).filter((appointment) => !finishedStatuses.includes(appointment.status));
  await saveAppointments(appointments);
  await renderAppointments();
}
