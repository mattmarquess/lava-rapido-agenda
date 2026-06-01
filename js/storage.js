let supabaseClient = null;

function isSupabaseEnabled() {
  return Boolean(
    supabaseConfig.url &&
    supabaseConfig.anonKey &&
    window.supabase &&
    window.supabase.createClient
  );
}

function getSupabaseClient() {
  if (!isSupabaseEnabled()) return null;

  if (!supabaseClient) {
    supabaseClient = window.supabase.createClient(supabaseConfig.url, supabaseConfig.anonKey);
  }

  return supabaseClient;
}

function mapDbAppointment(row) {
  return {
    id: row.id,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    vehiclePlate: row.vehicle_plate,
    vehicleName: row.vehicle_name,
    serviceName: row.service_name,
    serviceId: row.service_id,
    date: row.appointment_date,
    time: row.start_time.slice(0, 5),
    notes: row.notes || "",
    price: Number(row.price),
    status: row.status,
    createdAt: row.created_at
  };
}

function mapAppointmentToDb(appointment) {
  return {
    id: appointment.id,
    business_id: supabaseConfig.businessId,
    customer_name: appointment.customerName,
    customer_phone: appointment.customerPhone,
    vehicle_plate: appointment.vehiclePlate,
    vehicle_name: appointment.vehicleName,
    service_name: appointment.serviceName,
    service_id: appointment.serviceId,
    appointment_date: appointment.date,
    start_time: appointment.time,
    notes: appointment.notes,
    price: appointment.price,
    status: appointment.status,
    created_at: appointment.createdAt
  };
}

async function getAppointments() {
  const client = getSupabaseClient();

  if (client) {
    const { data, error } = await client
      .from("appointments")
      .select("*")
      .eq("business_id", supabaseConfig.businessId)
      .order("appointment_date", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data.map(mapDbAppointment);
  }

  const raw = localStorage.getItem(storageKey);
  return raw ? JSON.parse(raw) : [];
}

async function saveAppointments(appointments) {
  const client = getSupabaseClient();

  if (client) {
    const { error: deleteError } = await client
      .from("appointments")
      .delete()
      .eq("business_id", supabaseConfig.businessId);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    if (!appointments.length) return;

    const { error: insertError } = await client
      .from("appointments")
      .insert(appointments.map(mapAppointmentToDb));

    if (insertError) {
      throw new Error(insertError.message);
    }

    return;
  }

  localStorage.setItem(storageKey, JSON.stringify(appointments));
}

async function addAppointment(appointment) {
  const appointments = await getAppointments();
  await saveAppointments([...appointments, appointment]);
}

async function updateAppointmentStatus(id, status) {
  const appointments = await getAppointments();
  const updatedAppointments = appointments.map((appointment) =>
    appointment.id === id ? { ...appointment, status } : appointment
  );

  await saveAppointments(updatedAppointments);
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

async function clearAppointments() {
  const client = getSupabaseClient();

  if (client) {
    const { error } = await client
      .from("appointments")
      .delete()
      .eq("business_id", supabaseConfig.businessId);

    if (error) {
      throw new Error(error.message);
    }

    return;
  }

  localStorage.removeItem(storageKey);
}
