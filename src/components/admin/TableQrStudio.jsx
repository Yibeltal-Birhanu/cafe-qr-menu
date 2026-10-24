import React, { useState } from 'react';
import { PrinterIcon } from '../common/Icons.jsx';

export default function TableQrStudio({ cafeName = 'Cafe' }) {
  const [selectedTable, setSelectedTable] = useState('1');

  const origin = typeof window !== 'undefined'
    ? (window.location.origin || (window.location.protocol + '//' + window.location.host))
    : '';
  const tableUrl = `${origin}/scan?table=${encodeURIComponent(selectedTable)}`;
  const qrSrc = `/qr.png?table=${encodeURIComponent(selectedTable)}`;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=650,height=750');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Print Table Stand #${selectedTable} - ${cafeName}</title>
        <style>
          body {
            margin: 0;
            padding: 2rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 90vh;
            font-family: system-ui, -apple-system, sans-serif;
            text-align: center;
            background: #fff;
            color: #111;
          }
          .card {
            border: 2px solid #e5e7eb;
            border-radius: 16px;
            padding: 2.5rem 2rem;
            max-width: 380px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          }
          .cafe-name {
            font-size: 1.6rem;
            font-weight: 800;
            margin-bottom: 0.2rem;
            color: #0f172a;
          }
          .table-num {
            font-size: 1.25rem;
            font-weight: 700;
            color: #c88a35;
            letter-spacing: 0.05em;
            margin-bottom: 1.2rem;
          }
          .qr-img {
            width: 220px;
            height: 220px;
            margin: 0.5rem auto 1.2rem;
            display: block;
          }
          .instructions {
            font-size: 0.95rem;
            color: #475569;
            line-height: 1.4;
          }
          .url-hint {
            margin-top: 1rem;
            font-size: 0.75rem;
            color: #94a3b8;
            word-break: break-all;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="cafe-name">${cafeName}</div>
          <div class="table-num">TABLE #${selectedTable}</div>
          <img class="qr-img" src="${qrSrc}" alt="QR code" />
          <div class="instructions">
            <strong>Open Phone Camera</strong><br>
            Point at the QR code to browse our digital menu
          </div>
          <div class="url-hint">${tableUrl}</div>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 400);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="panel">
      <h2 className="panel__title">Table QR Code Studio</h2>
      <p className="hint">Generate printable QR code table stands for your dining tables.</p>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
        <div style={{ maxWidth: '240px', flex: 1 }}>
          <label className="field">
            <span>Select Table</span>
            <select
              id="adminTableSelect"
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
            >
              <option value="1">Table #1</option>
              <option value="2">Table #2</option>
              <option value="3">Table #3</option>
              <option value="4">Table #4</option>
              <option value="5">Table #5</option>
              <option value="6">Table #6</option>
              <option value="7">Table #7</option>
              <option value="8">Table #8</option>
              <option value="VIP">VIP Lounge</option>
              <option value="Patio">Patio</option>
              <option value="Bar">Bar</option>
            </select>
          </label>
          <div style={{ marginTop: '0.8rem' }}>
            <button
              className="btn btn--primary btn--tiny"
              id="adminPrintTableBtn"
              type="button"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              onClick={handlePrint}
            >
              <PrinterIcon size={14} />
              <span>Print Stand Card</span>
            </button>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <img
            id="adminQrPreview"
            src={qrSrc}
            alt="Table QR code"
            style={{ width: '130px', height: '130px', borderRadius: '12px', background: '#fffaf4', padding: '4px' }}
          />
          <div className="hint" id="adminQrUrl" style={{ marginTop: '0.3rem', fontSize: '0.75rem' }}>
            {tableUrl}
          </div>
        </div>
      </div>
    </div>
  );
}
