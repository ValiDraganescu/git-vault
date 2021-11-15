import {Option, program} from "commander";
import {getMetadata} from "./service/get-metadata";

program
    .addOption(new Option('-d', 'debug, prints parsed commands'));

program.parse(process.argv);
const debug = !!program.opts().d;

if (debug) {
    console.log(program.opts());
}

async function main() {
    const metadata = getMetadata();
    console.log(metadata);
}

main().then();

