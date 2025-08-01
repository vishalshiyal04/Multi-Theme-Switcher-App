import React from 'react';
import PageContent from '../components/PageContent.tsx';
import Button from '../components/Button.tsx';

const AboutPage: React.FC = () => {
  return (
    <PageContent title="About Us">
      <p className="text-lg mb-6">
        Plant Paradise is dedicated to providing high-quality plants and gardening essentials.
        Our mission is to connect people with nature and foster a love for sustainable living.
      </p>
      <p className="text-lg mb-6">
        We believe in nurturing growth, both in our plants and in our community.
        Join us on this green journey!
      </p>
      <Button>Learn More</Button>
    </PageContent>
  );
};

export default AboutPage;
