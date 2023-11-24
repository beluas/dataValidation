#!/bin/bash

# Starting the application using xvfb-run and pm2
xvfb-run --server-args="-screen 0 1024x768x24" node server.js