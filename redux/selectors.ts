import {CRYPTO_STORE} from './crypto';

export const getTotal = state => state[CRYPTO_STORE].total;
export const getAssets = state => state[CRYPTO_STORE].assets;
export const getAsset = (state, asset) => state[CRYPTO_STORE].assets[asset];
