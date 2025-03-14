import React from 'react';
import HomeHero from '../components/Home/HomeHero';
import HeroBenefits from '../components/Home/HeroBenefits';
import HomeIdentityEvolve from '../components/Home/HomeIdentityEvolve';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HomeHero />
      <HeroBenefits />
      <HomeIdentityEvolve />
    </div>
  );
};

export default HomePage;