import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['bcryptjs', 'nodemailer', 'pg', '@prisma/adapter-pg'],
};

export default nextConfig;
