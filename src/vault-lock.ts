import {Option, program} from "commander";
import {getMetadata} from "./service/get-metadata";
import {updateMetadata} from "./service/update-metadata";
import chalk from "chalk";

program
    .addOption(new Option('-d', 'debug, prints parsed commands'));

program.parse(process.argv);
const debug = program.opts().d;

if (debug) {
    console.log(program.opts());
}

async function main() {
    const metadata = await getMetadata();
    metadata.encryptionKey = undefined;
    metadata.isAutoLockActive = false;
    updateMetadata(metadata);
    console.log(chalk.green('vault locked'));
}

main().then();