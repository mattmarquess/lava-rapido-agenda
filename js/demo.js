const demoCustomers = [
  { name: "Marcos Silva", phone: "11987654321", plate: "ABC1D23" },
  { name: "Fernanda Costa", phone: "21999887766", plate: "FRC4A19" },
  { name: "Lucas Almeida", phone: "31988776655", plate: "LKA7B42" },
  { name: "Patrícia Gomes", phone: "41977665544", plate: "PTG2C80" },
  { name: "Rafael Souza", phone: "51966554433", plate: "RFS9D11" },
  { name: "Juliana Martins", phone: "61955443322", plate: "JLM5E73" }
];

const demoNotes = [
  "Cliente pediu atenção nos bancos.",
  "Veículo com muita poeira interna.",
  "Finalizar antes das 16h, se possível.",
  "",
  "Cliente quer incluir pretinho nos pneus.",
  "Confirmar pagamento no local."
];

function createDemoAppointment(index, date) {
  const customer = demoCustomers[index % demoCustomers.length];
  const service = services[index % services.length];
  const vehicle = vehicleTypes[index % vehicleTypes.length];
  const time = availableTimes[index % availableTimes.length];
  const status = appointmentStatuses[index % appointmentStatuses.length];

  return {
    id: crypto.randomUUID(),
    customerName: customer.name,
    customerPhone: customer.phone,
    vehiclePlate: customer.plate,
    vehicleName: vehicle.name,
    serviceName: service.name,
    serviceId: service.id,
    date,
    time,
    notes: demoNotes[index % demoNotes.length],
    price: calculatePrice(service.id, vehicle.id),
    status,
    createdAt: new Date().toISOString()
  };
}

async function handleSeedDemoData() {
  const date = elements.panelDateInput.value || todayISO();
  const existingAppointments = await getAppointments();
  const appointmentsFromOtherDays = existingAppointments.filter((appointment) => appointment.date !== date);
  const demoAppointments = Array.from({ length: 6 }, (_, index) => createDemoAppointment(index, date));

  await saveAppointments([...appointmentsFromOtherDays, ...demoAppointments]);
  await renderAppointments();
  elements.backupMessage.textContent = "Demonstração criada para a data selecionada.";
}

function initDemoTools() {
  if (!elements.seedDemoDataButton) return;

  elements.seedDemoDataButton.addEventListener("click", handleSeedDemoData);
}
