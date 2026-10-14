import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    logoUrl: { type: String, default: '' },
    brandName: { type: String, default: 'PARA' },
    brandSecondary: { type: String, default: 'Creative Origin' },
    tagline: { type: String, default: 'Packaging & Branding Studio' },
    footerText: { type: String, default: '© PARA Creative Origin' },
    contactEmail: { type: String, default: 'hello@para.studio' },
    contactPhone: { type: String, default: '' },
    socials: {
      linkedin: { type: String, default: '' },
      behance: { type: String, default: '' },
      dribbble: { type: String, default: '' },
      instagram: { type: String, default: '' },
      other: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
