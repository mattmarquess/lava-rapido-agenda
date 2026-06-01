const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

function todayISO() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

function normalizePhone(phone) {
  return phone.replace(/\D/g, "");
}

function findService(id) {
  return services.find((service) => service.id === id) || services[0];
}

function findVehicle(id) {
  return vehicleTypes.find((vehicle) => vehicle.id === id) || vehicleTypes[0];
}

function calculatePrice(serviceId, vehicleId) {
  const service = findService(serviceId);
  const vehicle = findVehicle(vehicleId);
  return Math.round(service.price * vehicle.multiplier);
}

function buildWhatsAppLink(appointment) {
  const message = `Olá, quero falar sobre meu agendamento no dia ${appointment.date} às ${appointment.time}. Serviço: ${appointment.serviceName}. Placa: ${appointment.vehiclePlate}.`;
  return `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`;
}

function buildCustomerWhatsAppLink(appointment) {
  const phone = normalizePhone(appointment.customerPhone);
  const message = `Olá, ${appointment.customerName}. Seu agendamento de ${appointment.serviceName} está marcado para ${appointment.date} às ${appointment.time}.`;
  return `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`;
}

function getStatusClass(status) {
  return status.toLowerCase().replace(/\s+/g, "-");
}
