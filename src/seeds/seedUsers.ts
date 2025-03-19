import mongoose from "mongoose";
import User, { IUser } from "../models/User";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  throw new Error("MONGO_URI environment variable is not defined");
}

mongoose.connect(mongoURI, {})
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

const users: Partial<IUser>[] = [
  {
    username: "Ben",
    sessionId: "75db916f5cbde618959ebe315e21db40",
    ip: "192.168.1.10",
    email: "contact@valleyheating.ca",
    password: "valleyheating",
  }
];

async function seedUsers() {
  try {
    await User.deleteMany({});
    await User.insertMany(users);
    console.log("Users seeded successfully");
  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    mongoose.disconnect();
  }
}

seedUsers();