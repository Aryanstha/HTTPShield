#!/bin/bash
version=1.2.30
docker build . -t devforth/hothost-web:$version
docker push devforth/hothost-web:$version

docker build . -t devforth/hothost-web
docker push devforth/hothot-web