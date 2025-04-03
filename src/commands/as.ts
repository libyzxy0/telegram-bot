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

export async function execute({ api, event, args }) {
    if (event.from.id !== 5544405507) {
        return await api.sendMessage(
            event.chat.id,
            "You don't have permission to use this command!"
        );
    }

    const url = args[0];

    if (!url) {
        return await api.sendMessage(event.chat.id, "Please enter a tiktok url!");
    }

    try {
        const data = await shoti.newShoti({ url });
        
        console.log(data)

        await api.sendMessage(event.chat.id, `${JSON.stringify(data, null, 2) + '\n'}`)
        
    } catch (error) {
        await api.sendMessage(event.chat.id, "Failed!");
        console.log(`Failed:`, error.message);
    }
}
