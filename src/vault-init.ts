import {Option, program} from "commander";
import * as bcrypt from 'bcrypt';
import {updateMetadata} from "./service/update-metadata";
import {SALT_ROUNDS} from "./constants";
import chalk from "chalk";


program
    .addOption(new Option('-p, --password <password>', 'the vault password'))
    .addOption(new Option('-r, --rootDir <rootDir>', 'the root directory where the vault will operate'))
    .addOption(new Option('-d', 'debug, prints parsed commands'))

program.parse(process.argv);

if (program.opts().d) {
    console.log(program.opts());
}

if (!program.opts().password) {
    console.error('password is required');
    process.exit(1);
}

if (!program.opts().rootDir) {
    console.error('rootDir is required');
    process.exit(1);
}

async function main() {
    const password = program.opts().password;
    const rootDir = program.opts().rootDir;
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    updateMetadata({
        password: hash,
        rootDir
    });
    console.log(chalk.green('Vault initialized successfully'));
}

main().then();

