import dotenv from "dotenv"
dotenv.config();

import { sendMessage } from "./discord"

sendMessage("Hello, world");
