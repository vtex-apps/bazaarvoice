#!/bin/bash

vtex publish
curl https://s3-sa-east-1.amazonaws.com/armature-files-production/scripts/armature-deploy-pusher.sh | bash -s -- CyJBzWbhvT__Gp9v
