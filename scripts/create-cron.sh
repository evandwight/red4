echo "*/5 * * * * sh $1/scripts/runJs.sh $1 updatePosts.js > ~/logs/updatePosts.log 2>&1" 
echo "* * * * * sh $1/scripts/runJs.sh $1 updateSomeComments.js > ~/logs/updateSomeComments.log 2>&1"  
echo "3,13,23,33,43,53 * * * * sh $1/scripts/runJs.sh $1 updateAlwaysKeepComments.js > ~/logs/updateAlwaysKeepComments.log 2>&1"
echo "0 4 * * * sh $1/scripts/runJs.sh $1 cleanDb.js > ~/logs/cleanDb.log 2>&1"