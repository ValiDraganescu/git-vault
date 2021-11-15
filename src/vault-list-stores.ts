import {Option, program} from "commander";
import {getMetadata} from "./service/get-metadata";
import path from "path";
import * as fs from "fs";
import chalk from "chalk";


program
    .addOption(new Option('-w, --workspace <workspace>', 'the name of the workspace'))
    .addOption(new Option('-d', 'debug, prints parsed commands'))

program.parse(process.argv);

if (!program.opts().workspace) {
    console.error('workspace is required');
    process.exit(1);
}

async function main() {
    const metadata = getMetadata();
    const workspaceName = program.opts().workspace;

    if (!metadata.rootDir) {
        console.error('rootDir is not defined');
        process.exit(1);
    }

    const workspacePath = path.join(metadata.rootDir, workspaceName);
    const files = fs.readdirSync(workspacePath);
    for (let file of files) {
        console.log(chalk.green(file));
    }
}

main().then();