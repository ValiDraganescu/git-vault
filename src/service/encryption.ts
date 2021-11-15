import * as crypto from 'crypto';
import {getMetadata} from "./get-metadata";
import chalk from "chalk";
// interface IConfig {
//   algorithm?: string;
//   encryptionKey?: string;
//   salt?: string;
//   iv?: Buffer;
// }

export class Encryption {
    private readonly key: string;
    // need to find a better way...
    private iv = Buffer.from('CrSrH3AuCn5U4uBK', 'utf8');
    private readonly algorithm = 'aes-256-ctr';

    constructor() {
        const metadata = getMetadata();
        if (!metadata.encryptionKey) {
            console.log(chalk.red('Vault is locked. Exiting.'));
            process.exit(1);
        }
        this.key = crypto.createHash('sha256')
            .update(String(metadata.encryptionKey))
            .digest('base64')
            .substr(0, 32);
    }

    /**
     * Function to encrypt a string into a url slug
     */
        // https://stackoverflow.com/questions/25710552/node-js-crypto-cipher-decipher-not-working
    encrypt = (value: string, isInt = false): string => {

        // Validate missing value
        if (!value) {
            console.log(chalk.red('A value is required!'));
            return '';
        }

        // Initialize Cipher instance
        const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);

        // Return Buffer as a binary encoded string
        let buffer = Buffer.from(value, 'utf8').toString("binary");

        // Support for small and big integers
        if (isInt) {
            // Set byte auto padding to false
            cipher.setAutoPadding(false);

            // allocate Buffer instance 8 bytes
            const buf = Buffer.allocUnsafe(8);

            // Write value to buf instance at the specified offset as big-endian.
            buf.writeBigUInt64BE(BigInt(value));

            // encode as binary
            buffer = buf.toString("binary");
        }

        // Get encrypted data from the cipher instance
        const firstPart = cipher.update(buffer, "binary", "base64");
        const finalPart = cipher.final("base64")

        // concat and return both parts
        return `${firstPart}${finalPart}`;
    }

    /**
     * Function to decrypt a url token
     */
    decrypt = (token: string, isInt = false): string => {

        // Validate missing token
        if (!token) {
            console.log(chalk.red('A token is required!'));
            return '';
        }

        // Initialize Decipher instance
        const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);

        // Support for small and big integers
        if (isInt) {
            // Set byte auto padding to false
            decipher.setAutoPadding(false);
        }

        // encodes encrypted value from base64 to hex
        const buffer = Buffer.from(token, "base64").toString("hex");

        // Get decrypted data from decipher instance
        const firstPart = decipher.update(buffer, 'hex', 'base64');
        const finalPart = decipher.final('base64') || '';

        // concat both parts
        const decrypted = `${firstPart}${finalPart}`;

        // Encode decrypted value as a 64-bit Buffer
        const buf = Buffer.from(decrypted, "base64");

        // Support for small and big integers
        if (isInt) {
            // Reads an unsigned, big-endian 64-bit integer from buf at the specified offset
            // and returns as a string
            return buf.readBigUInt64BE(0).toString();
        }
        // convert decrypted value from base64 to utf-8 string
        return buf.toString('utf-8');
    }
}
