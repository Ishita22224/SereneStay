import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import usersRoute from "./routes/users.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();

mongoose.set('strictQuery', true);

// MongoDB connection function
const connect = async () => {
	try {
		await mongoose.connect(process.env.MONGO, {
		useNewUrlParser: true,
		useUnifiedTopology: true
		});
		console.log("Connected to MongoDB.");
	} catch (error) {
		console.error("Error connecting to MongoDB:", error);
		// throw error;
	}
};

mongoose.connection.on("disconnected", () => {
	console.log("mongodb disconnected");
});

mongoose.connection.on("connected", () => {
	console.log("mongodb connected");
});

// mmiddlewares
// app.use((req, res, next) => {
// 	console.log("hi I am a middleware");
// 	next();
// });
app.use(express.json()); // directly cannot send, we need this to send api requests
app.use(cookieParser());
app.use(cors())

app.use("/api/auth", authRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);
app.use("/api/users", usersRoute);

app.use((err, req, res, next) => {
	const errorStatus = err.status || 500;
	const errorMessage = err.status || "Something went wrong";
	return res.status(errorStatus).json ({
		success: false,
		status: errorStatus,
		message: errorMessage,
		stack: err.stack,
	})
}); // specific middleware for error handling

app.listen(8800, () =>{
	connect();
  	console.log("connected to backend");
});

