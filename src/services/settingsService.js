import { SiteSettings } from '../models/SiteSettings.js';

export async function getSettings() {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }
  return settings;
}

export async function updateSettings(payload) {
  const settings = await getSettings();
  Object.assign(settings, payload);
  if (payload.socials) {
    settings.socials = { ...settings.socials.toObject?.() || settings.socials, ...payload.socials };
  }
  await settings.save();
  return settings;
}
