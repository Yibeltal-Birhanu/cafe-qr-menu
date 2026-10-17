import React from 'react';
import { t } from './translations.js';

export default function MenuFooter({ cafe, lang = 'en' }) {
  return (
    <footer className="footer">
      <div
        className="wrap footer__inner"
        style={{
          justifyContent: 'center',
          textAlign: 'center',
          gap: '0.6rem',
          flexDirection: 'column',
        }}
      >
        <div>
          <strong id="footerCafe" style={{ fontSize: '1.15rem', color: 'var(--text)' }}>
            {cafe?.name || 'Cafe'}
          </strong>
          <br />
          <span id="footerNote" style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>
            {cafe?.footer || t('footerNote', lang)}
          </span>
        </div>
        <div id="footerHours" style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.4rem' }}>
          {t('footerHours', lang)}
        </div>
      </div>
    </footer>
  );
}
