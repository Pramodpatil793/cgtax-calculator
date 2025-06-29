import { equityConfig } from './equity';
import { mutualFundsConfig } from './mutualFunds';
import { realEstateConfig } from './realEstate';
import { preciousMetalsConfig } from './preciousMetals';
import { cryptoConfig } from './crypto';

// An object for quick lookup by ID
export const ASSET_CONFIGS = {
    equity: equityConfig,
    mutualfunds: mutualFundsConfig,
    realestate: realEstateConfig,
    preciousmetals: preciousMetalsConfig,
    crypto: cryptoConfig,
};

// An array for easy mapping and rendering
export const ASSET_TYPES_ARRAY = Object.values(ASSET_CONFIGS);