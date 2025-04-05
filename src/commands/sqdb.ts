import { Config } from "@/types";
import postgres from "postgres";

export const config: Config = {
    name: "sqdb",
    description: "Example command.",
    usage: "/sqdb [query]",
    permission: "admin"
};

const DB_URI = process.env.POSTGRESSQL_SHOTI;

export async function execute({ api, event, args }) {
    if (args.length === 0)
        return api.sendMessage(
            event.chat.id,
            `⚠️ Invalid use of command!\n💡Usage: ${config.usage}`
        );

    try {
        console.log("Connecting to database...");
        const sql = postgres(DB_URI);
        const query = args.join(" ");
        console.log("Connected!\nExecuting query:", query);

        const result = await sql.unsafe(query);

        console.log("Result:", result);
        await api.sendMessage(
            event.chat.id,
            "*🔥 Database Response 🔥*\n\n```json\n" +
                JSON.stringify(result, null, 2) +
                "\n```",
            {
                parse_mode: "Markdown"
            }
        );
    } catch (error) {
        console.error(error);
        api.sendMessage(event.chat.id, "Failed to execute query: " + error.message);
    }
}
