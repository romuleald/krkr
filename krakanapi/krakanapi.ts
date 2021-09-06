// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {PrivateMethods, PublicMethods} from '../const/method';

type KrakenToken = {
    key: string;
    secret: string;
};

type Config = {
    url?: string,
    otp?: string,
    version?: number,
    timeout?: number
} & KrakenToken;


const got = require('got');
const crypto = require('crypto');
const qs = require('qs');

// Default options
const defaults = {
    url: 'https://api.kraken.com',
    version: 0,
    timeout: 5000
};

// Create a signature for a request
const getMessageSignature = (path, request, secret, nonce) => {
    const message = qs.stringify(request);
    const secret_buffer = new Buffer(secret, 'base64');
    const hash = new crypto.createHash('sha256');
    const hmac = new crypto.createHmac('sha512', secret_buffer);
    const hash_digest = hash.update(nonce + message).digest('binary');
    const hmac_digest = hmac.update(path + hash_digest, 'binary').digest('base64');

    return hmac_digest;
};

// Send an API request
const rawRequest = async ({url, headers, options, timeout = 5000}) => {
    // Set custom User-Agent string
    headers['User-Agent'] = 'Kraken Javascript API Client';

    const genericOptions = {headers, timeout, ...options};
    console.log({url});
    const {body} = await got(url, genericOptions);
    const response = JSON.parse(body);

    if (response.error && response.error.length) {
        const error = response.error
            .filter((e) => e.startsWith('E'))
            .map((e) => e.substr(1));

        if (!error.length) {
            throw new Error('Kraken API returned an unknown error');
        }

        throw new Error(error.join(', '));
    }

    return response;
};

const KrakenClient = (userConfig?: Config) => {
    const config: Config = {...defaults, ...userConfig};
    const api = ({ctx, method, params = {}}) => {
        if (Object.values(PublicMethods).includes(method)) {
            return publicMethod({method, params});
        } else if (Object.values(PrivateMethods).includes(method)) {
            return privateMethod({ctx, method, params});
        } else {
            throw new Error(method + ' is not a valid API method.');
        }
    }

    const publicMethod = ({method, params}) => {
        params = params || {};

        const options = {
            method: 'GET',
        };

        const urlParams = new URLSearchParams();
        for (const param in params) {
            if (param === 'method') {
                continue;
            }
            urlParams.append(param, params[param]);
        }

        const path = '/' + config.version + '/public/' + method;
        const url = `${config.url}${path}?${urlParams}`;

        return rawRequest({
            url,
            headers: {},
            options,
        });
    }

    const privateMethod = ({ctx, method, params}) => {
        params = params || {};

        const {secret, key} = ctx;
        const path = '/' + config.version + '/private/' + method;
        const url = config.url + path;

        if (!params.nonce) {
            params.nonce = Date.now() * 1000; // spoof microsecond
        }

        if (config.otp !== undefined) {
            params.otp = config.otp;
        }

        const signature = getMessageSignature(
            path,
            params,
            secret,
            params.nonce
        );

        const headers = {
            'API-Key': key,
            'API-Sign': signature
        };

        const options = {
            method: 'POST',
            body: qs.stringify(params)
        };

        return rawRequest({
            url,
            headers,
            options,
        });
    }

    return {
        api
    }
};

export const client = Object.create(KrakenClient());
