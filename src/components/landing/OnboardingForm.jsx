import React, { useState } from 'react';
import { AlertTriangleIcon, CheckCircleIcon, InfoIcon, LockIcon } from '../common/Icons.jsx';

export default function OnboardingForm() {
  const [cafeName, setCafeName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [contact, setContact] = useState('');
  const [tables, setTables] = useState('11-25');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedCafe, setSubmittedCafe] = useState('');

  const isValidContact = (value) => {
    if (!value) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (emailRegex.test(value)) return true;

    const phoneCharsRegex = /^[\d\s+\-().]+$/;
    if (!phoneCharsRegex.test(value)) return false;

    const digitsOnly = value.replace(/\D/g, '');
    return digitsOnly.length >= 7 && digitsOnly.length <= 15;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cName = cafeName.trim();
    const oName = ownerName.trim();
    const cInfo = contact.trim();

    if (!cName) {
      setError('Please provide your cafe or restaurant name.');
      return;
    }
    if (!oName) {
      setError('Please provide your contact name.');
      return;
    }
    if (!cInfo) {
      setError('Please provide an email address or telephone number.');
      return;
    }
    if (!isValidContact(cInfo)) {
      setError('Please enter a valid email address or phone number (e.g. 0911234567 or sara@example.com).');
      return;
    }

    setError('');
    setSubmittedCafe(cName);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setCafeName('');
    setOwnerName('');
    setContact('');
    setNotes('');
    setError('');
  };

  return (
    <section className="contact-sec" id="contact">
      <div className="l-wrap contact-sec__grid">
        {/* Left Column: Copy & Onboarding Info */}
        <div className="contact-sec__left">
          <h2>Ready to modernise your cafe's menu?</h2>
          <p>
            Join forward-thinking cafes and restaurants delivering a premium digital menu experience. Submit your venue details to explore how CafeMenu fits your dining room.
          </p>

          <div className="contact-sec__direct-card">
            <strong>Direct Partner Inquiries</strong>
            <span>
              Looking for multi-branch rollouts, enterprise white-labeling, or specialized hardware stands? Contact our onboarding team through the form or review the live Cafe reference implementation.
            </span>
          </div>
        </div>

        {/* Right Column: Lead Capture Form */}
        <div className="lead-form-box">
          <div id="formContainer" style={{ display: submitted ? 'none' : 'block' }}>
            <h3>Request Cafe Setup</h3>
            <p>Tell us about your cafe to receive a customized digital menu preview.</p>

            <form id="leadForm" noValidate onSubmit={handleSubmit}>
              {/* Accessible Inline Error Banner */}
              <div
                className="form-error-banner"
                id="formErrorBanner"
                role="alert"
                aria-live="polite"
                hidden={!error}
              >
                <span className="form-error-icon" aria-hidden="true">
                  <AlertTriangleIcon size={16} />
                </span>
                <span id="formErrorMessage">{error}</span>
              </div>

              <div className="form-group">
                <label htmlFor="cafeNameInput" className="form-label">
                  Cafe or Restaurant Name *
                </label>
                <input
                  type="text"
                  id="cafeNameInput"
                  className="form-input"
                  placeholder="e.g. Blue Nile Roasters"
                  required
                  value={cafeName}
                  onChange={(e) => {
                    setCafeName(e.target.value);
                    if (error) setError('');
                  }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="ownerNameInput" className="form-label">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="ownerNameInput"
                  className="form-input"
                  placeholder="e.g. Sara Tekle"
                  required
                  value={ownerName}
                  onChange={(e) => {
                    setOwnerName(e.target.value);
                    if (error) setError('');
                  }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactInput" className="form-label">
                  Email or Phone Number *
                </label>
                <input
                  type="text"
                  id="contactInput"
                  className="form-input"
                  placeholder="e.g. sara@bluenile.com or 0911234567"
                  required
                  value={contact}
                  onChange={(e) => {
                    setContact(e.target.value);
                    if (error) setError('');
                  }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="tablesInput" className="form-label">
                  Approximate Number of Tables
                </label>
                <select
                  id="tablesInput"
                  className="form-select"
                  value={tables}
                  onChange={(e) => setTables(e.target.value)}
                >
                  <option value="1-10">1 &ndash; 10 tables (Boutique / Coffee Bar)</option>
                  <option value="11-25">11 &ndash; 25 tables (Mid-size Cafe / Bistro)</option>
                  <option value="26-50">26 &ndash; 50 tables (Full Restaurant)</option>
                  <option value="50+">50+ tables (Multi-zone / Chain)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="notesInput" className="form-label">
                  Special Requirements or Notes (Optional)
                </label>
                <textarea
                  id="notesInput"
                  className="form-textarea"
                  placeholder="e.g. We need English &amp; Amharic, plus high-res photo photography setup."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <button type="submit" className="l-btn l-btn--primary form-btn-submit" id="submitLeadBtn">
                <span>Submit Setup Request</span>
                <span aria-hidden="true">&rarr;</span>
              </button>

              <div className="form-notice">
                <LockIcon size={14} style={{ verticalAlign: '-2px', marginRight: '4px' }} />
                Prototype Preview: This is a client-side prototype demonstration. No information is transmitted to a server or saved to external databases.
              </div>
            </form>
          </div>

          {/* Honest, Privacy-Aware Confirmation Feedback Box */}
          <div
            className="form-success-box"
            id="leadSuccess"
            aria-live="polite"
            style={{ display: submitted ? 'block' : 'none' }}
          >
            <div className="form-success-box__icon">
              <CheckCircleIcon size={34} />
            </div>
            <h4>Prototype Preview Confirmed</h4>
            <p>
              Thank you for exploring the demo setup for <strong id="leadSuccessCafe">{submittedCafe}</strong>!
            </p>
            <div
              style={{
                background: 'rgba(22, 78, 56, 0.06)',
                border: '1px solid var(--b-border)',
                borderRadius: 'var(--r-sm)',
                padding: '0.85rem 1rem',
                margin: '1rem 0',
                textAlign: 'left',
                fontSize: '0.85rem',
                color: 'var(--c-text)',
                lineHeight: 1.5,
              }}
            >
              <strong
                style={{
                  color: 'var(--c-forest)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '0.25rem',
                }}
              >
                <InfoIcon size={16} />
                Client-Side Prototype Notice:
              </strong>
              <span>
                This demonstration was validated locally in your browser. Your request was <strong>NOT</strong> transmitted to CafeMenu or logged on a remote server, and no personal contact details were retained. In the production release, this workflow will submit your venue onboarding inquiry directly to the CafeMenu onboarding team.
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--c-text-muted)', marginTop: '0.5rem' }}>
              Tour the working Cafe reference menu to experience our camera-first digital dining presentation.
            </p>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/cafe" className="l-btn l-btn--primary">
                <span>Open Cafe Demo</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
              <button
                type="button"
                className="l-btn l-btn--secondary"
                id="resetFormBtn"
                onClick={handleReset}
              >
                <span>Test Another Venue</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
