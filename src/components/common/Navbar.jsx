import React, { useContext, useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Languages, ArrowRight, Shield } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { useLang } from '../../context/LangContext';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { itemCount } = useContext(CartContext);
  const { lang, toggleLang, t } = useLang();
  const mobileMenuRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = user && user.is_admin;

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const openMobileMenu = () => {
    mobileMenuRef.current?.showModal();
    setIsMobileMenuOpen(true);
  };

  const closeMobileMenu = () => {
    mobileMenuRef.current?.close();
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: t('shop'), path: '/products' },
    { name: t('bouquets'), path: '/bouquets' },
    { name: t('ai_doctor'), path: '/ai-doctor' },
    { name: t('care_tips'), path: '/plant-tips' },
    { name: t('medicines'), path: '/plant-medicines' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 z-[100] transition-all backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">

            {/* LOGO */}
            <Link to="/" className="flex items-center gap-2 cursor-pointer">
              <img src={logo} alt="Greenify" className="h-9 w-auto" />
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest text-slate-900 hover:text-primary-700 hover:bg-primary-50 transition-colors cursor-pointer"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* DESKTOP ACTIONS */}
            <div className="hidden md:flex items-center gap-1">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[11px] font-bold uppercase tracking-widest transition-colors cursor-pointer mr-1 shadow-sm"
                >
                  <Shield size={14} className="text-white" />
                  <span className="text-white">{t('admin')}</span>
                </Link>
              )}

              <button
                onClick={toggleLang}
                className="p-2 text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-[10px] font-bold uppercase tracking-widest"
              >
                {lang === 'en' ? 'AR' : 'EN'}
              </button>

              <Link to="/cart" className="relative p-2 text-slate-900 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer">
                <ShoppingCart size={18} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary-700 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              <div className="w-px h-6 bg-slate-200 mx-1"></div>

              {user ? (
                <>
                  <Link to="/profile" className="p-2 text-slate-900 hover:text-primary-700 rounded-lg transition-colors cursor-pointer" title={t('profile')}>
                    <User size={18} />
                  </Link>
                  <button
                    onClick={logout}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title={t('logout')}
                  >
                    <LogOut size={18} />
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-slate-900 hover:text-primary-700 transition-colors cursor-pointer">
                    {t('login')}
                  </Link>
                  <Link to="/register" className="px-4 py-2 bg-primary-700 text-white rounded-lg text-[11px] font-bold uppercase tracking-widest hover:bg-primary-800 transition-colors cursor-pointer">
                    {t('signup')}
                  </Link>
                </>
              )}
            </div>

            {/* MOBILE HAMBURGER */}
            <button
              onClick={openMobileMenu}
              className="md:hidden p-2 text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <dialog
        ref={mobileMenuRef}
        className="fixed inset-0 m-0 w-full h-[100dvh] max-w-full max-h-[100dvh] bg-white p-0 outline-none"
        onClick={(e) => e.target === mobileMenuRef.current && closeMobileMenu()}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
            <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-2 cursor-pointer">
              <img src={logo} alt="Greenify" className="h-8 w-auto" />
              <span className="font-serif font-bold text-lg text-slate-900">Greenify</span>
            </Link>
            <button
              onClick={closeMobileMenu}
              className="p-2 text-slate-400 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-2">
            {isAdmin && (
              <Link
                to="/admin"
                onClick={closeMobileMenu}
                className="flex items-center justify-between p-4 rounded-xl bg-green-600 text-white font-bold cursor-pointer mb-4"
              >
                <span className="flex items-center gap-3"><Shield size={20} /> {t('admin')}</span>
                <ArrowRight size={20} />
              </Link>
            )}

            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMobileMenu}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-50 text-slate-900 font-bold hover:bg-primary-50 transition-colors cursor-pointer"
              >
                {link.name}
                <ArrowRight size={18} className="text-slate-300" />
              </Link>
            ))}

            <div className="flex items-center gap-2 pt-4 border-t border-slate-100 mt-4">
              <button onClick={toggleLang} className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-50 text-slate-600 font-bold text-sm cursor-pointer">
                <Languages size={18} />
                {lang === 'en' ? 'العربية' : 'English'}
              </button>
              <Link to="/cart" onClick={closeMobileMenu} className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-50 text-slate-900 font-bold text-sm cursor-pointer">
                <ShoppingCart size={18} />
                {t('cart') || 'Cart'} {itemCount > 0 && `(${itemCount})`}
              </Link>
            </div>
          </div>

          <div className="p-4 border-t border-slate-200">
            {user ? (
              <div className="flex gap-3">
                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="flex-1 flex items-center justify-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-sm cursor-pointer"
                >
                  <User size={18} /> {t('profile')}
                </Link>
                <button
                  onClick={() => { logout(); closeMobileMenu(); }}
                  className="flex-1 flex items-center justify-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm cursor-pointer"
                >
                  <LogOut size={18} /> {t('logout')}
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" onClick={closeMobileMenu} className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-center text-slate-900 text-sm cursor-pointer">
                  {t('login')}
                </Link>
                <Link to="/register" onClick={closeMobileMenu} className="flex-1 p-3 bg-primary-700 text-white rounded-xl font-bold text-center text-sm cursor-pointer">
                  {t('signup')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Navbar;
