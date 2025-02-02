import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import Contact from "../models/Contact";
import { getToken, isTokenExpired, getName } from "../Helper/Tokens";

const Navbar = () => {
  const [menu, setMenu] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleChange = () => {
    setMenu(!menu);
  };

  const closeMenu = () => {
    setMenu(false);
  };

  const openForm = () => {
    setShowForm(true);
    setMenu(false);
  };

  const closeForm = () => {
    setShowForm(false);
  };

  const token = getToken('access');
  const username = isTokenExpired(token) ? null : getName(token);

  return (
    <div className="fixed w-full z-10 text-white">
      <div>
        <div className="flex flex-row justify-between p-5 md:px-32 px-5  shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] bg-blue-900" >
          <div className="flex flex-row items-center cursor-pointer">
            <Link to="/">
              <h1 className="text-2xl font-extrabold ">Skin Scan</h1>
            </Link>
          </div>
          <nav className="hidden lg:flex flex-row items-center text-lg font-medium gap-6">
            <Link to="/" className="hover:text-hoverColor transition-all cursor-pointer">Home</Link>
            <Link to="/scan" className="hover:text-hoverColor transition-all cursor-pointer">Scan</Link>
            <Link to="/history" className="hover:text-hoverColor transition-all cursor-pointer">History</Link>
            <Link to="/about" className="hover:text-hoverColor transition-all cursor-pointer">About Us</Link>
            <Link to="/blogs" className="hover:text-hoverColor transition-all cursor-pointer">Browse Disease</Link>
            <Link to="/doctors" className="hover:text-hoverColor transition-all cursor-pointer">Doctors</Link>
            <Link to="/feedback" className="hover:text-hoverColor transition-all cursor-pointer">FeedBack</Link>
            {isTokenExpired(token) ? (
              <Link to="/login" className="bg-blue-900 text-white rounded-lg hover:text-hoverColor transition-all cursor-pointer px-4 py-2  ml-6">Login</Link>
            ) : null}
            {isTokenExpired(token) ? (
              <Link to="/register" className="bg-blue-900 text-white rounded-lg hover:text-hoverColor transition-all cursor-pointer px-4 py-2 ml-0">Register</Link>
            ) : (
              <Link to="/account" className="bg-blue-900 text-white rounded-lg hover:text-hoverColor transition-all cursor-pointer px-4 py-2 ml-0">
                {username}
              </Link>
            )}
          </nav>
          {showForm && <Contact closeForm={closeForm} />}
          <div className="lg:hidden flex items-center">
            {menu ? (
              <AiOutlineClose size={28} onClick={handleChange} />
            ) : (
              <AiOutlineMenu size={28} onClick={handleChange} />
            )}
          </div>
        </div>
        <div className={`${menu ? "translate-x-0" : "-translate-x-full"} lg:hidden flex flex-col absolute bg-blue-900 text-white left-0 top-16 font-semibold text-2xl text-center pt-8 pb-4 gap-8 w-full h-fit transition-transform duration-300`}>
          <Link to="/" className="hover:text-hoverColor transition-all cursor-pointer" onClick={closeMenu}>Home</Link>
          <Link to="/scan" className="hover:text-hoverColor transition-all cursor-pointer" onClick={closeMenu}>Scan</Link>
          <Link to="/history" className="hover:text-hoverColor transition-all cursor-pointer" onClick={closeMenu}>History</Link>
          <Link to="/about" className="hover:text-hoverColor transition-all cursor-pointer" onClick={closeMenu}>About Us</Link>
          <Link to="/blogs" className="hover:text-hoverColor transition-all cursor-pointer" onClick={closeMenu}>Browse Disease</Link>
          <Link to="/doctors" className="hover:text-hoverColor transition-all cursor-pointer" onClick={closeMenu}>Doctors</Link>
          <Link to="/feedback" className="hover:text-hoverColor transition-all cursor-pointer">FeedBack</Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;