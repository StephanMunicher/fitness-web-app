import React from 'react';

const Footer = () => (
  <footer className="bg-dark text-light py-3 mt-auto">
    <div className="container text-center">
      <span style={{ letterSpacing: '1px', fontWeight: 500 }}>
        © {new Date().getFullYear()} Fitness App. Created by Andrew.
      </span>
    </div>
  </footer>
);

export default Footer;