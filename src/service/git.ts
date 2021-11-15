import {runSh} from "@xtool/run-sh";
import {getMetadata} from "./get-metadata";
import chalk from "chalk";

export async function gitAddAll() {
    const metadata = getMetadata();
    const rootDir = metadata.rootDir;
    if (!rootDir) {
        console.log(chalk.red("root dir not set, cannot add to git."));
        return;
    }
    try {
        await runSh(`cd ${rootDir} && git add -A`);
        // console.log(chalk.green(result));
    } catch (e: any) {
        console.log(chalk.red(`git add failed: ${e.message}`));
    }

}

export async function gitCommit(message: string) {
    const metadata = getMetadata();
    const rootDir = metadata.rootDir;
    if (!rootDir) {
        console.log(chalk.red("root dir not set, cannot commit."));
        return;
    }
    try {
        await runSh(`cd ${rootDir} && git commit -a -m='${message}'`);
        // console.log(chalk.green(result));
        await runSh(`cd ${rootDir} && git push`);
        // console.log(chalk.green(result));
    } catch (e: any) {
        console.log(chalk.red(`git commit or push failed: ${e.message}`));
    }

}

export async function gitPersist() {
    await gitAddAll();
    await gitCommit('Persisting data');
    console.log(chalk.green('Update persisted.'));
}