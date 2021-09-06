import Head from 'next/head';
import styles from '../styles/Home.module.css';
import React from 'react';
import {Header} from '../Components/Header';
import {storageKey} from '../const/localstorage';
import {useLocalStorage} from '../_packages/react-use-localstorage/react-use-localstorage.esm';

export default function Historic() {
    const useSsrLocalStorage = (key: string, initial: string): [string, React.Dispatch<string>] => {
        // @ts-ignore
        return typeof window === 'undefined'
            ? [initial, (value: string) => undefined]
            : useLocalStorage(key, initial)
    }
    const [lcl, setLcl] = useSsrLocalStorage(storageKey, '[]');

    return (
        <div className={styles.container}>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Header/>
            <main className={styles.main}>
                <table>
                    <tbody>
                    {JSON.parse(lcl).map(([time, total]) =>
                        <tr key={time}>
                            <td>{total}</td>
                            <td>{new Intl.DateTimeFormat('fr-FR', {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                                second: 'numeric'
                            }).format(time)}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </main>
        </div>
    );
}

