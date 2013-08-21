#!/usr/bin/env python

"""
[Project name] project config details

DO NOT STORE SECRETS, PASSWORDS, OR API KEYS IN THIS FILE
"""

"""
PROJECT DETAILS
"""
# Git URL for the code repository tracking this application
REPO_URL = 'git@github.com:scimusmn/example.git'

"""
DEPLOY DETAILS
"""

# Remote username and host combination where you're deploying to
# Staging server details
PROD_DEPLOY_USER = ['deployuser']
PROD_DEPLOY_HOST = ['deployuser@deploy-server.example.org']

#
# Production server details
#
# Full path to the webhosting environment for the website
# Used to find the project root so that we can do file modifications on deploy
PROD_FILEBASE = '/full/production/website/path'
# Base domain only. This should not contain the full website path.
PROD_DOMAIN = 'http://www.example.org'
# Website path excluding the first domain. Leave blank
# if this site is at the root of the domain.
PROD_SUBDIR = 'sub-site'

#
# Same instructions as above, but for the staging or dev site.
#
DEV_FILEBASE = '/full/development/website/path'
DEV_DOMAIN = 'http://dev.example.org'
DEV_SUBDIR = 'sub-site'
DEV_DEPLOY_HOST = ['deployuser@deploy-server.example.org']

# New Relic monitoring details
NEW_RELIC_APPLICATION_NAME = 'example.org'
NEW_RELIC_APPLICATION_NAME_DEV = 'dev.example.org'
