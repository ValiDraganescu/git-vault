import {getMetadata} from "./get-metadata";
import {updateMetadata} from "./update-metadata";
import {LOCK_VAULT_TIMEOUT} from "../constants";
import fs from "fs";

const lockVault = () => {
  const metadata = getMetadata();
  metadata.encryptionKey = undefined;
  metadata.isAutoLockActive = false;
  updateMetadata(metadata);
  fs.appendFileSync('./vault-lock.log', `Vault locked at ${new Date().toISOString()}\n`);
  process.exit(0)
};
fs.appendFileSync('./vault-lock.log', `Vault lock countdown started at ${new Date().toISOString()}\n`);
setTimeout(lockVault, LOCK_VAULT_TIMEOUT);