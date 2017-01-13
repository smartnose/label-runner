#!/bin/bash
cd parsing
sbt test
cd ..
cd server-lite
cd parser-service
sbt test