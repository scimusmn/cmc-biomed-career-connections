#!/usr/bin/env python
"""
Template for SMM applications

This can be used for web projects, browser kiosks, custom interactives, etc.

"""

from fabric.api import *
from fabric.contrib.console import confirm

import app_config

env.repo_name = app_config.REPOSITORY_NAME


def _header(txt):
    wrapper = "------------------------------------------------------"
    return wrapper + "\n" + txt + "\n" + wrapper


@task
def hello_run():
    """
    Remote hello world for troubleshooting
    """
    run("echo \"Hello World\"")


@task
def app_details():
    """
    Print the project details
    """
    print _header("Repo name: " + env.repo_name)
