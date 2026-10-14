import '../config/env.js';
import { useFileDb } from '../config/dbMode.js';

let Admin;
let SiteSettings;
let Page;
let Category;
let Project;
let Media;
let ContactMessage;

if (useFileDb()) {
  ({ Admin } = await import('./file/Admin.js'));
  ({ SiteSettings } = await import('./file/SiteSettings.js'));
  ({ Page } = await import('./file/Page.js'));
  ({ Category } = await import('./file/Category.js'));
  ({ Project } = await import('./file/Project.js'));
  ({ Media } = await import('./file/Media.js'));
  ({ ContactMessage } = await import('./file/ContactMessage.js'));
} else {
  ({ Admin } = await import('./mongo/Admin.js'));
  ({ SiteSettings } = await import('./mongo/SiteSettings.js'));
  ({ Page } = await import('./mongo/Page.js'));
  ({ Category } = await import('./mongo/Category.js'));
  ({ Project } = await import('./mongo/Project.js'));
  ({ Media } = await import('./mongo/Media.js'));
  ({ ContactMessage } = await import('./mongo/ContactMessage.js'));
}

export { Admin, SiteSettings, Page, Category, Project, Media, ContactMessage };
