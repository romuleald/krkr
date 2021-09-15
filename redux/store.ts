import {applyMiddleware, combineReducers, createStore, Middleware, StoreEnhancer} from 'redux';
import {Fetch, reduxAjaxMiddleware, reduxAjaxReducer, reduxAjaxReducerKey} from '@chipp972/redux-ajax';
import {composeWithDevTools} from 'redux-devtools-extension';
import {CRYPTO_STORE, cryptoReducer} from './crypto';

type MakeStoreOptions = { isDebug: boolean; fetchFn: Fetch };

export const appReducers = combineReducers({
    [CRYPTO_STORE]: cryptoReducer,
    [reduxAjaxReducerKey]: reduxAjaxReducer
});

const getStoreEnhancers = ({ isDebug, fetchFn }: MakeStoreOptions): StoreEnhancer => {
    const middlewares: Middleware[] = [reduxAjaxMiddleware({ fetchFn })];

    if (isDebug) {
        return composeWithDevTools(applyMiddleware(...middlewares));
    }

    return applyMiddleware(...middlewares);
};
console.log('lol', reduxAjaxReducerKey)
export const makeStore = (options: MakeStoreOptions) => createStore(appReducers, getStoreEnhancers(options));
