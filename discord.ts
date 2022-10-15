import { Message, Client, User, time, DMChannel } from "discord.js"
import { env } from "process"
import { sleepSecs } from "twitter-api-v2/dist/v1/media-helpers.v1";

const client = new Client({ "intents": ["Guilds"] });
var dm: DMChannel | undefined = undefined

client.once("ready", async (client) => {
    console.log("Ready for send to discord");
    if (env.DISCORD_MASTER_ID == undefined) {
        console.log("DISCORD_MASTER_ID environment is required, but it was not set");
        return;
    } else {
        dm = await client.users.createDM(env.DISCORD_MASTER_ID);
        if (dm == undefined) {
            console.log("Failed set master user: " + env.DISCORD_MASTER_ID);
        }
    }
});

async function sendMessage(msg: string) {
    if (dm == undefined) {
        await sleepSecs(2);
    }
    if (dm == undefined) {
        console.log("user is undefined");
    } else {
        dm.send({
            "content": msg,
        });
    }
}

function destroy() {
    client.destroy();
}

export {
    sendMessage,
    destroy
};


if (env.DISCORD_TOKEN == undefined) {
    console.log("DISCORD_TOKEN environment is required, but it was not set");
} else {
    client.login(env.DISCORD_TOKEN);
}
