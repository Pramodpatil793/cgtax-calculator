import React from 'react';
// 1. Change the imported icon from Info to AlertTriangle
import { AlertTriangle } from 'lucide-react';

export const CryptoFields = () => {
    return (
        // 2. Update the container's colors from indigo to amber for a "warning" look
        <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-400/20 text-center text-sm text-amber-300 flex items-center justify-center gap-2">
            {/* 3. Use the new AlertTriangle icon */}
            <AlertTriangle className="w-4 h-4" />
            No deductions for expenses are allowed for crypto assets.
        </div>
    );
};