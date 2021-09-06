import Head from 'next/head'
import styles from '../styles/Home.module.css'

import {css} from '@emotion/css';
import {useEffect, useState} from "react";
import {CircularProgress} from '@material-ui/core';
import {Header} from "../Components/Header.tsx";

const multiplier = 0.8;

export const getSpacing = (...sizes) =>
    sizes.map(size => `${(size * multiplier).toFixed(1)}rem`).join(' ');


const cssCarte = css`
    box-shadow: 0 0 ${getSpacing(1)} rgb(0 0 0 / 10%);
    cursor: pointer;
    outline: 1px solid #ccc;
    position: relative;
    min-height: 50px;
    padding: ${getSpacing(1, 0, 1)} calc(40px + ${getSpacing(6)});

        display: flex;
        flex-flow: column;
        flex-wrap: wrap;
        max-width: 410px;
        min-width: 250px;
        flex: 0 1 calc(100% / 3);
        padding: 0;

`;


const ContactFormModule = ({id}) => {
    return (
        <>
            <div className={cssCarte}>
                <h1>🥳 Titre</h1>
                <p>Sous titre</p>
                <p>Baudouin Prot, né le 24 mai 1951 à Paris, est un dirigeant de banque et haut fonctionnaire français.</p>
            </div>
        </>
    );
};

export default function Home() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), Math.random() * 10000)
    }, []);

    return (
        <div className={styles.container}>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Header />
            <main className={styles.main}>
                {!loading
                    ? new Array(14)
                    .fill(0)
                    .map((o, i) =>
                        <ContactFormModule key={i} id={i}/>)
                : <CircularProgress />}
            </main>
        </div>
    )
}
