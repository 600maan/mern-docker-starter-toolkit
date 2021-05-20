#!/bin/bash  

echo Rebuild Docker Image
docker build -t backend:1.0 .

echo Start Container
docker run --name backend -d --restart always  -p 5000:5000/tcp backend:1.0