import {Case} from 'react-case-when'
import {CircularProgress} from '@material-ui/core'

import Head from 'next/head';
import styles from '../styles/Home.module.css';

import {css} from '@emotion/css';
import {FetchMethod, useReduxAjax} from '../_packages/react-redux-ajax';
import React from 'react';
import {Header} from '../Components/Header';
import {PrivateMethods} from '../const/method';
import {CryptoAssetsList} from '../Components/CryptoAsset';
import {useSelector, useStore} from 'react-redux';
import {actionAdd, actionTotal, CryptoProps} from '../redux/crypto';
import {BalanceResponse} from '../const/balanceType';
import {storageKey} from '../const/localstorage';
import {getAssets} from '../redux/selectors';
import clsx from 'clsx';
import {KrContext} from '../const/context';

const multiplier = 0.8;

export const getSpacing = (...sizes) =>
    sizes.map(size => `${(size * multiplier).toFixed(1)}rem`).join(' ');

const cssCarte = css`
    box-shadow: 0 0 ${getSpacing(1)} rgb(0 0 0 / 10%);
    cursor: pointer;
    outline: 1px solid #ccc;
    position: relative;
    min-height: 100px;
    display: flex;
    flex-flow: column;
    flex-wrap: wrap;
    max-width: 610px;
    min-width: 250px;
    flex: 0 1 calc(100% / 3);
    padding: 0;
    transition: 250ms;
`;

const cssCarteLoading = css`
    filter: grayscale(1) blur(2px);
`;
const cssLoader = css`
    align-self: center;
    justify-self: center;
`;

type ApiBalance = {
    total: number;
    wallet: BalanceResponse;
};

const ContactFormModule = () => {
    const {dispatch} = useStore();

    const ctx = React.useContext(KrContext);
    React.useEffect(() => {
        // dispatch(submitRequest({
        //     requestId: PublicMethods.AssetPairs,
        //     requestContent: {
        //         method: FetchMethod.POST,
        //         url: '/api/hello',
        //         body: {
        //             method: PublicMethods.AssetPairs
        //         },
        //     },
        //     transformData: JSON.stringify,
        //     onRequestSuccess: (response: TickerResponse) => {
        //         console.log(PublicMethods.AssetPairs, response);
        //         // @ts-ignore
        //         if (response) {
        //             const allPairsInfo = Object.entries(response.result).reduce((acc, [name, pairInfo]) => {
        //                 acc[pairInfo.base] = [...acc[pairInfo.base] || [], name];
        //                 return acc;
        //             }, {});
        //             Object.entries(allPairsInfo).forEach(([name, pairInfos]) =>
        //                 dispatch(actionAdd({
        //                     name,
        //                     pairs: pairInfos.reduce((acc, currPairInfo) => {
        //                         acc[currPairInfo.replace(name, '')] = currPairInfo;
        //                         return acc;
        //                     }, {})
        //                 })));
        //         }
        //     },
        //     onRequestFailure: error => {
        //         console.log(PublicMethods.AssetPairs, {error})
        //     },
        //     onRequestComplete: () => {
        //         // Do something
        //         console.log('complete')
        //     }
        // }))
    }, []);

    const fetchBalance = useReduxAjax<ApiBalance>({requestId: PrivateMethods.Balance});

    React.useEffect(() => {
        if (fetchBalance.response) {
            Object.entries(fetchBalance.response.wallet)
                .forEach(([name, {quantity, price, lastTrade}]) => {
                    dispatch(actionAdd({name, quantity, price, lastTrade}))
                });
            const total = fetchBalance.response.total;
            dispatch(actionTotal({total: total}))
            const currentLocalStorage = JSON.parse(localStorage.getItem(storageKey)) || [];
            localStorage.setItem(storageKey, JSON.stringify([...currentLocalStorage, [Date.now(), total]]))
        }

    }, [fetchBalance.isRequestSuccessful]);

    React.useEffect(() => {
        const timedRefresh = () => fetchBalance.submitRequest({
            requestContent: {
                method: FetchMethod.POST,
                url: '/api/balance',
                body: {method: PrivateMethods.Balance},
                headers: {ctx: JSON.stringify(ctx)}
            },
            transformData: JSON.stringify
        })
        const refresh = setInterval(timedRefresh, 10000);
        timedRefresh();
        return () => clearInterval(refresh);
    }, [])

    const crypto = useSelector(getAssets);
    const cryptoList: CryptoProps[] = Object.values(crypto);
    return (
        <>
            <div key="ok" className={clsx(cssCarte, {[cssCarteLoading]: fetchBalance.isRequestPending})}>
                <CryptoAssetsList cryptoList={cryptoList}/>
                <Case when={cryptoList.length <= 0}>
                    <CircularProgress className={cssLoader}/>
                </Case>
                <Case when={fetchBalance.isRequestFailed}>
                    ☠️
                </Case>
            </div>
        </>
    );
};

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Header/>
            <main>
                <ContactFormModule/>
            </main>
        </div>
    );
}
