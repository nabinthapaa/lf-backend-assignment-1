import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 8000,
  jwt: {
    secret: process.env.JWT_SECRET,
    accessTokenExpiryMS: 30000,
    refreshTokenExpiryMS: 300000,
  },
};

export default config;
