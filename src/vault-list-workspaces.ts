import {Option, program} from "commander";
import {getMetadata} from "./service/get-metadata";
import * as fs from "fs";
import chalk from "chalk";


program
    .addOption(new Option('-d', 'debug, prints parsed commands'))

program.parse(process.argv);

async function main() {
    const metadata = getMetadata();

    if (!metadata.rootDir) {
        console.error('rootDir is not defined');
        process.exit(1);
    }

    const files = fs.readdirSync(metadata.rootDir);
    for (let file of files) {
        console.log(chalk.green(file));
    }
}

main().then();