import User from "../models/User.model.js";
import ChatboxCustomisation from "./../models/ChatboxCustomisation.model.js";
export const getChatboxCustomisations = async (req, res) => {
  try {
    const customisations = await ChatboxCustomisation.findOne();
    if (!customisations) {
      const defaultCustomisations = await ChatboxCustomisation.create({});
      return res.status(200).json(defaultCustomisations);
    }
    res.status(200).json(customisations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateChatboxCustomisations = async (req, res) => {
  const { id: userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user || !["member", "admin"].includes(user.role)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const {
      headerColor,
      bgcolor,
      message1,
      message2,
      welcomeMsg,
      missedChatTimer,
    } = req.body;

    let customisations = await ChatboxCustomisation.findOne();
    if (!customisations) {
      customisations = await ChatboxCustomisation.create({});
    }

    if (headerColor !== undefined) customisations.headerColor = headerColor;
    if (bgcolor !== undefined) customisations.bgcolor = bgcolor;
    if (message1 !== undefined) customisations.message1 = message1;
    if (message2 !== undefined) customisations.message2 = message2;
    if (welcomeMsg !== undefined) customisations.welcomeMsg = welcomeMsg;
    if (missedChatTimer !== undefined)
      customisations.missedChatTimer = missedChatTimer;

    

    await customisations.save();
    res.status(200).json({ message: "Customisations updated", customisations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
