import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { Admin } from '../models/Admin.js';
import { SiteSettings } from '../models/SiteSettings.js';
import { Page } from '../models/Page.js';
import { Category } from '../models/Category.js';

export async function ensureSeedData() {
  const passwordHash = await bcrypt.hash(env.adminPassword, 10);
  const existingAdmin = await Admin.findOne({ email: env.adminEmail.toLowerCase() });
  if (!existingAdmin) {
    await Admin.create({
      email: env.adminEmail.toLowerCase(),
      passwordHash,
    });
  } else {
    await Admin.findOneAndUpdate(
      { email: env.adminEmail.toLowerCase() },
      { passwordHash }
    );
  }

  const settingsCount = await SiteSettings.countDocuments();
  if (settingsCount === 0) {
    await SiteSettings.create({
      brandName: 'PARA',
      brandSecondary: 'Creative Origin',
      tagline: 'Packaging & Branding Studio',
      footerText: '© PARA Creative Origin — Packaging & Branding Studio',
      contactEmail: 'hello@para.studio',
    });
  }

  const about = await Page.findOne({ slug: 'about' });
  if (!about) {
    await Page.findOneAndUpdate(
      { slug: 'about' },
      {
        slug: 'about',
        title: 'About PARA',
        lead: 'Packaging & branding studio crafting memorable product identities.',
        body: '<p>PARA Creative Origin is a packaging and branding studio focused on tactile design, clear storytelling, and production-ready systems.</p><p>We partner with founders and brands to shape product lines that feel intentional on shelf and online.</p>',
      },
      { upsert: true, new: true }
    );
  }

  const contact = await Page.findOne({ slug: 'contact' });
  if (!contact) {
    await Page.findOneAndUpdate(
      { slug: 'contact' },
      {
        slug: 'contact',
        title: 'Contact us',
        lead: 'Tell us about your product, launch, or rebrand.',
        body: '<p>Share a short brief and we will get back to you.</p>',
        ctaText: 'Send message',
      },
      { upsert: true, new: true }
    );
  }

  const existingCats = await Category.countDocuments();
  if (existingCats === 0) {
    await Category.insertMany([
      { name: 'Packaging', slug: 'packaging', order: 1 },
      { name: 'Branding', slug: 'branding', order: 2 },
      { name: 'Identity', slug: 'identity', order: 3 },
    ]);
  }
}
