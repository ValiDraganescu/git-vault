# git-vault-manager is a nodejs cli for managing secrets stored on git 
## (partly inspired by last pass and such)

## Work in progress, do not use this to store secrets :)

## Install
```shell
npm i -g git-vault-manager
```
## Usage

```shell
Usage: vault [options] [command]

vault cli for managing secrets

Options:
  -V, --version    output the version number
  -h, --help       display help for command

Commands:
  init|i           initialize vault with a password
  workspace|wp     creates a workspace folder inside the root dir
  create-store|cs  creates a store in a workspace
  add|a            adds an item to a store in a workspace
  get|g            gets an item from a store in a workspace
  encrypt-file|ef  encrypts a file
  decrypt-file|df  decrypts a file
  metadata|m       returns the vault metadata
  unlock|u         unlocks the vault making the decryption possible
  lock|l           locks the vault making the decryption impossible
  state|s          prints the vault state
  help [command]   display help for command
```

### Init the vault
1. First, create a git repo for the fault
2. `cd` to that repo
3. `vault init -p 'strong password' -r $PWD` (this sets the password and the root dir `r` tp the current path)

### To delete a file from git (clean password file for example)
```shell
git filter-branch --index-filter 'rm -f /workspace/store' -- --all
```
# Licence
![License](https://raw.githubusercontent.com/ValiDraganescu/serverless-log-remover/HEAD/eupl.jpg
)

[Distributed under European Union Public License, version 1.2 (EUPL-1.2)](https://opensource.org/licenses/EUPL-1.2)
