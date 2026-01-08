import mongoose from "mongoose";

const connectToMongoDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_DB_URI);
		console.log("Conectado a MongoDB");
	} catch (error) {
		console.log("Error al conectar con MongoDB", error.message);
	}
};

export default connectToMongoDB;