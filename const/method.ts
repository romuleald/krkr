export enum PublicMethods {
    Time = 'Time',
    Assets = 'string',
    AssetPairs = 'AssetPairs',
    Ticker = 'Ticker',
    Depth = 'Depth',
    Trades = 'Trades',
    Spread = 'Spread',
    OHLC = 'OHLC'
}

export enum PrivateMethods {
    'Balance' = 'Balance',
    'TradeBalance' = 'TradeBalance',
    'OpenOrders' = 'OpenOrders',
    'ClosedOrders' = 'ClosedOrders',
    'QueryOrders' = 'QueryOrders',
    'TradesHistory' = 'TradesHistory',
    'QueryTrades' = 'QueryTrades',
    'OpenPositions' = 'OpenPositions',
    'Ledgers' = 'Ledgers',
    'QueryLedgers' = 'QueryLedgers',
    'TradeVolume' = 'TradeVolume',
    'AddOrder' = 'AddOrder',
    'CancelOrder' = 'CancelOrder',
    'DepositMethods' = 'DepositMethods',
    'DepositAddresses' = 'DepositAddresses',
    'DepositStatus' = 'DepositStatus',
    'WithdrawInfo' = 'WithdrawInfo',
    'Withdraw' = 'Withdraw',
    'WithdrawStatus' = 'WithdrawStatus',
    'WithdrawCancel' = 'WithdrawCancel',
    'GetWebSocketsToken' = 'GetWebSocketsToken'
}

export type TickerResponse = {
    error: unknown;
    result: {
        [key: string]: {
            a: string[];
            b: string[];
            c: string[];
            v: string[];
            p: string[];
            t: number[];
            l: string[];
            h: string[];
            o: string;

        }
    }
};
