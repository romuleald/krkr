import {createReducer} from '@chipp972/redux-helpers';

export const CRYPTO_STORE = 'crypto';
export type CryptoProps = {
    name: string;
    value?: string;
    quantity?: string;
    price?: number;
    currency?: string;
    lastTrade?: string;
    lastRefresh?: number;
    hasTrade?: boolean;
    pairs?: { [key: string]: string };
};

type SetTotalBalance = {
    total: number;
}

export type StateKraKra = {
    assets?: {
        [key: string]: CryptoProps;
    }
} & SetTotalBalance;

enum ReduxActions {
    'cryptoUpdate' = 'cryptoUpdate',
    'setTotal' = 'setTotal'
}

export const actionAdd = (data: CryptoProps) => ({type: ReduxActions.cryptoUpdate, data});
export const actionTotal = (data: SetTotalBalance) => ({type: ReduxActions.setTotal, data});

export const cryptoReducer = createReducer<StateKraKra>(
    {
        [ReduxActions.cryptoUpdate]: (state, data: CryptoProps) => {
            const cryptoName = data.name;
            return {
                ...state,
                assets: {
                    ...state.assets,
                    [cryptoName]: {
                        name: cryptoName || state[cryptoName]?.name,
                        value: data.value || state[cryptoName]?.value,
                        currency: data.currency || state[cryptoName]?.currency,
                        price: data.price || state[cryptoName]?.price,
                        quantity: data.quantity || state[cryptoName]?.quantity,
                        lastTrade: data.lastTrade || state[cryptoName]?.lastTrade,
                        lastRefresh: data.lastRefresh || state[cryptoName]?.lastRefresh,
                        hasTrade: data.hasTrade || state[cryptoName]?.hasTrade,
                        pairs: data.pairs || state[cryptoName]?.pairs
                    }
                }
            }
        },
        [ReduxActions.setTotal]: (state, data: SetTotalBalance) => {
            return {
                ...state,
                total: data.total
            }
        },
    },
    {assets: {}, total: 0}
);
