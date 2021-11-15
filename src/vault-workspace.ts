import {Option, program} from "commander";
import {getMetadata} from "./service/get-metadata";
import path from "path";
import fs from "fs";
import chalk from "chalk";

program
    .addOption(new Option('-n, --name <name>', 'the name of the workspace'))
    .addOption(new Option('-f, --force', `force the creation of a new workspace
     it deletes the workspace with the same name if it exists`))
    .addOption(new Option('-d', 'debug, prints parsed commands'))

program.parse(process.argv);

if (program.opts().d) {
    console.log(program.opts());
}

if (!program.opts().name) {
    console.error('You must specify a name for the workspace');
    process.exit(1);
}

async function main() {
    const metadata = getMetadata();
    const workspaceName = program.opts().name;
    const force = program.opts().force;

    if (!metadata.rootDir) {
        console.log(chalk.red('No root directory found'));
        return;
    }

    const workspaceDir = path.join(metadata.rootDir, workspaceName);
    const exists = fs.existsSync(workspaceDir);
    if (!exists) {
        fs.mkdirSync(workspaceDir);
    } else if (force) {
        fs.rmSync(workspaceDir, {
            recursive: true
        });
        fs.mkdirSync(workspaceDir);
    } else {
        console.log(chalk.red(`A workspace with the name ${workspaceName} already exists`));
    }
}

main().then()
