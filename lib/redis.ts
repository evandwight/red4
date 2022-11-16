import { default as Redis } from "ioredis"

let redis: Redis;

if (process.env.NODE_ENV === 'production') {
    redis = new Redis();
} else {
    if (!global.redis) {
        global.redis =  new Redis();
    }
    redis = global.redis;
}

export default redis;
