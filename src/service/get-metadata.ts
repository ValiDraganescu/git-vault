import {Metadata} from "../model/metadata";
import fs from "fs";
import {METADATA_STORE} from "../constants";
import path from "path";

export function getMetadata(): Metadata {
    const metadataPath = path.join(__dirname, METADATA_STORE);
    if (!fs.existsSync(metadataPath)) {
        fs.writeFileSync(metadataPath, JSON.stringify({}));
    }
    const rawVaultMeta = fs.readFileSync(metadataPath);
    if (rawVaultMeta && rawVaultMeta.length) {
        return JSON.parse(rawVaultMeta.toString('utf-8'))
    }
    return {};
}