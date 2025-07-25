import { NextFunction, Request, Response } from "express";
import { Resource } from "sst";

export function apiKeyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiKey = req.header("x-api-key");

  const validApiKey = Resource.API_KEY.value;

  if (!apiKey) {
    return res.status(401).json({ error: "API key missing" });
  }

  if (apiKey !== validApiKey) {
    return res.status(403).json({ error: "Invalid API key" });
  }

  next();
}
