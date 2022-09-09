
# EDUC-CCOF [![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE) [![img](https://img.shields.io/badge/Lifecycle-Stable-97ca00)](https://github.com/bcgov/repomountie/blob/master/doc/lifecycle-badges.md)

![Tests](https://github.com/bcgov/vue-scaffold/workflows/Tests/badge.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/e7f26d580793ba73b7f7/maintainability)](https://codeclimate.com/github/bcgov/vue-scaffold/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/e7f26d580793ba73b7f7/test_coverage)](https://codeclimate.com/github/bcgov/vue-scaffold/test_coverage)

This project contains the frontend for the Child Care Operating Funding Initiative.  It consists of a Vue.js frontend (UI) and a Node.js backend (auth and session management). It will connect to additional backend API's for managing and adjudicating the form submissions.

## Directory Structure

    .github/                   - PR and Issue templates
    app/                       - Application Root
    frontend/                  - Frontend Root
    ├── src/                   - Vue.js frontend web application
    └── tests/                 - Vue.js frontend web application tests
    backend/                   - Backend Node.js Root
    └── src/                   - Node.js backend web application
    └── tests/                 - Node.js backend web application tests
    openshift/                 - OpenShift-deployment and shared pipeline files
    CODE-OF-CONDUCT.md         - Code of Conduct
    COMPLIANCE.yaml            - BCGov PIA/STRA compliance status
    Jenkinsfile                - Top-level Pipeline
    Jenkinsfile.cicd           - Pull-Request Pipeline
    LICENSE                    - License

## Documentation

* [Frontend Readme](frontend/README.md)
* [Backend Readme](backtend/README.md)
* [Openshift Readme](openshift/README.md)
* [Devops Tools Setup](https://github.com/bcgov/nr-showcase-devops-tools)

## Quick Start Dev Guide

You can quickly run this application in production mode after cloning with the following commands (assuming you have already set up local configuration as well). Refer to the [Backend Readme](backend/README.md) and [Frontend Readme](frontend/README.md) for more details.

    cd app
    npm run all:install
    npm run all:build
    npm run serve

## License

    Copyright 2022 Province of British Columbia

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

