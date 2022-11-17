import redis from 'lib/redis';

export const alwaysKeepSubs = ['animelegwear'];

export const hoursAgo = (hours) => new Date(Date.now() - hours * 60 * 60 * 1000);

export async function runOneTask(key, func) {
    try {
        const ret = await redis.set(key, 1, "EX", 600, "NX");
        if (ret == "OK") {
            try {
                await func();
            } finally {
                await redis.del(key);
            }
        } else {
            console.log(`cannot acquire lock to run ${key}`);
        }
    } finally {
        redis.disconnect();
    }
}