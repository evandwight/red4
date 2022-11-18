export NODE_PATH=$1/build-scripts:$1
export $(grep -v '^#' $1/.env | xargs)
node $1/build-scripts/scripts/reddit/$2 & echo "success"