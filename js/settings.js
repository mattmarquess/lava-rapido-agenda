const business = {
  name: "BrilhoMax",
  type: "Lava Rápido",
  shortName: "BM",
  whatsapp: "5500000000000",
  address: "Rua Exemplo, 123",
  openingLabel: "Seg a Sáb",
  openingHours: "08:00 às 18:00",
  boxesAvailable: 2
};

const services = [
  {
    id: "lavagem-simples",
    name: "Lavagem Simples",
    description: "Lavagem externa com secagem e acabamento básico.",
    price: 40,
    duration: 40
  },
  {
    id: "lavagem-completa",
    name: "Lavagem Completa",
    description: "Lavagem externa, aspiração interna e limpeza de painel.",
    price: 70,
    duration: 60
  },
  {
    id: "higienizacao",
    name: "Higienização Interna",
    description: "Limpeza profunda de bancos, carpetes e áreas internas.",
    price: 180,
    duration: 180
  },
  {
    id: "polimento",
    name: "Polimento Técnico",
    description: "Correção leve de pintura com brilho e proteção.",
    price: 260,
    duration: 240
  },
  {
    id: "motor",
    name: "Lavagem de Motor",
    description: "Limpeza cuidadosa do cofre do motor.",
    price: 90,
    duration: 70
  },
  {
    id: "combo",
    name: "Combo Premium",
    description: "Lavagem completa, cera, pretinho e acabamento detalhado.",
    price: 120,
    duration: 100
  }
];

const vehicleTypes = [
  { id: "hatch", name: "Carro pequeno", multiplier: 1 },
  { id: "moto", name: "Moto", multiplier: 0.7 },
  { id: "sedan", name: "Sedan", multiplier: 1.15 },
  { id: "suv", name: "SUV", multiplier: 1.3 },
  { id: "pickup", name: "Caminhonete", multiplier: 1.45 }
];

const availableTimes = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00"
];

const appointmentStatuses = ["Agendado", "Em atendimento", "Pronto", "Entregue", "Cancelado"];
const finishedStatuses = ["Entregue", "Cancelado"];
const storageKey = "brilhomax_appointments";
const settingsStorageKey = "brilhomax_settings";
const authStorageKey = "brilhomax_admin_auth";
const defaultAdminPassword = "1234";

const defaultSettings = {
  business: { ...business },
  services: services.map((service) => ({ ...service })),
  vehicleTypes: vehicleTypes.map((vehicle) => ({ ...vehicle })),
  availableTimes: [...availableTimes]
};
