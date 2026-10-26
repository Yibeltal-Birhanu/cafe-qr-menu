import React, { useState, useEffect } from 'react';
import {
  CoffeeIcon,
  PizzaIcon,
  CakeIcon,
  FlameIcon,
  SparklesIcon,
} from '../common/Icons.jsx';

export default function Preloader({
  cafeName = 'CafeMenu',
  tagline = 'Curating Fresh Flavors',
  logo = 'coffee',
  theme = null,
  tableNumber = '',
  isReady = false,
  onFinish,
}) {
  const [progress, setProgress] = useState(15);
  const [isHiding, setIsHiding] = useState(false);
  const [minTimePassed, setMinTimePassed] = useState(false);

  const primaryColor = theme?.primaryColor || 'var(--cm-primary, #e6923c)';
  const accentColor = theme?.accentColor || theme?.secondaryColor || '#f59e0b';
  const tableLabel = tableNumber ? `Table #${tableNumber}` : 'Digital Menu';

  // Smooth progress advance
  useEffect(() => {
    const t1 = setTimeout(() => setProgress(45), 180);
    const t2 = setTimeout(() => setProgress(75), 400);
    const t3 = setTimeout(() => setMinTimePassed(true), 800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // When data is ready and minimum animation time has elapsed, complete and fade out
  useEffect(() => {
    if (isReady && minTimePassed) {
      setProgress(100);
      const hideTimer = setTimeout(() => {
        setIsHiding(true);
      }, 150);

      const finishTimer = setTimeout(() => {
        if (onFinish) onFinish();
      }, 600);

      return () => {
        clearTimeout(hideTimer);
        clearTimeout(finishTimer);
      };
    }
  }, [isReady, minTimePassed, onFinish]);

  // Safety fallback: Never stay stuck on preloader for more than 2 seconds
  useEffect(() => {
    const safety = setTimeout(() => {
      setProgress(100);
      setIsHiding(true);
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 300);
    }, 2000);

    return () => clearTimeout(safety);
  }, [onFinish]);

  const renderLogo = () => {
    const size = 38;
    switch (logo) {
      case 'pizza':
        return <PizzaIcon size={size} />;
      case 'cake':
      case 'dessert':
        return <CakeIcon size={size} />;
      case 'flame':
      case 'lounge':
        return <FlameIcon size={size} />;
      default:
        return <CoffeeIcon size={size} />;
    }
  };

  return (
    <div
      className={`cm-preloader ${isHiding ? 'cm-preloader--hiding' : ''}`}
      role="status"
      aria-live="polite"
      aria-label={`Loading ${cafeName}`}
    >
      {/* Background ambient lighting */}
      <div className="cm-preloader__ambient-glow">
        <div
          className="cm-preloader__glow-circle cm-preloader__glow-circle--1"
          style={{ background: primaryColor }}
        />
        <div
          className="cm-preloader__glow-circle cm-preloader__glow-circle--2"
          style={{ background: accentColor }}
        />
      </div>

      <div className="cm-preloader__card">
        {/* Animated Brand Emblem Stage */}
        <div className="cm-preloader__emblem-stage">
          <div
            className="cm-preloader__pulse-ring cm-preloader__pulse-ring--outer"
            style={{ borderColor: primaryColor }}
          />
          <div
            className="cm-preloader__pulse-ring cm-preloader__pulse-ring--inner"
            style={{ borderColor: primaryColor }}
          />
          <div
            className="cm-preloader__icon-box"
            style={{ color: primaryColor }}
          >
            {renderLogo()}
          </div>
        </div>

        {/* Table & Venue Pill Badge */}
        <div className="cm-preloader__badge menu-view-badge">
          <SparklesIcon size={13} style={{ color: primaryColor }} />
          <span>Contactless Dining &bull; {tableLabel}</span>
        </div>

        {/* Cafe Name */}
        <h1 className="cm-preloader__name" id="cafeName">
          {cafeName}
        </h1>

        {/* Tagline */}
        <p className="cm-preloader__tagline">
          {tagline || 'Curated fresh flavors & specialty dining'}
        </p>

        {/* High-End Micro Progress Bar */}
        <div className="cm-preloader__progress-stage">
          <div className="cm-preloader__bar">
            <div
              className="cm-preloader__bar-fill"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${primaryColor}, ${accentColor})`,
              }}
            />
          </div>
          <span className="cm-preloader__status-text">
            {progress < 100 ? 'Preparing your menu...' : 'Welcome! Opening menu...'}
          </span>
        </div>
      </div>
    </div>
  );
}
