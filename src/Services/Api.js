import apisauce from 'apisauce';
import { ApiConfigs } from '../Configs';

const Seconds = (n) => n * 1000; // convert seconds to milliseconds

const configs = {
  headers: { 'Content-Type': 'application/json' },

  timeout: Seconds(30),
};

const Maiia = apisauce.create({ ...configs, baseURL: ApiConfigs.baseURL.test });
const Lookups = apisauce.create({
  ...configs,
  baseURL: ApiConfigs.baseURL.lookups,
});

export default {
  lookup: (name) => Lookups.get(name),
  patients: () => Maiia.get('patients'),
  timeslots: () => Maiia.get('timeslots'),
  practitioners: () => Maiia.get('practitioners'),
  availabilities: ({ practitionerId }) =>
    Maiia.get(`availabilities?practitionerId=${practitionerId}`),
  appointments: {
    load: () => Maiia.get('appointments'),
    save: (data) => Maiia.get('appointments', data),
  },
};