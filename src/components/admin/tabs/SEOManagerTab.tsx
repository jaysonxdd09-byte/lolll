import React, { useState, useEffect } from 'react';
import { Search, Globe, FileText, Map, Code, Download, Save, RefreshCw, CheckCircle, Link, ExternalLink, Tag, Layout, Database } from 'lucide-react';

interface MetaTag {
  page: string;
  title: string;
  description: string;
  keywords: string;
  canonical: string;
}

interface SitemapUrl {
  url: string;
  priority: string;
  changefreq: string;
  lastmod: string;
}

interface OpenGraph {
  title: string;
  description: string;
  image: string;
  url: string;
  type: string;
}

interface SchemaMarkup {
  organization: string;
  logo: string;
  phone: string;
  email: string;
  address: string;
}

interface SEOConfig {
  metaTags: MetaTag[];
  robotsContent: string;
  sitemapUrls: SitemapUrl[];
  openGraph: OpenGraph;
  schemaMarkup: SchemaMarkup;
  headerScripts: string;
  footerScripts: string;
  googleAnalyticsId: string;
  googleTagManagerId: string;
  facebookPixelId: string;
}

const STORAGE_KEY = 'testone_seo_config';

const DEFAULT_CONFIG: SEOConfig = {
  metaTags: [
    { page: 'Home', title: 'Test One Solutions India - Premium Medical Supplies', description: 'Leading supplier of premium medical equipment and surgical supplies in India. 500+ products across 16 categories.', keywords: 'medical supplies, surgical instruments, healthcare equipment, medical products', canonical: 'https://testone.com/' },
    { page: 'Products', title: 'Medical Products Catalog - Test One Solutions', description: 'Browse our complete catalog of 500+ medical supplies and surgical instruments.', keywords: 'medical products, surgical supplies, medical catalog', canonical: 'https://testone.com/products' },
    { page: 'About', title: 'About Test One Solutions - Trusted Medical Supplier', description: '15+ years of excellence in medical supplies. Serving 500+ hospitals across India.', keywords: 'about test one, medical supplier, healthcare company', canonical: 'https://testone.com/about' },
    { page: 'Contact', title: 'Contact Test One Solutions India', description: 'Get in touch with us for medical supplies and distributor inquiries.', keywords: 'contact, medical supplies, distributor inquiry', canonical: 'https://testone.com/contact' },
  ],
  robotsContent: `User-agent: *
Allow: /
Disallow: /admin
Disallow: /cart
Disallow: /checkout
Disallow: /my-orders
Sitemap: https://testone.com/sitemap.xml

# Googlebot
User-agent: Googlebot
Allow: /`,
  sitemapUrls: [
    { url: 'https://testone.com/', priority: '1.0', changefreq: 'daily', lastmod: new Date().toISOString().split('T')[0] },
    { url: 'https://testone.com/products', priority: '0.9', changefreq: 'daily', lastmod: new Date().toISOString().split('T')[0] },
    { url: 'https://testone.com/about', priority: '0.7', changefreq: 'monthly', lastmod: new Date().toISOString().split('T')[0] },
    { url: 'https://testone.com/contact', priority: '0.7', changefreq: 'monthly', lastmod: new Date().toISOString().split('T')[0] },
    { url: 'https://testone.com/certificates', priority: '0.6', changefreq: 'monthly', lastmod: new Date().toISOString().split('T')[0] },
    { url: 'https://testone.com/blogs', priority: '0.6', changefreq: 'weekly', lastmod: new Date().toISOString().split('T')[0] },
    { url: 'https://testone.com/faq', priority: '0.5', changefreq: 'monthly', lastmod: new Date().toISOString().split('T')[0] },
  ],
  openGraph: {
    title: 'Test One Solutions India',
    description: 'Premium Medical Supplies & Surgical Instruments - 15+ Years of Excellence',
    image: 'https://testone.com/images/og-image.jpg',
    url: 'https://testone.com',
    type: 'website'
  },
  schemaMarkup: {
    organization: 'Test One Solutions India',
    logo: 'https://testone.com/images/logo.png',
    phone: '+91-9403890299',
    email: 'info@testone.com',
    address: 'India'
  },
  headerScripts: '',
  footerScripts: '',
  googleAnalyticsId: '',
  googleTagManagerId: '',
  facebookPixelId: ''
};

function getConfig(): SEOConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULT_CONFIG };
}

function saveConfig(c: SEOConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
  localStorage.setItem('testone_seo_updated', Date.now().toString());
}

