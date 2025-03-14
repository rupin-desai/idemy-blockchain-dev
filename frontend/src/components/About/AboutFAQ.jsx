import React, { useState } from 'react';

const faqData = [
  {
    question: 'How does Idemy protect my data?',
    answer:
      'Idemy utilizes blockchain technology to encrypt and decentralize your data, making it virtually impossible to alter or breach.',
  },
  {
    question: 'Can universities verify my credentials?',
    answer:
      'Yes, universities can easily verify your recorded credentials through blockchain’s transparent and immutable ledger.',
  },
];

const FAQItem = ({ item, isOpen, toggle }) => {
  return (
    <div className="border-b border-gray-300">
      <button
        onClick={toggle}
        className="w-full text-left py-4 flex justify-between items-center focus:outline-none"
      >
        <span className="font-medium text-gray-800">{item.question}</span>
        <span className="text-gray-600 text-xl">{isOpen ? '-' : '+'}</span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-40' : 'max-h-0'
        }`}
      >
        <p className="pb-4 text-gray-600">{item.answer}</p>
      </div>
    </div>
  );
};

const AboutFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = index => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-8 px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
        Frequently Asked Questions
      </h2>
      <div className="max-w-2xl mx-auto">
        {faqData.map((item, index) => (
          <FAQItem
            key={index}
            item={item}
            isOpen={openIndex === index}
            toggle={() => toggleFAQ(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default AboutFAQ;