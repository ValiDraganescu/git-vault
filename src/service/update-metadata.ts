import {Metadata} from "../model/metadata";
import fs from "fs";
import {METADATA_STORE} from "../constants";
import {getMetadata} from "./get-metadata";
import path from "path";

export function updateMetadata(newMetadata: Metadata) {
    let oldMetadata = getMetadata();
    oldMetadata = {
        ...oldMetadata,
        ...newMetadata
    };
    fs.writeFileSync(path.join(__dirname, METADATA_STORE), JSON.stringify(oldMetadata));
}