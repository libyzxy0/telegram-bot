import { Config } from "@/types";
import "dotenv/config";
import Shoti from "shoti";

const config: Config = {
    name: "ishoti",
    description: "Sends a random tiktok girl images.",
    usage: "/ishoti",
    permission: "normal"
};

const shoti = new Shoti(process.env.SHOTI_APIKEY);

export async function execute({ api, event }) {
    try {
        const result = await shoti.getShoti({
            type: "image"
        });
        await api.setMessageReaction(event.chat.id, event.message_id, {
            reaction: JSON.stringify([
                {
                    type: "emoji",
                    emoji: "🔥"
                }
            ])
        });

        const { user, content } = result;
        const media = content.map(url => {
            return {
                type: "photo",
                media: url,
                caption: `${user.username}`
            };
        });
        await api.sendMediaGroup(event.chat.id, media);
    } catch (error) {
        api.sendMessage(event.chat.id, "Error: " + error.message);
        console.log(error.message);
    }
}
