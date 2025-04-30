import User from "./../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Team from "../models/Team.models.js";
import InviterMembers from "../models/inviterMembers.model.js";

export const signup = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  try {
    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const existingUser = await User.find({ email });
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const isFirstUser = (await User.countDocuments()) === 0;

    let role = isFirstUser ? "admin" : "member";

    const team = await Team.findOne({ invitedEmails: email });
    if (team) {
      const invitedMember = team.invitedMembers.find(
        (member) => member.email === email
      );

      if (invitedMember && invitedMember.role === "admin") {
        role = "admin";
      }
    }

    let newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role,
    });

    if (isFirstUser) {
      const newTeam = new Team({
        name: `${firstname}'s Team`,
        admin: newUser._id,
        members: [newUser._id],
      });
      await newTeam.save();
      newUser.team = newTeam._id;
    } else {
      const team = await Team.findOne({ invitedEmails: email });
      if (team) {
        const invitedMember = team.invitedMembers.find(
          (member) => member.email === email
        );

        if (invitedMember && invitedMember.role === "admin") {
          const newTeam = new Team({
            name: `${firstname}'s Team`,
            admin: newUser._id,
            members: [newUser._id],
          });
          await newTeam.save();
          newUser.team = newTeam._id;
        } else {
          team.invitedEmails = team.invitedEmails.filter((e) => e !== email);
          team.invitedMembers = team.invitedMembers.filter(
            (member) => member.email !== email
          );
          team.members.push(newUser._id);
          newUser.team = team._id;
          await team.save();
        }
      } else {
        return res.status(400).json({ message: "User does not exist" });
      }
    }
    await InviterMembers.create(newUser);
    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "if you are invited then signup" });
    }

    const isPasswordSame = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordSame) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = await jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    const { password: pass, ...userData } = existingUser._doc;

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
      })
      .json({ message: "Login successful", success: true, user: userData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  res
    .status(200)
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })
    .json({ message: "Logout successful", success: true });
};

export const updateProfile = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  try {
    const isExistingUser = await User.findOne({ email });

    if (!isExistingUser) {
      return res.json(400).json({ message: "user is not existedUser" });
    }
    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      isExistingUser.password = hashedPassword;
    }

    isExistingUser.firstname = firstName || isExistingUser.firstname;
    isExistingUser.lastname = lastName || isExistingUser.lastname;

    await isExistingUser.save();

    if (password) {
      return res
        .status(200)
        .clearCookie("token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
        .json({
          message: "Profile updated successfully. Please log in again.",
          success: true,
        });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};


