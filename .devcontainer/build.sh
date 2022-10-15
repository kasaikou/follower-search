#!/bin/sh

mkdir /tmp/sam-install
cd /tmp/sam-install
wget -qO- https://github.com/aws/aws-sam-cli/releases/latest/download/aws-sam-cli-linux-x86_64.zip | bsdtar -xvf-
chmod +x -R .
sudo ./install
cd ..
rm -rf /tmp/sam-install
