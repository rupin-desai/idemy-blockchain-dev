import React from 'react';
import HomeHero from '../components/Home/HomeHero';
import HeroBenefits from '../components/Home/HeroBenefits';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HomeHero />
      <HeroBenefits />
    </div>
  );
};

export default HomePage;