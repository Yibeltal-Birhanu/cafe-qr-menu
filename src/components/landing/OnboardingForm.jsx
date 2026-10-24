import React, { useState } from 'react';
import { AlertTriangleIcon, CheckCircleIcon, LockIcon } from '../common/Icons.jsx';

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
          <h2>Ready to modernize your cafe's menu?</h2>
          <p>
            Join forward-thinking cafes and restaurants delivering a premium digital menu experience. Submit your venue details to explore how CafeMenu fits your dining room.
          </p>

          <div className="contact-sec__direct-card">
            <strong>Direct Partner Inquiries</strong>
            <span>
              Looking for multi-branch rollouts, enterprise white-labeling, or specialized hardware stands? Contact our onboarding team through the form or review the live Cafe reference menu.
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
                  placeholder="e.g. 0911234567 or sara@example.com"
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
                  Number of Tables (Approx.)
                </label>
                <select
                  id="tablesInput"
                  className="form-select"
                  value={tables}
                  onChange={(e) => setTables(e.target.value)}
                >
                  <option value="1-10">1 &ndash; 10 tables (Boutique Cafe)</option>
                  <option value="11-25">11 &ndash; 25 tables (Bistro / Mid-size)</option>
                  <option value="26-50">26 &ndash; 50 tables (Full Restaurant)</option>
                  <option value="50+">50+ tables (Multi-story / Chain)</option>
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
                Your contact details are kept strictly private and used only for onboarding your cafe.
              </div>
            </form>
          </div>

          {/* Clean, Professional Confirmation Box */}
          <div
            className="form-success-box"
            id="leadSuccess"
            aria-live="polite"
            style={{ display: submitted ? 'block' : 'none' }}
          >
            <div className="form-success-box__icon">
              <CheckCircleIcon size={34} />
            </div>
            <h4>Setup Request Received</h4>
            <p>
              Thank you for requesting setup for <strong id="leadSuccessCafe">{submittedCafe}</strong>!
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--c-text-muted)', margin: '1rem 0' }}>
              Our onboarding specialist will review your details and reach out with your custom menu preview within 24 hours.
            </p>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/cafe" className="l-btn l-btn--primary">
                <span>Explore Live Cafe Demo</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
              <button
                type="button"
                className="l-btn l-btn--secondary"
                id="resetFormBtn"
                onClick={handleReset}
              >
                <span>Submit Another Request</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
