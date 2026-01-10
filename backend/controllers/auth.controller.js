import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";


export const signup = async (req, res) => {
	try {
		const { fullName, username, password, confirmPassword, gender } = req.body;

		if (password !== confirmPassword) {
			return res.status(400).json({ error: "Las contraseñas no coinciden" });
		}
		const user = await User.findOne({ username });

		if (user) {
			return res.status(400).json({ error: "Nombre de usuario ya existe" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const boyProfilePic = `https://ui-avatars.com/api/?name=${username}&background=random&color=fff`;
		const girlProfilePic = `https://ui-avatars.com/api/?name=${username}&background=random&color=fff`;

		const newUser = new User({
			fullName,
			username,
			password: hashedPassword,
			gender,
			profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
		});

		if (newUser) {

			generateTokenAndSetCookie(newUser._id, res);
			await newUser.save();

			res.status(201).json({
				_id: newUser._id,
				fullName: newUser.fullName,
				username: newUser.username,
				profilePic: newUser.profilePic,
			});
		} else {
			res.status(400).json({ error: "Datos de usuario no válidos" });
		}

	}
	catch (error) {
		console.error("Error durante el inicio de sesión:", error);
		res.status(500).json({ message: "Internal server error" });
	}

};

export const login = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Nombre de usuario o contraseña incorrectos" });
		}
		generateTokenAndSetCookie(user._id, res);

		res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			username: user.username,
			profilePic: user.profilePic,
		});

	} catch (error) {
		console.error("Error durante el inicio de sesión:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const logout = (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Cierre de sesión exitoso" });
	} catch (error) {
		console.error("Error durante el cierre de sesión:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};
