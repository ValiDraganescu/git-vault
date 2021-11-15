#!/usr/bin/env node
import {program} from "commander";
import {fork} from "child_process";
import path from "path";
import {getMetadata} from "./service/get-metadata";
import {updateMetadata} from "./service/update-metadata";

// clear();
// console.log(
//     chalk.red(
//         figlet.textSync('vault-cli', {horizontalLayout: 'full'})
//     )
// );
const metadata = getMetadata();
// console.log(metadata);
if (!metadata.isAutoLockActive) {
    metadata.isAutoLockActive = true;
    updateMetadata(metadata);
    fork(path.join(__dirname, '/service/lock-vault.js'));
}


program
    .version('1.4.0')
    .description("vault cli for managing secrets")
    .command('init', 'initialize vault with a password').alias('i')
    .command('workspace', 'creates a workspace folder inside the root dir').alias('wp')
    .command('create-store', 'creates a store in a workspace').alias('cs')
    .command('add', 'adds an item to a store in a workspace').alias('a')
    .command('get', 'gets an item from a store in a workspace').alias('g')
    .command('encrypt-file', 'encrypts a file').alias('ef')
    .command('decrypt-file', 'decrypts a file').alias('df')
    .command('metadata', 'returns the vault metadata').alias('m')
    .command('unlock', 'unlocks the vault making the decryption possible').alias('u')
    .command('lock', 'locks the vault making the decryption impossible').alias('l')
    .command('state', 'prints the vault state').alias('s')
    .command('list-stores', 'lists all the stores in a workspace').alias('lss')
    .command('list-items', 'lists all the items in a store').alias('lsi')
    .command('list-workspaces', 'lists all the workspaces').alias('lsw')

program.parse(process.argv);