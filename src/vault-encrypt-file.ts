import {Option, program} from "commander";
import {getMetadata} from "./service/get-metadata";
import path from "path";
import fs from "fs";
import chalk from "chalk";
import {Encryption} from "./service/encryption";

program
    .addOption(new Option('-n, --name <name>', 'the name of the file'))
    .addOption(new Option('-w, --workspace <workspace>', 'the name of the workspace'))
    .addOption(new Option('-do, --delete-original', 'if set, the original file is deleted'))
    .addOption(new Option('-d', 'debug, prints parsed commands'))

program.parse(process.argv);
const debug = !!program.opts().d;

if (debug) {
    console.log(program.opts());
}

if (!program.opts().name) {
    console.error('You must specify the file name');
    process.exit(1);
}

if (!program.opts().workspace) {
    console.error('You must specify a workspace');
    process.exit(1);
}

async function main() {
    const metadata = getMetadata();
    const workspaceName = program.opts().workspace;
    const fileName = program.opts().name;
    const deleteOriginal = program.opts().deleteOriginal ?? false;

    const encryption = new Encryption();

    if (!metadata.rootDir) {
        console.log(chalk.red('No root directory found'));
        return;
    }

    const file = path.join(metadata.rootDir, workspaceName, fileName);
    const exists = fs.existsSync(file);
    if (!exists) {
        console.log(chalk.red(`File ${file} does not exist`));
        return;
    }
    const input = fs.readFileSync(file, 'utf8');
    const encrypted = encryption.encrypt(input);
    const encryptedFile = path.join(metadata.rootDir, workspaceName, `${fileName}.enc`);
    fs.writeFileSync(encryptedFile, encrypted);
    if (deleteOriginal) {
        fs.rmSync(file);
    }
    console.log(chalk.green(`File ${file} encrypted`));
}

main().then();