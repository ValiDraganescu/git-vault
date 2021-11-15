import {Option, program} from "commander";
import {getMetadata} from "./service/get-metadata";
import chalk from "chalk";


program
    .addOption(new Option('-d', 'debug, prints parsed commands'));

async function main() {
    const metadata = getMetadata();
    if (!metadata.encryptionKey) {
        console.log(chalk.red('Vault state is locked'));
        return
    }
    console.log(chalk.green('Vault state is unlocked'));
}

main().then();