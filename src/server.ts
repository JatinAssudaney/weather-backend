import express, { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import { WeatherResponse } from "./interfaces";
import rateLimit from "express-rate-limit"; // Import rateLimit

dotenv.config();
const app = express();
const port = 3000;

// Define rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// Apply rate limiting middleware to all requests
app.use(limiter);

app.get("/", (req, res) => {
  res.send("Hello, Express with TypeScript!");
});

// Used for Search Bar and show suggestions
app.get("/location", async (req: Request, res: Response) => {
  const search = req.query["search-term"] as string;
  if (!search) res.status(404).json({ error: "No search term provided" });
  try {
    const response = await axios.get(
      `https://api.weatherapi.com/v1/search.json?key=${process.env.API_KEY}&q=${search}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch location data" });
  }
});

app.get("/weather", async (req: Request, res: Response) => {
  const search = req.query["search-term"] as string;
  if (!search) res.status(404).json({ error: "No search term provided" });
  try {
    const response = (await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=${process.env.API_KEY}&q=${search}`
    )) as { data: WeatherResponse };
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch location data" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
