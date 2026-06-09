import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer>
      <p>&copy; {currentYear} Brew Haven | All Rights Reserved | Crafted with ☕ and ❤️</p>
    </footer>
  );
}

export default Footer;
