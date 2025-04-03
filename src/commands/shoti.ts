import { Config } from "@/types";
import "dotenv/config";
import Shoti from "shoti";

const config: Config = {
    name: "shoti",
    description: "Sends a random tiktok girl videos.",
    usage: "/shoti",
    permission: "normal"
};

const shoti = new Shoti(process.env.SHOTI_APIKEY);

export async function execute({ api, event }) {
    try {
        const result = await shoti.getShoti();
        await api.setMessageReaction(event.chat.id, event.message_id, {
            reaction: JSON.stringify([
                {
                    type: "emoji",
                    emoji: "🔥"
                }
            ])
        });
        const { user } = result;
        await api.sendVideo(event.chat.id, result.content, {
            caption: `${user.username}`
        });
    } catch (error: any) {
        api.sendMessage(event.chat.id, "Error: " + error.message);
    }
}
