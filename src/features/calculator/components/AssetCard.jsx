import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link

// The entire card is now wrapped in a Link. onClick prop is removed.
const AssetCard = React.memo(({ asset }) => {
    const Icon = asset.icon;
    return (
        <Link to={`/calculator/${asset.id}`} className="block">
            <div className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${asset.color} p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl h-full`}>
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <Icon className="w-8 h-8 text-white" />
                        <ChevronRight className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{asset.title}</h3>
                    <p className="text-white/80 text-sm mb-4">{asset.description}</p>
                    <div className="space-y-2 text-xs text-white/90">
                        <div className="flex justify-between"><span>STCG:</span><span className="font-semibold">{asset.stcg}</span></div>
                        <div className="flex justify-between"><span>LTCG:</span><span className="font-semibold">{asset.ltcg}</span></div>
                    </div>
                </div>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
        </Link>
    );
});

export default AssetCard;