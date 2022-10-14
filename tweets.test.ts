import { searchFromFollowers } from "./tweets"

const query = "\"かさいくん\" OR \"かさいさん\"";
const followed = "streamwest1629";

searchFromFollowers(query, followed, 1000).then((results) => {
    if (results == undefined) {
        console.log("results is undefined (thrown exception?)");
    } else {
        console.log("search 「" + query + "」in the " + followed + "'s followers");
        console.log("found " + results.fromFollowers.length.toString() + "/" + results.all.length.toString() + " tweets");
        console.log("---");
        for (const result of results.fromFollowers) {
            console.log("https://twitter.com/" + results.followingUsers[result.author_id == undefined ? "" : result.author_id] + "/status/" + result.id);
            console.log(result.text);
            console.log("---");
        }
    }
});
