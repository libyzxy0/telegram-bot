import { Config } from "@/types";

export const config: Config = {
    name: "example",
    description: "Example command.",
    usage: "/examlpe",
    permission: "normal"
};

export async function execute({ api, event }) {
  /* Code here */
}
