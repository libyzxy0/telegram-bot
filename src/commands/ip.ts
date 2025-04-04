import { Config } from "@/types";
import axios from "axios";

export const config: Config = {
    name: "ip",
    description: "Get information of any IP Address.",
    usage: "/ip [query]",
    permission: "normal"
};
function escapeMarkdownV2(text) {
    return text?.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&');
}

export async function execute({ api, event, args }) {
    try {
        const ip = args[0];

        if (!ip)
            return api.sendMessage(
                event.chat.id,
                `⚠️Invalid use of command!\n💡Usage: ${config.usage}`
            );

        const { data } = await axios.get(
            `http://ip-api.com/json/${ip}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query`
        );
        if(data.status === 'fail') return api.sendMessage(event.chat.id, `🔴 Failed to get IP Address Information\n❌ Error: ${data.message}`)

             api.sendMessage(
    event.chat.id,
    `🌍 *IP Address Details* 🌍\n\n
📍 *Continent:* ${escapeMarkdownV2(data.continent)} \\(${escapeMarkdownV2(data.continentCode)}\\)  
🇫🇷 *Country:* ${escapeMarkdownV2(data.country)} \\(${escapeMarkdownV2(data.countryCode)}\\)  
🏛️ *Region:* ${escapeMarkdownV2(data.regionName)} \\(${escapeMarkdownV2(data.region)}\\)  
🌆 *City:* ${escapeMarkdownV2(data.city)}  
📮 *ZIP Code:* ${escapeMarkdownV2(data.zip || "N/A")}  
📍 *District:* ${escapeMarkdownV2(data.district || "N/A")}  
🗺️ *Coordinates:* ${escapeMarkdownV2(`${data.lat}, ${data.lon}`)}  
⏳ *Timezone:* ${escapeMarkdownV2(data.timezone)} \\(UTC ${escapeMarkdownV2(`${data?.offset / 3600}`)}\\)  
💱 *Currency:* ${escapeMarkdownV2(data.currency)}  
🌐 *ISP:* ${escapeMarkdownV2(data.isp)}  
🏢 *Organization:* ${escapeMarkdownV2(data.org)}  
📡 *AS:* ${escapeMarkdownV2(data.as)} \\(${escapeMarkdownV2(data.asname)}\\)  
🔄 *Reverse DNS:* ${escapeMarkdownV2(data.reverse || "N/A")}  
📱 *Mobile Connection:* ${escapeMarkdownV2(data.mobile ? "Yes" : "No")}  
🛡️ *Proxy:* ${escapeMarkdownV2(data.proxy ? "Yes" : "No")}  
🏠 *Hosting:* ${escapeMarkdownV2(data.hosting ? "Yes" : "No")}  
🔍 *Queried IP:* ${escapeMarkdownV2(data.query)}`,
    { parse_mode: "MarkdownV2" }
);

    } catch (error: any) {
        api.sendMessage(
            event.chat.id,
            "Failed to execute command: " + error.message
        );
    }
}
