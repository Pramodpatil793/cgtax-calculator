export class TaxCalculationResult {
    constructor(rawData) {
        // Assign all raw properties from the calculation
        Object.assign(this, rawData);
    }

    // --- GETTERS FOR DISPLAY ---

    // This new getter helps identify if the loss is from a VDA (crypto)
    get isVdaLoss() {
        return this.hasCapitalLoss && this.assetType === 'Cryptocurrency';
    }    

    // This new getter checks if we have all the necessary data to show the formula.

    get formattedExpenses() {
        return this.totalExpenses?.toLocaleString('en-IN') || '0';
    }

    get isLossDueToIndexation() {
        return this.totalSale > this.totalPurchase && this.netGain < 0 && this.indexedCost > 0;
    }

    get hasIndexationInfo() {
        return this.indexedCost > 0 && this.ciiPurchaseValue && this.ciiSaleValue;
    }

    get totalTaxPayable() {
        if (this.netGain <= 0) return 0;
        return this.baseTax + this.cess;
    }

    get displayTaxRate() {
        return `${this.taxRate * 100}%`;
    }

    get hasZeroTaxLiability() {
        return this.totalTaxPayable <= 0 && this.netGain > 0;
    }
    
    get hasCapitalLoss() {
        return this.netGain < 0;
    }

    get isNeutralGain() {
        return this.netGain === 0;
    }

    get formattedTotalPurchase() {
        return this.totalPurchase.toLocaleString('en-IN');
    }

    get formattedTotalSale() {
        return this.totalSale.toLocaleString('en-IN');
    }

    get formattedNetGainOrLoss() {
        return Math.abs(this.netGain).toLocaleString('en-IN');
    }

    get formattedIndexedCost() {
        return this.indexedCost > 0 ? this.indexedCost.toLocaleString('en-IN') : 'N/A';
    }

    get formattedExemption() {
        return this.exemption > 0 ? this.exemption.toLocaleString('en-IN') : 'N/A';
    }
    
    get formattedTaxableGain() {
        return this.taxableGain.toLocaleString('en-IN');
    }
    
    get formattedBaseTax() {
        return this.baseTax.toLocaleString('en-IN');
    }
    
    get formattedCess() {
        return this.cess.toLocaleString('en-IN');
    }
    
    get formattedTotalTaxPayable() {
        return this.totalTaxPayable.toLocaleString('en-IN');
    }


    // --- METHODS FOR LOGIC ---
    
    getSummaryText() {
        if (this.totalTaxPayable <= 0) return null; // Don't show if no tax is due
        return `Your ${this.isLongTerm ? 'long-term' : 'short-term'} gain of ₹${this.netGain.toLocaleString('en-IN')} is taxable at ${this.displayTaxRate}${this.exemption > 0 ? ` after the ₹${this.formattedExemption} exemption.` : '.'}`;
    }

// UPDATED: This method now provides a better explanation for the special case
    getZeroTaxReasonText() {
        if (this.isNeutralGain) {
            return 'The transaction resulted in zero gain, so no tax is due.';
        }
        if (this.isLossDueToIndexation) {
            return 'Your nominal gain became a capital loss after applying indexation benefits, which adjusts the purchase price for inflation.';
        }
        // --- THIS IS THE NEW LOGIC FOR CRYPTO LOSS ---
        if (this.isVdaLoss) {
            return "As per Section 115BBH, losses from Virtual Digital Assets (crypto) cannot be offset against any other income or carried forward.";
        }
        if (this.hasCapitalLoss) {
             return 'This loss may be eligible for set-off against other capital gains as per income tax rules.';
        }
        if (this.hasZeroTaxLiability) {
            if (this.exemption > 0 && this.netGain <= this.exemption) {
                return `Your long-term gain is within the ₹${this.formattedExemption} exemption limit.`;
            }
            if (this.taxRate === 0) {
                return 'Your gain falls within the basic tax exemption limit of your income slab.';
            }
            return 'Your capital gain does not result in any tax liability.';
        }
        return null;
    }
}