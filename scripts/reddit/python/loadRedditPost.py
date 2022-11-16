import json
import sys

from util import getTools, skipIfBusy
from pydb.upsertPost import upsertPost
from updateComments import updateComments

def loadRedditPost(context, redditId):
    (conn, cur, reddit, pushshift) = context
    redditSubmission = reddit.submission(redditId)
    postId = upsertPost(context, redditSubmission)
    updateComments(context, redditSubmission, postId)
    print(json.dumps({"id":postId}))

if __name__ == "__main__":
    skipIfBusy()
    context = getTools()
    loadRedditPost(context, sys.argv[1])
