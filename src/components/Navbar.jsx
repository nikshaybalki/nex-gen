
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu as MenuIcon, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthOverlay from './AuthOverlay';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, signOut, isAuthOpen, openAuth, closeAuth } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const location = useLocation();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  const toggleMenu = () => setIsOpen(!isOpen);

  // Close mobile menu when route changes
  useEffect(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Academy", path: "/academics" },
    { name: "The Vault", path: "/vault" },
  ];

  return (
    <>
      <div className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 pointer-events-none ${isScrolled ? 'pt-4' : 'pt-6 md:pt-8'}`}>
        
        {/* Main Header Container */}
        <header className="max-w-[1400px] w-full mx-auto px-4 md:px-8 flex justify-between items-center pointer-events-none">
          
          {/* 1. LOGO */}
          <div className="flex-1 pointer-events-auto">
            <Link to="/" className="group inline-flex items-center scale-90 md:scale-100 origin-left transition-transform duration-300 hover:scale-105">
              <div className="text-xl md:text-2xl font-clash tracking-tight text-white mix-blend-difference">
                <span className="font-bold">NEXGEN</span> <span className="font-medium tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-accent to-white ml-1">ACADEMY</span>
              </div>
            </Link>
          </div>

          {/* 2. FLOATING MENU PILL (Desktop) */}
          <motion.nav
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className={`
              hidden lg:flex pointer-events-auto
              items-center justify-center gap-8
              border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]
              backdrop-blur-xl bg-black/50
              transition-all duration-500 ease-in-out relative
              ${isScrolled 
                ? 'rounded-full px-8 py-3' 
                : 'rounded-full px-12 py-4'
              }
            `}
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`
                    font-bold uppercase tracking-widest transition-all duration-300 relative
                    ${isScrolled ? 'text-xs' : 'text-sm'}
                    ${isActive ? 'text-accent' : 'text-gray-400 hover:text-white'}
                  `}
                >
                  {link.name}
                  {isActive && (
                    <motion.span 
                      layoutId="nav-indicator"
                      className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-accent rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </motion.nav>

          {/* 3. AUTH & UTILS */}
          <div className="flex-1 flex items-center justify-end gap-3 md:gap-4 pointer-events-auto">
            {isLoggedIn ? (
              <div className="hidden md:flex items-center gap-4">
                <button
                  onClick={() => signOut()}
                  className="text-gray-400 hover:text-white text-[10px] md:text-xs font-black uppercase tracking-widest transition-colors"
                >
                  Sign Out
                </button>
                <Link
                  to="/profile"
                  className="bg-accent text-black font-black text-[10px] md:text-xs px-5 md:px-6 py-2.5 rounded-full uppercase tracking-widest hover:shadow-neon hover:scale-105 active:scale-95 transition-all"
                >
                  Profile
                </Link>
              </div>
            ) : (
              <button
                onClick={openAuth}
                className="hidden md:block bg-white text-black font-black text-[10px] md:text-xs px-5 md:px-6 py-2.5 rounded-full uppercase tracking-widest hover:bg-accent hover:shadow-neon hover:scale-105 active:scale-95 transition-all"
              >
                Join Elite
              </button>
            )}

            {/* Mobile / Tablet Toggle Button */}
            <button
               onClick={toggleMenu}
               className="lg:hidden p-2.5 bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-white hover:bg-white/10 transition-colors"
            >
              {isOpen ? <X size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
        </header>
      </div>

      <AuthOverlay isOpen={isAuthOpen} onClose={closeAuth} />

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-[85%] sm:w-[400px] h-screen bg-[#0a0a0a] border-l border-white/5 shadow-2xl z-[95] flex flex-col lg:hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-white/5">
                <div className="text-xl font-clash tracking-tight text-white mix-blend-difference">
                  <span className="font-bold">NEXGEN</span>
                </div>
                <button
                  onClick={toggleMenu}
                  className="p-2 bg-black/50 rounded-full border border-white/10 text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-2 flex-1 overflow-y-auto">
                {navLinks.map((link, idx) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Link
                        to={link.path}
                        className={`flex items-center justify-between py-4 group border-b border-white/5 transition-colors
                          ${isActive ? 'text-accent' : 'text-gray-400 hover:text-white'}
                        `}
                      >
                        <span className="text-2xl font-black uppercase tracking-widest relative">
                          {link.name}
                          {isActive && (
                            <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-accent rounded-full shadow-[0_0_8px_var(--accent)]" />
                          )}
                        </span>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              <div className="p-8 bg-black/40 border-t border-white/5 backdrop-blur-md">
                {isLoggedIn ? (
                  <Link
                    to="/profile"
                    className="flex justify-center w-full bg-accent text-black font-black py-4 rounded-xl shadow-neon uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    My Profile
                  </Link>
                ) : (
                  <button
                    onClick={() => { openAuth(); toggleMenu(); }}
                    className="w-full bg-accent text-black font-black py-4 rounded-xl shadow-neon uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Join Elite
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;