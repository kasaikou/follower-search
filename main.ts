import { env } from "process";
import dotenv from "dotenv"
dotenv.config();

import { destroy, sendMessage } from "./discord";
import { searchFromFollowers } from "./tweets";
import { OperationCanceledException } from "typescript";

const launch = async () => {
    if (env.SEARCH_QUERY == undefined) {
        console.log("SEARCH_QUERY environment variable is required, but it was not set");
        throw new OperationCanceledException();
    }

    if (env.SEARCH_FOLLOWED_USER == undefined) {
        console.log("SEARCH_FOLLOWED_USER environment variable is required, but it was not set");
        throw new OperationCanceledException();
    }

    const query = env.SEARCH_QUERY;
    const followed = env.SEARCH_FOLLOWED_USER;

    await searchFromFollowers(query, followed, 1000).then(async (results) => {
        if (results == undefined) {
            console.log("results is undefined (thrown exception?)");
            return;
        } else {
            await sendMessage(
                "Searched **「" + query + "」** in the **" + followed + "**'s followers\n" +
                "Then, we found `" + results.fromFollowers.length.toString() + "`/`" + results.all.length.toString() + "` tweets"
            );

            for (const result of results.fromFollowers) {
                const url = "https://twitter.com/" + results.followingUsers[result.author_id == undefined ? "" : result.author_id] + "/status/" + result.id
                await sendMessage(url);
            }
        }
    });
}

launch().finally(() => {
    destroy();
})