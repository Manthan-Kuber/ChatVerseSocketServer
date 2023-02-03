import { z, type ZodFormattedError } from "zod";
import dotenv from "dotenv";
dotenv.config();

const envSchema = z.object({
  HTTP_SERVER_PORT: z.string(),
  CLIENT_URL: z.string().url(),
  DATABASE_URL: z.string(),
  NODE_ENV: z.enum(["development", "test", "production"]),
});

const __env = {
  HTTP_SERVER_PORT: process.env.HTTP_SERVER_PORT,
  CLIENT_URL: process.env.CLIENT_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
};

const _env = envSchema.safeParse(__env);

export const formatErrors = (
  errors: ZodFormattedError<Map<string, string>, string>
) =>
  Object.entries(errors)
    .map(([name, value]) => {
      if (value && "_errors" in value)
        return `${name}: ${value._errors.join(", ")}\n`;
    })
    .filter(Boolean);

if (!_env.success) {
  console.error(
    "❌ Invalid environment variables:\n",
    ...formatErrors(_env.error.format())
  );
  throw new Error("Invalid environment variables");
}

export const env = _env.data;
