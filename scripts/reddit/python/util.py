import os

import praw
import psutil
import psycopg2
from dotenv import load_dotenv
from psaw import PushshiftAPI

alwaysKeepSubs = ['animelegwear']


def getTools():
    load_dotenv()
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    reddit = praw.Reddit(
        client_id=os.environ['REDDIT_ID'],
        client_secret=os.environ['REDDIT_SECRET'],
        user_agent="linux:NA:1 (by u/evandwight)",
    )

    pushshift = None# PushshiftAPI()
    return (conn, cur, reddit, pushshift)

def skipIfBusy():
    if psutil.cpu_percent() > 80:
        raise Exception('busy cpu')