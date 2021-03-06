import {Option, program} from "commander";
import {getMetadata} from "./service/get-metadata";
import path from "path";
import fs from "fs";
import chalk from "chalk";
import {Encryption} from "./service/encryption";

program
    .addOption(new Option('-i, --item <name>', 'the name of the store item'))
    .addOption(new Option('-w, --workspace <workspace>', 'the name of the workspace'))
    .addOption(new Option('-s, --store <store>', 'the name of the store'))
    .addOption(new Option('-d', 'debug, prints parsed commands'))

program.parse(process.argv);
const debug = !!program.opts().d;

if (debug) {
    console.log(program.opts());
}

if (!program.opts().item) {
    console.error('You must specify an item name');
    process.exit(1);
}

if (!program.opts().workspace) {
    console.error('You must specify a workspace');
    process.exit(1);
}

if (!program.opts().store) {
    console.error('You must specify a store');
    process.exit(1);
}

async function main() {
    const metadata = getMetadata();
    const storeName = program.opts().store;
    const workspaceName = program.opts().workspace;
    const item = program.opts().item;
    const encryption = new Encryption();

    if (!metadata.rootDir) {
        console.log(chalk.red('No root directory found'));
        return;
    }

    const storeFile = path.join(metadata.rootDir, workspaceName, storeName);
    const exists = fs.existsSync(storeFile);
    if (!exists) {
        console.log(chalk.red(`Store ${storeName} does not exist`));
        return;
    }
    const input = fs.readFileSync(storeFile, 'utf8');
    let contents: any;
    if (input && input.length) {
        try {
            contents = JSON.parse(input);
        } catch (e: any) {
            console.log(chalk.red(`Store ${storeName} is not valid JSON (${e.message})`));
        }
    } else {
        contents = {}
    }

    const value = encryption.decrypt(contents[item]);
    if (!value) {
        console.log(chalk.red(`Item ${item} does not exist in store ${storeName}`));
    }
    console.log(value);
    return;
}

main().then();