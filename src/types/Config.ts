export type Config = {
  name: string;
  description: string;
  creator: string;
  usage: string;
  permission: "admin" | "normal";
}