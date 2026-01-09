import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});

	res.cookie("jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, // 15 días
		httpOnly: true, // Previene ataques XSS
		sameSite: "none", // ✅ OBLIGATORIO para que funcione entre Azure y Render
		secure: true,     // ✅ OBLIGATORIO (Render usa HTTPS)
	});
};

export default generateTokenAndSetCookie;