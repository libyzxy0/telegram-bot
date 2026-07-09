import { Config, Execute } from "@/types";

export const config: Config = {
    name: "example",
    description: "Example command.",
    usage: "/examlpe",
    permission: "normal",
    creator: "libyzxy0"
};

export async function execute({ api, event }: Execute) {
   api.sendMessage(event.chat.id, "Hello, its working!");
}
