export NODE_PATH=$1/build-scripts:$1
node $1/build-scripts/scripts/reddit/$2  > ~/logs/$2.log 2>&1