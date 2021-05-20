#!/bin/bash  

echo Rebuild Docker Image
docker build -t frontend:1.0 .

echo Start Container
docker run --name frontend -d --restart always -p 3000:80/tcp frontend:1.0