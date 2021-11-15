import {Option, program} from "commander";
import {getMetadata} from "./service/get-metadata";
import path from "path";
import fs from "fs";
import chalk from "chalk";

program
    .addOption(new Option('-n, --name <name>', 'the name of the store'))
    .addOption(new Option('-w, --workspace <workspace>', 'the name of the workspace'))
    .addOption(new Option('-f, --force', `force the creation of a new store,
     it deletes the store with the same name if it exists`))
    .addOption(new Option('-d', 'debug, prints parsed commands'))

program.parse(process.argv);
const debug = program.opts().d;

if (debug) {
    console.log(program.opts());
}

if (!program.opts().name) {
    console.error('You must specify a name for the store');
    process.exit(1);
}

if (!program.opts().workspace) {
    console.error('You must specify a workspace');
    process.exit(1);
}

async function main() {
    const metadata = getMetadata();
    const force = program.opts().force;
    const storeName = program.opts().name;
    const workspaceName = program.opts().workspace;

    if (!metadata.rootDir) {
        console.log(chalk.red('No root directory found'));
        return;
    }

    const storeFile = path.join(metadata.rootDir, workspaceName, storeName);
    const exists = fs.existsSync(storeFile);
    if (!exists) {
        console.log(chalk.cyan(`Creating store ${storeFile}`));
        fs.writeFileSync(storeFile, "");
    } else if (force) {
        console.log(chalk.cyan(`Force creating store ${storeFile}`));
        fs.rmSync(storeFile);
        fs.writeFileSync(storeFile, "");
    } else {
        console.log(chalk.red(`A workspace with the name ${workspaceName} already exists`));
    }
}

main().then();