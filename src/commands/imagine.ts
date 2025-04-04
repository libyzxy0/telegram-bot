import { Config } from "@/types";
import axios from "axios";

export const config: Config = {
    name: "imagine",
    description:
        "Imagine any iamge you think and it will generate automatically.",
    usage: "/imagine [prompt]",
    permission: "normal"
};

export async function execute({ api, event, args }) {
    try {
        if (!args.length === 0)
            return api.sendMessage(
                event.chat.id,
                `⚠️Invalid use of command!\n💡Usage: ${config.usage}`
            );
        const { data } = await axios.get(
            `https://text-to-img.apis-bj-devs.workers.dev/?prompt=${encodeURIComponent(
                args.join(" ")
            )}`
        );
        if(data.status !== "success") return api.sendMessage(event.chat.id, "Failed to generate that imaginationm")
        
        const photos = data.result.map(url => {
          return {
            type: 'photo',
            media: url,
            caption: args.join(" ")
          }
        })
        await api.sendMediaGroup(event.chat.id, photos)
    } catch (error) {
        console.log(error.message);
        api.sendMessage(event.chat.id, `Error: ${error.message}`);
    }
}
