import '../styles/globals.css';
import {Provider} from 'react-redux';
import React from 'react';
import {Case} from 'react-case-when';
import {KrContext} from '../const/context';
import useLocalStorage from 'react-use-localstorage';
import {makeStore} from '../redux/store';

const store = makeStore({fetchFn: (url, param) => fetch(url, param).then(response => response.json()), isDebug: true});

function MyApp({Component, pageProps}) {
    const [secretKey, setSecretKey] = React.useState(null);
    const useSsrLocalStorage = (key, initial) => {
        return typeof window === 'undefined'
            ? [initial, (value) => undefined]
            : useLocalStorage(key, initial);
    };
    const [lcl, setLcl] = useSsrLocalStorage('keyOfTheBar', '');

    const submitCredential = e => {
        // to sanitize
        e.preventDefault();
        const formData = new FormData(e.target);
        let keysOfTheBar = Object.fromEntries(formData);
        setSecretKey(keysOfTheBar);
        setLcl(JSON.stringify(keysOfTheBar));
    };

    const keyOfTheBar = (lcl && JSON.parse(lcl)) || secretKey;

    return <KrContext.Provider value={keyOfTheBar}>
        <Provider store={store}>
            <Case when={keyOfTheBar === null}>
                <form onSubmit={submitCredential}>
                    <p>
                        <label htmlFor="key">key</label>
                        <input required id="key" name="key" type="text"/>
                    </p>
                    <p>
                        <label htmlFor="secret">secret</label>
                        <input required id="secret" name="secret" type="text"/>
                    </p>
                    <input type="submit" value="send"/>
                </form>
            </Case>
            <Case when={keyOfTheBar !== null}>
                <Component {...pageProps} />
            </Case>
        </Provider>
    </KrContext.Provider>;
}

export default MyApp;
