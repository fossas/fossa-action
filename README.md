# FOSSA Action
[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B1%2Fgithub.com%2Ffossas%2Ffossa-action.svg?type=shield)](https://app.fossa.com/projects/custom%2B1%2Fgithub.com%2Ffossas%2Ffossa-action?ref=badge_shield)
[![FOSSA Action](https://github.com/fossas/fossa-action/actions/workflows/test.yml/badge.svg)](https://github.com/fossas/fossa-action/actions/)

Find license compliance and security issues in your applications with [FOSSA](https://fossa.com) in Github Actions, using latest FOSSA CLI.

## About FOSSA
* Developer focused open source license and security compliance
* The most in-depth and insightful visibility into your third-party dependencies.
* Secure your open source code with accurate vulnerability detection and continuous integration

## About FOSSA Action
FOSSA Action provides an easy to use entry point to using FOSSA in your github workflow. This github action will run FOSSA CLI in your github workflows with, at minimum, an API key. Below you can find [input documentation](#inputs) and [examples](#examples).

FOSSA Action will run on any linux runner or on a MacOS runner. **Note**: In order to use container scanning, a running docker daemon is required - unfortunately Github's MacOS runner does not provide docker.

Windows is not currently supported.

### Versioning
Please note: Versioning of this action does not correspond to the version of FOSSA CLI. This Action will always use the latest version of FOSSA CLI found [here](https://github.com/fossas/fossa-cli/releases).

## Inputs

### `api-key`
**Required** Your FOSSA API key
Example
```yml
jobs:
  fossa-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: fossas/fossa-action@main # Use a specific version if locking is preferred
        with:
          api-key: ${{secrets.fossaApiKey}}
```

### `run-tests`
**Optional** If set to `true` FOSSA will run the `fossa test` command.

If not set or set to `false` FOSSA will run normal scan behavior. In order to run tests, a scan must first be completed.
Example
```yml
jobs:
  fossa-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: fossas/fossa-action@main # Use a specific version if locking is preferred
        with:
          api-key: ${{secrets.fossaApiKey}}
          run-tests: true
```

### `container`
**Optional** A container name or OCI image path.  Set to use FOSSA's container scanning functionality. This will run `fossa container analyze` (default behavior) and `fossa container test` (if used in combination with `run-tests`).

If not set FOSSA will run normal scan behavior.
Example
```yml
jobs:
  fossa-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: fossas/fossa-action@main # Use a specific version if locking is preferred
        with:
          api-key: ${{secrets.fossaApiKey}}
          container: ubuntu:20.04
```

### `branch`

**Optional** Branch passed to FOSSA CLI.

Example
```yml
jobs:
  fossa-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: fossas/fossa-action@main # Use a specific version if locking is preferred
        with:
          api-key: ${{secrets.fossaApiKey}}
          endpoint: some-feature-branch
```

### `endpoint`

**Optional** Endpoint passed to FOSSA CLI. Defaults to `app.fossa.com`. [Read more](https://github.com/fossas/spectrometer/blob/master/docs/userguide.md#common-fossa-project-flags).

Example
```yml
jobs:
  fossa-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: fossas/fossa-action@main # Use a specific version if locking is preferred
        with:
          api-key: ${{secrets.fossaApiKey}}
          endpoint: fossa.my-company.com
```

## Examples
We've provided a few examples of how to use FOSSA's Github Action in your own project. These examples use an API key stored as a Github secret environment variable `fossaAPiKey`.

### Running a scan
This runs a basic FOSSA scan using FOSSA CLI on a your checked out project.

```yml
jobs:
  fossa-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: fossas/fossa-action@main # Use a specific version if locking is preferred
        with:
          api-key: ${{secrets.fossaApiKey}}
```

### Running tests
This run `fossa tests` after doing an initial scan.

```yml
jobs:
  fossa-scan:
    runs-on: ubuntu-latest
    steps:
      - name: "Checkout Code"
        uses: actions/checkout@v2

      - name: "Run FOSSA Scan"
        uses: fossas/fossa-action@main # Use a specific version if locking is preferred
        with:
          api-key: ${{secrets.fossaApiKey}}

      - name: "Run FOSSA Test"
        uses: fossas/fossa-action@main # Use a specific version if locking is preferred
        with:
          api-key: ${{secrets.fossaApiKey}}
          run-tests: true
```

### Running Container Scanning
Running container scanning is extremely similar to running FOSSA with a traditional project. This example runs a scan then runs tests. `ubuntu:20.14` can be replaced with your newly build docker or OCI image.

```yml
jobs:
  fossa-scan:
    runs-on: ubuntu-latest
    steps:
      - name: "Checkout Code"
        uses: actions/checkout@v2

      - name: "Run FOSSA Scan"
        uses: fossas/fossa-action@main # Use a specific version if locking is preferred
        with:
          api-key: ${{secrets.fossaApiKey}}
          container: ubuntu:20.04

      - name: "Run FOSSA Test"
        uses: fossas/fossa-action@main # Use a specific version if locking is preferred
        with:
          api-key: ${{secrets.fossaApiKey}}
          container: ubuntu:20.04
          run-tests: true
```
