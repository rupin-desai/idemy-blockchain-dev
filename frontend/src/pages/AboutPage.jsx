import React from 'react';
import AboutExplainer from '../components/About/AboutExplainer';
import AboutFAQ from '../components/About/AboutFAQ';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <AboutExplainer />
        <AboutFAQ />
      </div>
    </div>
  );
};

export default AboutPage;