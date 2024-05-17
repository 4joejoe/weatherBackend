import rateLimit from "express-rate-limit";

// Enable rate limiting
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 50,
  message: "Too many requests from this IP, please try again after 5 minutes"
});

export { limiter }

