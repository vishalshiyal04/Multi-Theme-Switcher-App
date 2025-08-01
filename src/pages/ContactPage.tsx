import React from 'react';
import PageContent from '../components/PageContent.tsx';
import Button from '../components/Button.tsx';

const ContactPage: React.FC = () => {
  return (
    <PageContent title="Contact Us">
      <p className="text-lg mb-6">
        Have questions or need assistance? Feel free to reach out to our friendly team.
        We're here to help you with all your gardening needs.
      </p>
      <p className="text-lg mb-6">
        Email: <a href="mailto:info@plantparadise.com" className="underline">info@plantparadise.com</a><br />
        Phone: (123) 456-7890
      </p>
      <Button>Send a Message</Button>
    </PageContent>
  );
};

export default ContactPage;
