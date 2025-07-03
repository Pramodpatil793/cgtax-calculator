import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Correctly imported icons
import { AppContext } from '../../contexts/AppContext';

// A simple hook to detect if the page has been scrolled
const useScroll = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return isScrolled;
};


const Navbar = () => {
    const location = useLocation();
    const { setSelectedAsset } = useContext(AppContext);
    const [isOpen, setIsOpen] = useState(false);
    const isScrolled = useScroll();

    const handleHomeLinkClick = () => {
        setSelectedAsset(null);
        setIsOpen(false);
    }
    
    const handleLinkClick = () => {
        setIsOpen(false);
    }

    return (
        <nav className={`
            bg-slate-900/80 backdrop-blur-sm fixed w-full top-0 z-50 border-b border-slate-700/50
            transition-all duration-300 ease-in-out 
            ${isScrolled ? 'h-14' : 'h-16'} 
        `}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex items-center justify-between h-full">
                    
                    {/* Main Logo - Visible on all screen sizes */}
                    <Link to="/" onClick={handleHomeLinkClick} className="flex items-center cursor-pointer group">
                        <div className="h-12 w-12 ">
                            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M35 15L15 50L35 85" stroke="#7DD3FC" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M65 15L85 50L65 85" stroke="#7DD3FC" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
                                <text x="50" y="68" fontFamily="Inter, sans-serif" fontSize="48" fontWeight="bold" fill="#BAE6FD" textAnchor="middle">₹</text>
                            </svg>
                        </div>
                        <span className="text-4xl font-bold text-white ml-0.5">
                            <span className="text-sky-400">CG</span><span className="font-semibold text-slate-300">Tax</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link
                                to="/calculator"
                                onClick={handleLinkClick}
                                className={`
                                    px-4 py-2 rounded-full text-xl font-semibold transition-all duration-300
                                    ${location.pathname.startsWith('/calculator')
                                        ? 'bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/30'
                                        : 'text-slate-400 hover:text-sky-300 hover:bg-sky-500/5'
                                    }
                                `}
                            >
                                Calculator
                            </Link>
                        </div>
                    </div>
                    
                    {/* Mobile Menu Button */}
                    <div className="-mr-2 flex md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} type="button" className="bg-slate-800 inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 focus:outline-none">
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden bg-slate-900/95 border-t border-slate-700/50">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {/* The "Calculator" link for mobile */}
                        <Link 
                            to="/calculator" 
                            onClick={handleLinkClick} 
                            className={`
                                block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
                                ${location.pathname.startsWith('/calculator')
                                    ? 'bg-slate-700 text-white'
                                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                }
                            `}
                        >
                            Calculator
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;