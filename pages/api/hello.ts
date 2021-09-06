import {client} from '../../krakanapi/krakanapi';


export default (req, res) => {
    const parsedBody = JSON.parse(req.body);
    return client.api({method: parsedBody.method, params: {...parsedBody}}).then(fetchRes => {
        return res.status(200).json(fetchRes);
    }).catch(err => {
        return res.status(500).json({error: {message: err.message}});
    });
};
