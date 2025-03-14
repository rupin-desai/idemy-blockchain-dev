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
        <span className="text-gray-600">{isOpen ? '-' : '+'}</span>
      </button>
      {isOpen && (
        <div className="pb-4 text-gray-600">
          {item.answer}
        </div>
      )}
    </div>
  );
};

const AboutFAQ = () => {
  const [openFAQIndex, setOpenFAQIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQIndex(openFAQIndex === index ? null : index);
  };

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
        Frequently Asked Questions
      </h2>
      <div className="max-w-3xl mx-auto bg-white rounded shadow-md">
        {faqData.map((item, index) => (
          <FAQItem
            key={index}
            item={item}
            isOpen={openFAQIndex === index}
            toggle={() => toggleFAQ(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default AboutFAQ;