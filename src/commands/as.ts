import { Config } from "@/types";
import "dotenv/config";
import Shoti from "shoti";

export const config: Config = {
    name: "as",
    description: "Adds shoti collection to the database.",
    usage: "/as [url]",
    permission: "admin"
};

const shoti = new Shoti(process.env.SHOTI_APIKEY);

export async function execute({ api, event, args }) {
    const url = args[0];

    if (!url) {
        return await api.sendMessage(event.chat.id, "⚠️Invalid use of command!\n💡Usage: " + config.usage);
    }

    try {
        const data = await shoti.newShoti({ url });
        
        console.log(data)

        await api.sendMessage(event.chat.id, "*API Response*\n\n```json\n" + `${JSON.stringify(data, null, 2) + '\n'}` + "\n```", {
          parse_mode: "Markdown"
        })
        
    } catch (error) {
        await api.sendMessage(event.chat.id, "Failed!");
        console.log(`Failed:`, error.message);
    }
}
