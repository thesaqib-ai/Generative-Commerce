import React from 'react';
import { FiSearch, FiShoppingCart, FiUser } from 'react-icons/fi';

const Navbar = () => {
  return (
    <div>
      {/* Navbar */}
      <header className="border-b p-4 text-sm flex justify-between items-center">
        <div className="font-semibold">Generative Commerce</div>
        
        <nav className="flex gap-8">
          <a href="#" className="hover:text-teal-700 transition">NEW IN</a>
          <a href="#" className="hover:text-teal-700 transition">SHOES</a>
          <a href="#" className="hover:text-teal-700 transition">ONLINE EXCLUSIVE</a>
          <a href="#" className="hover:text-teal-700 transition">SALE</a>
        </nav>
        
        <div className="flex gap-4 text-lg text-black">
          <span className="hover:text-teal-700 transition"><FiSearch /></span>
          <span className="hover:text-teal-700 transition"><FiShoppingCart /></span>
          <span className="hover:text-teal-700 transition"><FiUser /></span>
        </div>
      </header>
    </div>
  );
}

export default Navbar;
