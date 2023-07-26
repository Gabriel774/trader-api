export const jwtConstants = {
  secret: process.env.JWT_SECRET,
};

export const adminPassword = process.env.ADMIN_PASSWORD;

export const supabase_credentials = {
  url: process.env.SUPABASE_URL,
  key: process.env.SUPABASE_KEY,
};

export const mailerActive = process.env.MAILER_ACTIVE;

export const smtp = {
  server: process.env.SMTP_SERVER,
  port: Number(process.env.SMTP_PORT),
  user: process.env.SMTP_USER,
  password: process.env.SMTP_PASSWORD,
};
