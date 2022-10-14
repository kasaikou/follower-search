import { TwitterApi, TweetV2, UserV2TimelineResult, TwitterApiRequestError, TweetSearchRecentV2Paginator } from "twitter-api-v2";

const twitterApiBearer = "";
const twClient = new TwitterApi(twitterApiBearer);

async function searchFromFollowers(query: string, followedUserId: string, num_results: number) {

    try {
        const followedUser = await twClient.v2.userByUsername(followedUserId, {
        });
        var followingUsers: { [key: string]: string; } = {};
        var pagenationToken: string | undefined = undefined

        while (true) {
            const followers: UserV2TimelineResult = await twClient.v2.followers(followedUser.data.id, {
                "user.fields": "id,username",
                "max_results": 1000,
                "pagination_token": pagenationToken,
            });
            for (const follower of followers.data) {
                followingUsers[follower.id] = follower.username;
            }

            if (followers.meta.next_token == undefined) {
                break;
            } else {
                pagenationToken = followers.meta.next_token;
            }
        }

        var allTweets: TweetV2[] = [];
        var followersTweets: TweetV2[] = [];
        // var startTime: Date = new Date(Date.now());

        // startTime.setMonth(startTime.getMonth() - 3);
        pagenationToken = undefined;
        for (var readResults = 0; readResults < num_results;) {
            const tweetResults: TweetSearchRecentV2Paginator = await twClient.search(query, {
                "max_results": 100,
                "tweet.fields": "id,text,author_id,created_at",
                "next_token": pagenationToken,
                // "start_time": startTime.toISOString(),
            });

            allTweets.push(...tweetResults.tweets)
            for (const tweet of tweetResults.tweets) {
                if (tweet.author_id == undefined) {
                    throw new Error("Unknown error: This tweet's author_id is undefined");
                }

                if (tweet.author_id in followingUsers) {
                    followersTweets.push(tweet);
                }
            }

            if (tweetResults.meta.next_token == undefined) {
                break;
            } else {
                pagenationToken = tweetResults.meta.next_token;
                readResults += tweetResults.meta.result_count;
            }
        }

        return {
            "all": allTweets,
            "fromFollowers": followersTweets,
            "followingUsers": followingUsers,
        }

    } catch (e) {
        console.error(e);
    }
}

export {
    searchFromFollowers
}
