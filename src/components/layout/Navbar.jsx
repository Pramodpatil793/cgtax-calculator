import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Menu, X } from 'lucide-react';
import { AppContext } from '../../contexts/AppContext';

// A simple hook to detect if the page has been scrolled
const useScroll = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Set scrolled to true if user has scrolled more than 10px
            setIsScrolled(window.scrollY > 10);
        };
        
        window.addEventListener('scroll', handleScroll);
        // Clean up the event listener on component unmount
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return isScrolled;
};


const Navbar = () => {
    const { setSelectedAsset } = useContext(AppContext);
    const [isOpen, setIsOpen] = useState(false);
    const isScrolled = useScroll();

    // This helper function resets the selected asset when navigating home via the logo.
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
                    {/* This ensures the logo and app name link to the homepage ('/'). */}
                    <Link to="/" onClick={handleHomeLinkClick} className="flex items-center cursor-pointer">
                        <Sparkles className="h-8 w-8 text-purple-400" />
                        <span className="text-2xl font-bold text-white ml-2">CGTax</span>
                    </Link>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {/* This ensures the "Calculator" text links to the calculator page. */}
                            <Link to="/calculator" onClick={handleLinkClick} className="text-slate-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Calculator</Link>
                        </div>
                    </div>
                    
                    {/* The div containing the Log In and Sign Up buttons has been removed. */}

                    <div className="-mr-2 flex md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} type="button" className="bg-slate-800 inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 focus:outline-none">
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-slate-900/95 border-t border-slate-700/50">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/calculator" onClick={handleLinkClick} className="text-slate-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Calculator</Link>
                    </div>
                    {/* The section for mobile Log In and Sign Up buttons has also been removed. */}
                </div>
            )}
        </nav>
    );
};

export default Navbar;