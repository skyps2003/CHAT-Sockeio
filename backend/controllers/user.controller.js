import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;

		const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

		res.status(200).json(filteredUsers);
	} catch (error) {
		console.error("Error en getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Error Interno del Servidor" });
	}
};

export const updateUser = async (req, res) => {
	try {
		const userId = req.user._id;
		const { fullName, username, password, profilePic } = req.body;

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ error: "Usuario no encontrado" });
		}

		if (fullName) user.fullName = fullName;
		if (profilePic) user.profilePic = profilePic;

		if (username && username !== user.username) {
			const existingUser = await User.findOne({ username });
			if (existingUser) {
				return res.status(400).json({ error: "El nombre de usuario ya está en uso" });
			}
			user.username = username;
		}

		if (password) {
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);
		}

		await user.save();

		res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			username: user.username,
			profilePic: user.profilePic,
		});

	} catch (error) {
		console.error("Error en updateUser: ", error.message);
		res.status(500).json({ error: "Error Interno del Servidor" });
	}
};