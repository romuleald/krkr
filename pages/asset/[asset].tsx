import Head from 'next/head';

import {css} from '@emotion/css';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import clsx from 'clsx';
import {Legend, Line, LineChart, Tooltip, XAxis, YAxis} from 'recharts';
import {BalanceResponse} from '../../const/balanceType';
import {useReduxAjax} from '@chipp972/redux-ajax';
import {PublicMethods} from '../../const/method';
import {RequestMethod} from '@chipp972/redux-ajax';
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
const since = (hours = 24) => Date.now() / 1000 - 60 * 60 * hours;

const ContactFormModule = () => {
    const route = useRouter();
    console.log(route.query)
    const fetchAsset = useReduxAjax<ApiBalance>(PublicMethods.Trades);
    const [assetChartData, setAssetChartData] = useState([])
    const [hours, setHours] = useState(24)

    React.useEffect(() => {
        const timedRefresh = () =>
            route.query.asset && fetchAsset.submitRequest({
                requestContent: {
                    method: RequestMethod.post,
                    url: '/api/hello',
                    body: {method: PublicMethods.Trades, pair: `${route.query.asset}EUR`, since: since(hours)}
                },
                transformData: JSON.stringify
            })
        const refresh = setInterval(timedRefresh, 20000);
        timedRefresh();

        return () => clearInterval(refresh);
    }, [route.query.asset, hours])

    React.useLayoutEffect(() => {
        // @ts-ignore
        setAssetChartData(fetchAsset.response?.result?.[`${route.query.asset}EUR`].map(item => ({
            price: item[0],
            volume: item[1],
            time: new Intl.DateTimeFormat('fr-FR', {
                year: '2-digit',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            }).format(item[2] * 1000),
            buysell: item[3],
            marketlimite: item[4],
            miscellaneous: item[5]
        })))

    }, [fetchAsset.response])

    return (
        <>
            <div key="ok" className={clsx(cssCarte, {[cssCarteLoading]: fetchAsset.isRequestPending})}>
                <h1>{route.query.asset}</h1>
                <LineChart
                    width={600}
                    height={400}
                    data={assetChartData}
                    margin={{top: 5, right: 20, left: 10, bottom: 5}}
                >
                    <XAxis dataKey="time"/>
                    <YAxis dataKey="price"/>
                    <Tooltip/>
                    <Legend/>
                    <Line type="monotone" dataKey="price" strokeWidth={1} stroke="#ff7300" yAxisId={0}/>
                    <Line type="monotone" dataKey="time" strokeWidth={1} stroke="#ff7300" yAxisId={0}/>
                </LineChart>
            </div>
            <button onClick={() => setHours(1)}>1h</button>
            <button onClick={() => setHours(4)}>4h</button>
            <button onClick={() => setHours(8)}>8h</button>
            <button onClick={() => setHours(24)}>24h</button>
            <button onClick={() => setHours(24 * 7)}>7j</button>
            <button onClick={() => setHours(24 * 31)}>1m</button>
        </>
    );
};

export default function Asset() {
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
