import { ImageResponse } from 'next/og';
import { siteConfig } from '@content/site';

/**
 * Edge runtime is required here: @vercel/og (Satori) loads its font
 * resources through WASM, which only works on the edge runtime. Running
 * this on the Node runtime fails the prerender with "Invalid URL".
 */
export const runtime = 'edge';
export const alt = `${siteConfig.name} — ${siteConfig.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background:
            'linear-gradient(135deg, #05060a 0%, #1a0e2c 50%, #062336 100%)',
          color: '#f6f6fb',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #915cff, #82dcff)',
              color: '#0b0b0f',
              fontWeight: 700,
              fontSize: 22,
            }}
          >
            {siteConfig.initials}
          </div>
          <div style={{ fontSize: 22, opacity: 0.7 }}>{siteConfig.location}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 28, opacity: 0.65, letterSpacing: 4, textTransform: 'uppercase' }}>
            {siteConfig.role}
          </div>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: -3,
              lineHeight: 0.95,
              backgroundImage: 'linear-gradient(120deg, #82dcff, #915cff)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {siteConfig.name}
          </div>
          <div style={{ fontSize: 30, maxWidth: 900, lineHeight: 1.25, opacity: 0.85 }}>
            {siteConfig.tagline}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 22,
            opacity: 0.6,
            borderTop: '1px solid rgba(255,255,255,0.15)',
            paddingTop: 24,
          }}
        >
          <span>{siteConfig.url.replace('https://', '')}</span>
          <span>{siteConfig.availability.label}</span>
        </div>
      </div>
    ),
    { ...size },
  );
}