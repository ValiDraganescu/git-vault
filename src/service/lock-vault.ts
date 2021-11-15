import {getMetadata} from "./get-metadata";
import {updateMetadata} from "./update-metadata";
import {LOCK_VAULT_TIMEOUT} from "../constants";
import fs from "fs";
import chalk from "chalk";
import path from "path";

const metadata = getMetadata();
if (!metadata.rootDir) {
    console.log(chalk.red("Root directory not set"));
    process.exit(1);
}

const logLogPath = path.join(metadata.rootDir, 'vault-lock.log');

const lockVault = () => {
    metadata.encryptionKey = undefined;
    metadata.isAutoLockActive = false;
    updateMetadata(metadata);
    fs.appendFileSync(logLogPath, `Vault locked at ${new Date().toISOString()}\n`);
    process.exit(0)
};
fs.appendFileSync(logLogPath, `Vault lock countdown started at ${new Date().toISOString()}\n`);
setTimeout(lockVault, LOCK_VAULT_TIMEOUT);