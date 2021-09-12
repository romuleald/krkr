import Head from 'next/head';

import {css} from '@emotion/css';
import React from 'react';
import {useSelector, useStore} from 'react-redux';
import clsx from 'clsx';
import {CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from 'recharts';
import {BalanceResponse} from '../../const/balanceType';
import {KrContext} from '../../const/context';
import {useReduxAjax} from '../../_packages/react-redux-ajax';
import {PrivateMethods, PublicMethods} from '../../const/method';
import {FetchMethod} from '../../_packages/redux-ajax';
import {getAssets} from '../../redux/selectors';
import {CryptoProps} from '../../redux/crypto';
import {Header} from '../../Components/Header';
import {useRouter} from 'next/router';

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

type ApiBalance = {
    total: number;
    wallet: BalanceResponse;
};

const ContactFormModule = () => {
    const route = useRouter();

    const fetchAsset = useReduxAjax<ApiBalance>({requestId: PublicMethods.Trades});

    React.useEffect(() => {
        const timedRefresh = () => fetchAsset.submitRequest({
            requestContent: {
                method: FetchMethod.POST,
                url: '/api/hello',
                body: {method: PublicMethods.Trades, pair: 'SCEUR'}
            },
            transformData: JSON.stringify
        })
        const refresh = setInterval(timedRefresh, 10000);
        timedRefresh();
        return () => clearInterval(refresh);
    }, [])

    const crypto = useSelector(getAssets);
    const cryptoList: CryptoProps[] = Object.values(crypto);
    const data = [
        {
            name: 'Page A',
            uv: 4000,
            pv: 2400,
            amt: 2400,
        },
        {
            name: 'Page B',
            uv: 3000,
            pv: 1398,
            amt: 2210,
        },
        {
            name: 'Page C',
            uv: 2000,
            pv: 9800,
            amt: 2290,
        },
        {
            name: 'Page D',
            uv: 2780,
            pv: 3908,
            amt: 2000,
        },
        {
            name: 'Page E',
            uv: 1890,
            pv: 4800,
            amt: 2181,
        },
        {
            name: 'Page F',
            uv: 2390,
            pv: 3800,
            amt: 2500,
        },
        {
            name: 'Page G',
            uv: 3490,
            pv: 4300,
            amt: 2100,
        },
    ];

    const lol = fetchAsset.response?.result['SCEUR'].map(item => ({
        price: item[0],
        volume: item[1],
        time: new Intl.DateTimeFormat('fr-FR', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        }).format(item[2] * 1000),
        buysell: item[3],
        marketlimite: item[4],
        miscellaneous: item[5]
    }))


    return (
        <>
            <div key="ok" className={clsx(cssCarte, {[cssCarteLoading]: fetchAsset.isRequestPending})}>
                <h1>{route.query.asset}</h1>
                <LineChart
                    width={600}
                    height={400}
                    data={lol}
                    margin={{top: 5, right: 20, left: 10, bottom: 5}}
                >
                    <XAxis dataKey="time"/>
                    <YAxis dataKey="price"/>
                    <Tooltip/>
                    <Legend/>
                    {/*<CartesianGrid strokeWidth={1} stroke="#f5f5f5"/>*/}
                    <Line type="monotone" dataKey="price" strokeWidth={1} stroke="#ff7300" yAxisId={0}/>
                    <Line type="monotone" dataKey="time" strokeWidth={1} stroke="#ff7300" yAxisId={0}/>
                </LineChart>

            </div>
        </>
    );
};

export default function Home() {
    return (
        <div>
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
