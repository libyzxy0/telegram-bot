import { Config, Execute } from "@/types";
import "dotenv/config";
import Shoti from "shoti";

export const config: Config = {
    name: "shoti",
    description: "Sends a random tiktok girl videos.",
    usage: "/shoti",
    permission: "normal",
     creator: 'libyzxy0'
};

const shoti = new Shoti(process.env.SHOTI_APIKEY);

export async function execute({ api, event }: Execute) {
    try {
        const result = await shoti.getShoti();
        await api.setMessageReaction(event.chat.id, event.message_id, {
            reaction: [
                {
                    type: "emoji",
                    emoji: "🔥"
                }
            ]
        });
        const { user } = result;
        await api.sendVideo(event.chat.id, result.content, {
            caption: `${user.username}`
        });
    } catch (error: any) {
        api.sendMessage(event.chat.id, "Error: " + error.message);
    }
}