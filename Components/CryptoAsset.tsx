import {PublicMethods, TickerResponse} from '../const/method';
import React from 'react';
import {useSelector, useStore} from 'react-redux';
import {RequestMethod, submitRequest} from '@chipp972/redux-ajax';
import {actionAdd, CryptoProps} from '../redux/crypto';
import {getTotal} from '../redux/selectors';
import Link from 'next/link';

type CryptoListProps = {
    cryptoList: CryptoProps[];
};

const cleanNameForDisplay = (name = '') => name.replace(/^[XZ]/, '');
const hasOldName = name => /^[XZ]/.test(name);
const cleanNameStack = (name = '') => name.replace(/\.S/, '');
const cleanNameHold = (name = '') => name.replace(/\.HOLD/, '');

const fetchTrade = ({pair, pairInResult, dispatch, name}) => dispatch(submitRequest({
    requestId: name + PublicMethods.Trades,
    requestContent: {
        method: RequestMethod.post,
        url: '/api/hello',
        body: {
            pair,
            since: (Date.now() / 1000) - (60 * 100),
            method: PublicMethods.Ticker
        },
    },
    transformData: JSON.stringify,
    onRequestSuccess: (response: TickerResponse) => {
        // @ts-ignore
        response && dispatch(actionAdd({
            name,
            hasTrade: true,
            lastTrade: response.result[pairInResult].c[0]
        }))
    },
    onRequestFailure: error => {
        dispatch(actionAdd({name, hasTrade: false}))
    },
    onRequestComplete: () => {
        // Do something
    }
}));

const CryptoAsset = ({name, quantity, price, hasTrade, currency, lastTrade}: CryptoProps) => {
    const {dispatch} = useStore();
    const nameDisplayed = cleanNameForDisplay(cleanNameStack(cleanNameHold(name)))
    const pair = `${nameDisplayed}EUR`;
    const oldCurrencyPattern = hasOldName(name) ? 'Z' : '';
    const pairInResult = `${name}${oldCurrencyPattern}EUR`;
    const url = `/asset/${nameDisplayed}/`;
    return <tr>
        <td>
            <button onClick={() => fetchTrade({pair, pairInResult, dispatch, name})}>up
            </button>
        </td>
        <td><Link href={url}>{nameDisplayed}</Link></td>
        <td>{quantity}</td>
        <td>{hasTrade ? lastTrade : '💥'}</td>
        <td>{currency}</td>
        <td>{price}</td>
    </tr>;
};

export const CryptoAssetsList = ({cryptoList}: CryptoListProps) => {
    const total = useSelector(getTotal);
    return <table>
        <thead>
        <tr>
            <th colSpan={2}>name</th>
            <th>quantity</th>
            <th>value</th>
            <th>currency</th>
            <th>price total ({total})</th>
        </tr>
        </thead>
        <tbody>
        {cryptoList.map((cryptoItem, index) => {
            return cryptoItem.quantity
                ? <CryptoAsset
                    key={index}
                    name={cryptoItem.name}
                    quantity={cryptoItem.quantity}
                    value={cryptoItem.value}
                    lastTrade={cryptoItem.lastTrade}
                    hasTrade={cryptoItem.hasTrade}
                    price={cryptoItem.price}
                    currency={cryptoItem.currency}/>
                : null
        })}
        </tbody>
    </table>;
};
