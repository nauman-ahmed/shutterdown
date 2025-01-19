#!/bin/bash

# Install MongoDB tools (mongodump)
apt-get update && apt-get install -y mongodb-org-tools

# Start the app
npm start
