import dotenv from "dotenv"
dotenv.config();

import { destroy, sendMessage } from "./discord";
import { searchFromFollowers } from "./tweets";

const query = "\"かさいくん\" OR \"かさいさん\"";
const followed = "streamwest1629";

searchFromFollowers(query, followed, 1000).then(async (results) => {
    if (results == undefined) {
        console.log("results is undefined (thrown exception?)");
    } else {
        let waiters: Promise<void>[] = [];

        waiters.push(sendMessage(
            "Searched **「" + query + "」** in the **" + followed + "**'s followers\n" +
            "Then, we found `" + results.fromFollowers.length.toString() + "`/`" + results.all.length.toString() + "` tweets"
        ));

        for (const result of results.fromFollowers) {
            const url = "https://twitter.com/" + results.followingUsers[result.author_id == undefined ? "" : result.author_id] + "/status/" + result.id
            waiters.push(sendMessage(url));
        }

        Promise.all(waiters).then(() => {
            destroy();
        });
    }
});
