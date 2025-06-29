import React from 'react';
import { Link } from 'react-router-dom'; // Make sure Link is imported
import { ArrowRight, Zap, Calculator, PieChart, Calendar, FileText, Users, Shield } from 'lucide-react';
import ParticleBackground from '../../components/common/ParticleBackground';

const features = [
    { icon: Calculator, title: 'Multi-Asset Calculator', desc: 'Precise tax calculations for equity, MFs, property, gold, and crypto.' },
    { icon: PieChart, title: 'AI Tax Advisor', desc: 'Get personalized tax-saving strategies and explanations for your specific scenario.' },
    { icon: Calendar, title: 'Tax-Loss Harvesting', desc: 'Identify opportunities to offset gains with losses to reduce tax liability.' },
    { icon: FileText, title: 'Compliance Reports', desc: 'Generate ITR-ready summaries for easy tax filing and documentation.' },
    { icon: Users, title: 'CA & Pro Features', desc: 'Manage multiple clients, import broker statements, and more professional tools.' },
    { icon: Shield, title: 'Secure & Private', desc: 'Your financial data is encrypted and never stored without your consent.' }
];

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 text-white">
            <div className="relative overflow-hidden pt-40 pb-16 md:pt-48 md:pb-16 flex items-center justify-center">
                <ParticleBackground />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-800/10 to-pink-800/10" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 mb-8">
                        <Zap className="w-4 h-4 text-green-400 mr-2" />
                        <span className="text-green-400 text-sm font-medium">Updated for FY 2024-25</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6">
                        Master Your Capital Gains Tax
                    </h1>
                    <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
                        India's most comprehensive capital gains tax calculator. Handle equity, mutual funds, real estate, gold, and crypto with confidence.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/calculator">
                            <button id="start-calculating-btn" className="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl">
                                Start Calculating <ArrowRight className="w-5 h-5 ml-2 inline" />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-3xl font-bold text-center text-white mb-12">Everything You Need for Smart Tax Planning</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div key={index} className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                                <Icon className="w-10 h-10 text-purple-400 mb-4" />
                                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-slate-400">{feature.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;