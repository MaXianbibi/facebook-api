#!/bin/bash

#Requête HTTP
curl -X POST -H "Content-Type: application/json" -d '{"key": "96a0378cc7227e65dc344a7edb016d61380fbe5c4775f3f21028dbaf273ae644"}' http://localhost:3001/api/cron-job

echo ""