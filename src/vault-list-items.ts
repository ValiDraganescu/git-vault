import {Option, program} from "commander";
import {getMetadata} from "./service/get-metadata";
import path from "path";
import * as fs from "fs";
import chalk from "chalk";


program
    .addOption(new Option('-w, --workspace <workspace>', 'the name of the workspace'))
    .addOption(new Option('-s, --store <store>', 'the name of the store'))
    .addOption(new Option('-d', 'debug, prints parsed commands'))

program.parse(process.argv);

if (!program.opts().workspace) {
    console.log(chalk.red('workspace is required'));
    process.exit(1);
}

if (!program.opts().store) {
    console.log(chalk.red('store is required'));
    process.exit(1);
}

async function main() {
    const metadata = getMetadata();
    const workspace = program.opts().workspace;
    const store = program.opts().store;

    if (!metadata.rootDir) {
        console.log(chalk.red('rootDir is not defined'));
        process.exit(1);
    }

    const storePath = path.join(metadata.rootDir, workspace, store);
    if (!fs.existsSync(storePath)) {
        console.log(chalk.red(`store ${store} does not exist`));
        process.exit(1);
    }
    const contents = fs.readFileSync(storePath).toString('utf-8');
    if (contents && contents.length) {
        try {
            const data = JSON.parse(contents);
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    console.log(chalk.green(`${key}`));
                }
            }
        } catch (e) {
            console.log(chalk.red(`${storePath} is not a valid JSON file`));
            process.exit(1);
        }
    }
}

main().then();