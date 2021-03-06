"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Redis = require("ioredis");
const uuid = require("uuid");
const redis_constants_1 = require("./redis.constants");
class RedisClientError extends Error {
}
exports.RedisClientError = RedisClientError;
exports.createClient = () => ({
    provide: redis_constants_1.REDIS_CLIENT,
    useFactory: (options) => {
        const clients = new Map();
        const defaultKey = uuid();
        if (Array.isArray(options)) {
            for (const o of options) {
                if (o.name) {
                    if (clients.has(o.name)) {
                        throw new RedisClientError(`client ${o.name} is exists`);
                    }
                    if (o.url) {
                        clients.set(o.name, new Redis(o.url));
                    }
                    else {
                        clients.set(o.name, new Redis(o));
                    }
                }
                else {
                    if (clients.has(defaultKey)) {
                        throw new RedisClientError('default client is exists');
                    }
                    if (o.url) {
                        clients.set(defaultKey, new Redis(o.url));
                    }
                    else {
                        clients.set(defaultKey, new Redis(o));
                    }
                }
            }
        }
        else {
            if (options.url) {
                clients.set(defaultKey, new Redis(options.url));
            }
            else {
                clients.set(defaultKey, new Redis(options));
            }
        }
        return {
            defaultKey,
            clients,
            size: clients.size,
        };
    },
    inject: [redis_constants_1.REDIS_MODULE_OPTIONS],
});
exports.createAsyncClientOptions = (options) => ({
    provide: redis_constants_1.REDIS_MODULE_OPTIONS,
    useFactory: options.useFactory,
    inject: options.inject,
});
