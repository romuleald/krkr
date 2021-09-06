import {client} from '../../krakanapi/krakanapi';
import {PrivateMethods, PublicMethods} from '../../const/method';
import {actionAdd} from '../../redux/crypto';
import {log} from 'util';
import {BalanceResponse} from '../../const/balanceType';

const cleanNameForDisplay = name => name.replace(/^[XZ]/, '');
const startWithX = name => /^X/.test(name);
const isTradableCrypto = name => /^X[A-Z]*Z[A-Z$]/.test(name);
const isRealMoney = name => /^[Z]/.test(name);
const cleanNameStack = name => name.replace(/\.S/, '');
const hasNameStack = name => /\.S/.test(name);
const cleanNameHold = name => name.replace(/\.HOLD/, '');
const hasNameHold = name => /\.HOLD/.test(name);

const calculatePrice = ({trade, quantity}): number => {
    const lastTradeNumber = Number(trade);
    return isNaN(lastTradeNumber) ? 0 : (lastTradeNumber || 0) * Number(quantity);
};

export default (req, res) => {
    const ctx = JSON.parse(req.headers.ctx);
    const parsedBody = JSON.parse(req.body);
    return client.api({ctx, method: PrivateMethods.Balance}).then(balanceResponse => {
        const allPairs = Object.keys(balanceResponse.result)
            .filter((name) => {
                // const name = crypto.name;
                return !(
                    hasNameHold(name)
                    || hasNameStack(name)
                    || isRealMoney(name))
            })
            .map((name) => {
                const currency = `${isTradableCrypto(name) ? 'Z' : ''}EUR`;
                return `${cleanNameHold(cleanNameStack(cleanNameForDisplay(name)))}${currency}`
            })
            .join(',');

        return client.api({method: PublicMethods.Ticker, params: {pair: allPairs}}).then(tickerResponse => {
            const fullResponse: BalanceResponse = Object.entries(balanceResponse.result).reduce((acc, [name, quantity]) => {
                const cleanedName = cleanNameStack(cleanNameHold(name));
                const currency = `${startWithX(name) ? 'Z' : ''}EUR`;
                const lastTrade = tickerResponse.result[`${cleanedName}${currency}`]?.c[0] || '0';
                acc[cleanedName] = {
                    quantity,
                    lastTrade,
                    price: calculatePrice({trade: lastTrade, quantity})
                };
                return acc;
            }, {});

            const totalPrice = Object.entries(fullResponse).reduce((acc, [name, crypto]) => {
                const cryptoPrice = name.startsWith('Z')
                    ? Number(crypto.quantity)
                    : calculatePrice({trade: crypto.lastTrade, quantity: crypto.quantity});
                return acc + cryptoPrice;
            }, 0)
            return res.status(200).json({wallet: fullResponse, total: totalPrice});
        }).catch(err => {
            return res.status(500).json({error: {message: err.message}});
        });
    }).catch(err => {
        return res.status(500).json({error: {message: err.message}});
    });
};
