import mongoose from "mongoose";
import User, { IUser } from "../models/User";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  throw new Error("MONGO_URI environment variable is not defined");
}

mongoose
  .connect(mongoURI, {})
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ Error connecting to MongoDB:", err);
    process.exit(1);
  });

const users: Partial<IUser>[] = [
  {
    username: "Ben",
    sessionId: "75db916f5cbde618959ebe315e21db40",
    ip: "192.168.1.10",
    email: "contact@valleyheating.ca",
    password: "valleyheating",
  },
];

/**
 * Seeds the User collection with the given users.
 * @async
 * @function seedUsers
 */
async function seedUsers() {
  try {
    console.log("🔄 Seeding users...");
    await User.deleteMany({});
    
    for (const user of users) {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
      await User.create(user);
    }
    
    console.log("✅ Users seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding users:", error);
  } finally {
    mongoose.disconnect();
  }
}

seedUsers();
