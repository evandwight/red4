import { updatePosts } from "lib/pythonScript";
import { runOneTask } from "scripts/reddit/util";

async function main() {
    const std = await updatePosts();
    console.log(std.stdout);
    console.error(std.stderr);
}

if (require.main === module) {
    runOneTask('updatePosts', main);
}