import NodeCache from 'node-cache';

const cache = new NodeCache();

const cacheMiddleware = (duration) => {
    return (req, res, next) => {
        const key = '__express__' + req.originalUrl || req.url;
        const cachedBody = cache.get(key);

        if (cachedBody) {
            res.send(cachedBody);
            return;
        } else {
            res.sendResponse = res.send;
            res.send = (body) => {
                cache.set(key, body, duration);
                res.sendResponse(body);
            };
            next();
        }
    };
};

export {cacheMiddleware};