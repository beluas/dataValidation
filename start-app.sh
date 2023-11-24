#!/bin/bash

# Starting the application using xvfb-run and pm2
xvfb-run --server-num=100 --server-args="-screen 0 1024x768x24" node server.js
