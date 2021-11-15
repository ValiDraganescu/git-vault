import {Option, program} from "commander";
import {getMetadata} from "./service/get-metadata";
import * as bcrypt from "bcrypt";
import {updateMetadata} from "./service/update-metadata";
import chalk from "chalk";

program
    .addOption(new Option('-p, --password <password>', 'the vault password'))
    .addOption(new Option('-d', 'debug, prints parsed commands'));

program.parse(process.argv);
const debug = program.opts().d;

if (debug) {
    console.log(program.opts());
}

if (!program.opts().password) {
    console.error('password is required');
    process.exit(1);
}

async function main() {
    const metadata = getMetadata();
    const password = program.opts().password;
    if(!metadata.password) {
        console.error('vault password is not set');
        process.exit(1);
    }
    const isCorrectPassword = await bcrypt.compare(password, metadata.password);
    if (isCorrectPassword) {
        metadata.encryptionKey = password;
        metadata.isAutoLockActive = false;
        updateMetadata(metadata);
    } else {
        console.log(chalk.red('incorrect password'));
        return;
    }
    console.log(chalk.green('vault unlocked'));
}

main().then();