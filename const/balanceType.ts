export type BalanceResponse = {
    [key: string]: {
        quantity: string;
        lastTrade: string;
        price: number;
    }
};
