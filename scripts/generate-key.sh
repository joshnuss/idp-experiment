#!/bin/bash
ssh-keygen -t rsa -P "" -b 4096 -m PEM -f idp.key
ssh-keygen -e -m PEM -f idp.key > idp.key.pub
