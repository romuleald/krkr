import '../styles/globals.css';
import {composeWithDevTools} from 'redux-devtools-extension';

import {
    applyMiddleware,
    combineReducers,
    createStore
} from 'redux';
import {reduxAjaxMiddleware, reduxAjaxReducer, DEFAULT_REDUCER_KEY} from '../_packages/react-redux-ajax';
import {Provider} from 'react-redux';
import {CRYPTO_STORE, cryptoReducer} from '../redux/crypto';
import React, {useContext} from 'react';
import {Case} from 'react-case-when';
import {KrContext} from '../const/context';


export const appReducers = combineReducers({
    [CRYPTO_STORE]: cryptoReducer,
    [DEFAULT_REDUCER_KEY]: reduxAjaxReducer
});

const getStoreEnhancers = ({fetchFn}) => {
    const middlewares = [reduxAjaxMiddleware({fetchFn})];
    return applyMiddleware(...middlewares);
};

const composeEnhancers = composeWithDevTools({
    // Specify name here, actionsBlacklist, actionsCreators and other options if needed
});

export const makeStore = (options) => createStore(
    appReducers,
    composeEnhancers(getStoreEnhancers(options))
);

global.store = makeStore({fetchFn: (url, param) => fetch(url, param).then(response => response.json())});

function MyApp({Component, pageProps}) {
    const [secretKey, setSecretKey] = React.useState(null);
    const submitCredential = e => {
        // to sanitize
        e.preventDefault();
        const formData = new FormData(e.target);
        setSecretKey(Object.fromEntries(formData));
    };
    return <KrContext.Provider value={secretKey}>
        <Provider store={store}>
            <Case when={secretKey === null}>
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
            <Case when={secretKey !== null}>
                <Component {...pageProps} />
            </Case>
        </Provider>
    </KrContext.Provider>;
}

export default MyApp;
