import { MetadataRoute } from 'next';

const sitemap = (): MetadataRoute.Sitemap => [
  {
    url: 'https://activity-manager.colorsdev.tech',
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 1,
  },
  {
    url: 'https://activity-manager.colorsdev.tech/home',
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.8,
  },
  // NOTA: Non inserire /dashboard o rotte private qui!
];

export default sitemap;