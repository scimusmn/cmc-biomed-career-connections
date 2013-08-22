#!/usr/bin/env python
"""
Fabric deployment recipes for SMM projects

This can be used for web projects, browser kiosks, custom interactives, etc.

"""

from fabric.api import cd, env, task
from fabric.contrib.files import exists
from fabric.operations import local, require

import_error_msg = """
WARNING: Your application is not ready yet. You need to run

`fab bootstrap`

to get the deploy scripts ready."""

try:
    from fabrelic import newrelic
except ImportError:
    print
    print import_error_msg
    import_error_msg = ''

try:
    import neoprene as drupal
    from neoprene.helper import header
    from neoprene.velour.git import (check_git, sync_local_from_remote,
                                     sync_submodules)
except ImportError:
    if import_error_msg != '':
    print
    print import_error_msg

import config
import os

"""
Base configuration

These elements are common to all SMM web projects
"""
env.deploy_user = config.PROD_DEPLOY_USER
env.hosts = config.PROD_DEPLOY_HOST

# This secret should be defined as an environment variable on the build system
env.new_relic_api_key = os.environ.get('NEW_RELIC_API_KEY')


"""
Environment definition

Where will we be deploying this application?
"""


@task
def production():
    env.settings = 'production'
    env.filebase = config.PROD_FILEBASE
    env.new_relic_app_name = config.NEW_RELIC_APPLICATION_NAME


@task
def staging():
    env.settings = 'staging'
    env.filebase = config.DEV_FILEBASE
    env.new_relic_app_name = config.NEW_RELIC_APPLICATION_NAME_DEV

"""
Bootstrap this template

Get all the parts of this template (and run some checks)
(...coming soon)
"""


@task
def bootstrap():
    """Setup the required submodule for the Fabric scripts to work """
    local('git submodule add git@github.com:scimusmn/fabrelic.git fabfile/fabrelic')
    local('git submodule add git@github.com:scimusmn/neoprene.git fabfile/neoprene')
    sync_submodules()

"""
Branch definition

What branch of the source code will we be deploying?
"""


@task
def master():
    """Work on the master branch """
    env.branch = 'master'


@task
def develop():
    """Work on the develop branch """
    env.branch = 'develop'


@task
def feature(branch_name):
    """Work on a specific feature branch """
    env.branch = branch_name


"""
Deploy
"""


@task
def deploy():
    """Deploys the project site to the webservers """

    require('settings', provided_by=[production, staging])

    print
    print header("Deploying")

    deploy_path = env.filebase + '/' + env.branch
    if exists(deploy_path) and check_git(deploy_path):
        with cd(deploy_path):
            print 'Syncing files'
            sync_local_from_remote('origin', env.branch)
            print 'Syncing submodules'
            sync_submodules()
    else:
        print "There is not a branch with that name"
        exit()

    # On the staging server we need to setup special Apache rules
    if env.settings == 'staging':
        setup_staging(env.branch)

    # After everything is setup, clear the site's cache
    with cd(deploy_path):
        drupal.cache.clear()

    # Tell New Relic about our deploy
    newrelic.report_deploy(env.new_relic_api_key, env.new_relic_app_name)


@task
def setup_staging(branch='develop'):
    """Configure an existing feature branch dev site

    Assuming you've already setup a site at your DEV_FILEBASE with the same
    directory name as your git feature branch. This recipe will modify
    the .htaccess file to get your site working with Apache.

    This recipe only works after you've created the dev site that matches
    this git branch name.

    Agrs:
        branch: The git branch for your dev site.
    """
    print
    print header("Configuring the Drupal Apache settings")
    dev_path = env.filebase + '/' + branch
    rewrite_base = '/%s/%s' % (config.DEV_SUBDIR, branch)
    drupal.files.enable_rewrite_base(dev_path, rewrite_base)
