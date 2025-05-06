import React from 'react';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <div>
      {/* Footer */}
      <footer className="bg-gray-100 text-sm p-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-gray-700">
        
        {/* Contact */}
        <div>
          <p className="font-semibold mb-2">Get in touch</p>
          <a href="tel:+9242111172724" className="hover:text-teal-700 block transition">+92 42 111172724</a>
          <a href="mailto:support@generativecommerce.com" className="hover:text-teal-700 block transition">
            support@generativecommerce.com
          </a>
        </div>

        {/* Info */}
        <div>
          <p className="font-semibold mb-2">Information</p>
          <a href="#" className="block hover:text-teal-700 transition">Online order tracking</a>
          <a href="#" className="block hover:text-teal-700 transition">Shipping policy</a>
          <a href="#" className="block hover:text-teal-700 transition">Return and exchange policy</a>
          <a href="#" className="block hover:text-teal-700 transition">Privacy policy</a>
          <a href="#" className="block hover:text-teal-700 transition">FAQs</a>
        </div>

        {/* Size Chart */}
        <div>
          <p className="font-semibold mb-2">Size Chart</p>
          <a href="#" className="block hover:text-teal-700 transition">Ladies Shoes Size Chart</a>
        </div>

        {/* Subscription & Socials */}
        <div>
          <p className="font-semibold mb-2">Sign up and save</p>
          <p className="mb-3">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
          <input
            type="email"
            placeholder="Enter your Email"
            className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
          />

          {/* Social Icons */}
          <div className="flex gap-4 text-black text-xl">
            <a href="#" aria-label="Facebook" className="hover:text-teal-700 transition">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-teal-700 transition">
              <FaInstagram />
            </a>
            <a href="#" aria-label="WhatsApp" className="hover:text-teal-700 transition">
              <FaWhatsapp />
            </a>
          </div>
        </div>
        
      </footer>
    </div>
  );
};

export default Footer;
