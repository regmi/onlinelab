#!/bin/bash
export PYTHONPATH="."
export DJANGO_SETTINGS_MODULE="frontend._settings"
django-admin.py test --pythonpath="codenode" --exclude="twisted" $@
