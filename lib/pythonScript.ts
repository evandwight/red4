import { API_COMMENTS, API_POST } from 'lib/api/paths';
import redis from 'lib/redis';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const pExecFile = promisify(execFile);

export async function runPython(scriptName, argv) {
    const {EXEC_PYTHON, ROOT_DIR} = process.env
    if (!EXEC_PYTHON || !ROOT_DIR) throw new Error(`Set environment variables ${JSON.stringify({EXEC_PYTHON, ROOT_DIR})}`);
    let std = await pExecFile(EXEC_PYTHON, [`./scripts/reddit/python/${scriptName}`, ...argv], {cwd: ROOT_DIR});
    return std;
}

export async function loadRedditPost(redditId) {
    const std = await runPython('loadRedditPost.py', [redditId]);
    const json = JSON.parse(std.stdout);
    const id =  json.id as string;
    await redis.del(API_COMMENTS.fullPath({id}));
    await redis.del(API_POST.fullPath({id}));
    return id;
}


export async function updateComments(id) {
    await runPython('updateComments.py', [id]);
    await redis.del(API_COMMENTS.fullPath({id}));
}

export async function updatePosts() {
    return await runPython('updatePosts.py', []);
}