const Shoti = require('shoti');

module.exports.config = {
  name: "shoti",
  version: "1.0.0",
  author: "libyzyx0",
  description: "generate a video from tiktok.",
  category: "just for fun",
  admin: false,
  usages: "[]",
  usePrefix: false,
  cooldowns: 5
};

const shoti = new Shoti("$shoti-b8b9880548");

module.exports.run = async function ( {
  event
}) {
  const {
    id: senderID
  } = event.sender || "";
  try {
    await api.sendMessage(`Downloading...`, senderID);

    const result = await shoti.getShoti();

    console.log(result);
    const {
      user
    } = result;

    if (result.content) {
      await api.graph({
        recipient: {
          id: senderID
        },
        message: {
          attachment: {
            type: "video",
            payload: {
              url: result.content,
              is_reusable: true,
            },
          },
        },
      });
    } else {
      await api.sendMessage("Error while getting your server.", senderID);
    }
  } catch (error) {
    console.error(error);
    await api.sendMessage(
      error.message,
      senderID,
    );
  }
};