export default function SEOManagerTab() {
  const [config, setConfig] = useState<SEOConfig>(getConfig());
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'meta' | 'robots' | 'sitemap' | 'og' | 'schema' | 'scripts'>('meta');

  const update = (partial: Partial<SEOConfig>) => {
    setConfig(prev => ({ ...prev, ...partial }));
  };

  const handleSave = () => {
    setSaving(true);
    saveConfig(config);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }, 300);
  };

  const downloadRobotsTxt = () => {
    const blob = new Blob([config.robotsContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadSitemapXml = () => {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${config.sitemapUrls.map(u => `  <url>
    <loc>${u.url}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
    const blob = new Blob([sitemap], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const addSitemapUrl = () => {
    const newUrl: SitemapUrl = {
      url: 'https://testone.com/new-page',
      priority: '0.5',
      changefreq: 'monthly',
      lastmod: new Date().toISOString().split('T')[0]
    };
    update({ sitemapUrls: [...config.sitemapUrls, newUrl] });
  };

  const updateSitemapUrl = (index: number, field: keyof SitemapUrl, value: string) => {
    const updated = config.sitemapUrls.map((u, i) => i === index ? { ...u, [field]: value } : u);
    update({ sitemapUrls: updated });
  };

  const removeSitemapUrl = (index: number) => {
    const updated = config.sitemapUrls.filter((_, i) => i !== index);
    update({ sitemapUrls: updated });
  };

  const tabs = [
    { id: 'meta', label: 'Meta Tags', icon: Tag },
    { id: 'robots', label: 'robots.txt', icon: FileText },
    { id: 'sitemap', label: 'Sitemap', icon: Map },
    { id: 'og', label: 'Open Graph', icon: Layout },
    { id: 'schema', label: 'Schema Markup', icon: Database },
    { id: 'scripts', label: 'Scripts', icon: Code },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-serif text-gray-900 flex items-center gap-2">
            <Search className="w-6 h-6 text-primary-500" />
            SEO Manager
          </h3>
          <p className="text-sm text-gray-500 mt-1">Manage SEO files and settings without VPS access</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary-600 transition-all shadow-lg shadow-gray-900/10 disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4 text-green-300" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'meta' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-gray-800 flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary-500" />
              Page Meta Tags
            </h4>
            <div className="space-y-4">
              {config.metaTags.map((meta, index) => (
                <div key={meta.page} className="border border-gray-100 rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-gray-900">{meta.page}</h5>
                    <span className="text-[10px] text-gray-400 font-mono">{meta.canonical}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Title</label>
                      <input
                        value={meta.title}
                        onChange={e => {
                          const updated = config.metaTags.map((m, i) => i === index ? { ...m, title: e.target.value } : m);
                          update({ metaTags: updated });
                        }}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                      />
                      <p className="text-[10px] text-gray-400 text-right">{meta.title.length} chars</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Keywords</label>
                      <input
                        value={meta.keywords}
                        onChange={e => {
                          const updated = config.metaTags.map((m, i) => i === index ? { ...m, keywords: e.target.value } : m);
                          update({ metaTags: updated });
                        }}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
                      <textarea
                        value={meta.description}
                        onChange={e => {
                          const updated = config.metaTags.map((m, i) => i === index ? { ...m, description: e.target.value } : m);
                          update({ metaTags: updated });
                        }}
                        rows={2}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all resize-none"
                      />
                      <p className="text-[10px] text-gray-400 text-right">{meta.description.length} chars</p>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Canonical URL</label>
                      <input
                        value={meta.canonical}
                        onChange={e => {
                          const updated = config.metaTags.map((m, i) => i === index ? { ...m, canonical: e.target.value } : m);
                          update({ metaTags: updated });
                        }}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-mono focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'robots' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black uppercase tracking-widest text-gray-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary-500" />
                robots.txt Editor
              </h4>
              <button
                onClick={downloadRobotsTxt}
                className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-xl text-xs font-bold hover:bg-primary-100 transition-all"
              >
                <Download className="w-4 h-4" />
                Download robots.txt
              </button>
            </div>
            <textarea
              value={config.robotsContent}
              onChange={e => update({ robotsContent: e.target.value })}
              rows={12}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-mono focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all resize-none"
            />
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-xs text-blue-600 font-medium flex items-start gap-2">
                <ExternalLink className="w-4 h-4 shrink-0 mt-0.5" />
                <span>After downloading, upload this file to your VPS root directory (public folder) using FTP or your hosting file manager.</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sitemap' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black uppercase tracking-widest text-gray-800 flex items-center gap-2">
                <Map className="w-4 h-4 text-primary-500" />
                Sitemap URLs
              </h4>
              <button
                onClick={downloadSitemapXml}
                className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-xl text-xs font-bold hover:bg-primary-100 transition-all"
              >
                <Download className="w-4 h-4" />
                Download sitemap.xml
              </button>
            </div>
            <div className="space-y-3">
              {config.sitemapUrls.map((url, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-end bg-gray-50 border border-gray-100 rounded-xl p-3">
                  <div className="col-span-12 md:col-span-5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">URL</label>
                    <input
                      value={url.url}
                      onChange={e => updateSitemapUrl(index, 'url', e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-xs font-mono focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Priority</label>
                    <select
                      value={url.priority}
                      onChange={e => updateSitemapUrl(index, 'priority', e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                    >
                      <option value="1.0">1.0</option>
                      <option value="0.9">0.9</option>
                      <option value="0.8">0.8</option>
                      <option value="0.7">0.7</option>
                      <option value="0.6">0.6</option>
                      <option value="0.5">0.5</option>
                      <option value="0.4">0.4</option>
                      <option value="0.3">0.3</option>
                    </select>
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Frequency</label>
                    <select
                      value={url.changefreq}
                      onChange={e => updateSitemapUrl(index, 'changefreq', e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                    >
                      <option value="always">Always</option>
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                      <option value="never">Never</option>
                    </select>
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Last Modified</label>
                    <input
                      type="date"
                      value={url.lastmod}
                      onChange={e => updateSitemapUrl(index, 'lastmod', e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                    />
                  </div>
                  <div className="col-span-12 md:col-span-1">
                    <button
                      onClick={() => removeSitemapUrl(index)}
                      className="w-full md:w-auto py-2 px-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all text-xs font-bold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={addSitemapUrl}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-primary-500 hover:text-primary-500 transition-all text-xs font-bold uppercase tracking-widest"
            >
              + Add New URL
            </button>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-xs text-blue-600 font-medium flex items-start gap-2">
                <ExternalLink className="w-4 h-4 shrink-0 mt-0.5" />
                <span>After downloading, upload this file to your VPS root directory (public folder) using FTP or your hosting file manager.</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'og' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-gray-800 flex items-center gap-2">
              <Layout className="w-4 h-4 text-primary-500" />
              Open Graph Tags (Social Media)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">OG Title</label>
                <input
                  value={config.openGraph.title}
                  onChange={e => update({ openGraph: { ...config.openGraph, title: e.target.value } })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">OG URL</label>
                <input
                  value={config.openGraph.url}
                  onChange={e => update({ openGraph: { ...config.openGraph, url: e.target.value } })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-mono focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">OG Type</label>
                <select
                  value={config.openGraph.type}
                  onChange={e => update({ openGraph: { ...config.openGraph, type: e.target.value } })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                >
                  <option value="website">Website</option>
                  <option value="business.business">Business</option>
                  <option value="product">Product</option>
                  <option value="article">Article</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">OG Image URL</label>
                <input
                  value={config.openGraph.image}
                  onChange={e => update({ openGraph: { ...config.openGraph, image: e.target.value } })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-mono focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">OG Description</label>
                <textarea
                  value={config.openGraph.description}
                  onChange={e => update({ openGraph: { ...config.openGraph, description: e.target.value } })}
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'schema' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-gray-800 flex items-center gap-2">
              <Database className="w-4 h-4 text-primary-500" />
              Schema Markup (JSON-LD)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Organization Name</label>
                <input
                  value={config.schemaMarkup.organization}
                  onChange={e => update({ schemaMarkup: { ...config.schemaMarkup, organization: e.target.value } })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Logo URL</label>
                <input
                  value={config.schemaMarkup.logo}
                  onChange={e => update({ schemaMarkup: { ...config.schemaMarkup, logo: e.target.value } })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-mono focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone</label>
                <input
                  value={config.schemaMarkup.phone}
                  onChange={e => update({ schemaMarkup: { ...config.schemaMarkup, phone: e.target.value } })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-mono focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</label>
                <input
                  value={config.schemaMarkup.email}
                  onChange={e => update({ schemaMarkup: { ...config.schemaMarkup, email: e.target.value } })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-mono focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Address</label>
                <input
                  value={config.schemaMarkup.address}
                  onChange={e => update({ schemaMarkup: { ...config.schemaMarkup, address: e.target.value } })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'scripts' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-gray-800 flex items-center gap-2">
              <Code className="w-4 h-4 text-primary-500" />
              Tracking Scripts & Analytics
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Google Analytics ID</label>
                <input
                  value={config.googleAnalyticsId}
                  onChange={e => update({ googleAnalyticsId: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-mono focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Google Tag Manager ID</label>
                <input
                  value={config.googleTagManagerId}
                  onChange={e => update({ googleTagManagerId: e.target.value })}
                  placeholder="GTM-XXXXXXX"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-mono focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Facebook Pixel ID</label>
                <input
                  value={config.facebookPixelId}
                  onChange={e => update({ facebookPixelId: e.target.value })}
                  placeholder="XXXXXXXXXX"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-mono focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Custom Header Scripts</label>
              <textarea
                value={config.headerScripts}
                onChange={e => update({ headerScripts: e.target.value })}
                rows={6}
                placeholder="<!-- Add custom scripts here -->"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-mono focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Custom Footer Scripts</label>
              <textarea
                value={config.footerScripts}
                onChange={e => update({ footerScripts: e.target.value })}
                rows={6}
                placeholder="<!-- Add custom scripts here -->"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-mono focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all resize-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
