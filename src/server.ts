import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chatRoutes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/chat", chatRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
