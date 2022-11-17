echo "*/5 * * * * sh $1/scripts/runPy.sh $1 updatePosts.py"
echo "* * * * * sh $1/scripts/runJs.sh $1 updateSomeComments.js"
echo "3,13,23,33,43,53 * * * * sh $1/scripts/runJs.sh $1 updateSomeAlwaysKeepComments.js"
echo "0 4 * * * sh $1/scripts/runJs.sh $1 cleanDb.js"