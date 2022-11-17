import { updatePosts } from "lib/pythonScript";
import { runOneTask } from "scripts/reddit/util";

async function main() {
    await updatePosts();
}

if (require.main === module) {
    runOneTask('updatePosts', main);
}