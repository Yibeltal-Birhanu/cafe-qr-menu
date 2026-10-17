import React from 'react';
import LandingNavbar from './LandingNavbar.jsx';
import LandingHero from './LandingHero.jsx';
import InteractiveDemo from './InteractiveDemo.jsx';
import BenefitsSection from './BenefitsSection.jsx';
import ShowcaseSection from './ShowcaseSection.jsx';
import HowItWorksSection from './HowItWorksSection.jsx';
import OnboardingForm from './OnboardingForm.jsx';
import LandingFooter from './LandingFooter.jsx';

export default function LandingApp() {
  return (
    <>
      <LandingNavbar />
      <main>
        <LandingHero />
        <InteractiveDemo />
        <BenefitsSection />
        <ShowcaseSection />
        <HowItWorksSection />
        <OnboardingForm />
      </main>
      <LandingFooter />
    </>
  );
}
