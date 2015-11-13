#!/bin/sh -e

pushd `dirname $0` > /dev/null
SCRIPTPATH=`pwd`
popd > /dev/null

ROOT_DIR=$(cd "$SCRIPTPATH/.."; pwd)
BUILD_DIR=/tmp/kibana-$RANDOM

KIBANA_VERSION="4.2.0"
EXPORT_IMAGE="cogniteev/kibana:$KIBANA_VERSION"

echo "Build kibana"
npm run build

echo "Preparing kibana image build context"
mkdir -p $BUILD_DIR/kibana
cp $ROOT_DIR/scripts/container/* $BUILD_DIR
tar -xzf $ROOT_DIR/target/kibana-$KIBANA_VERSION-linux-x64.tar.gz -C $BUILD_DIR/kibana --strip-components=1

echo "Build kibana image"
docker build -t "$EXPORT_IMAGE" $BUILD_DIR

echo "Cleanup"
rm -rf $BUILD_DIR

echo "Built image $EXPORT_IMAGE"
