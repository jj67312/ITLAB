const dotenv = require('dotenv');
dotenv.config();

const DB_URL = process.env.DB_URL;
const PRODUCTS_URL = process.env.PRODUCTS_URL;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const SECRET = process.env.SECRET;
const MOBILE_URL = process.env.MOBILE_URL;
const LAPTOP_URL = process.env.LAPTOP_URL;
const TABLET_URL = process.env.TABLET_URL;
const CAMERA_URL = process.env.CAMERA_URL;
const NEWS_URL = process.env.NEWS_URL;
const NEWS_API_KEY = process.env.NEWS_API_KEY;

module.exports = {
  DB_URL,
  SECRET,
  PRODUCTS_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  MOBILE_URL,
  LAPTOP_URL,
  TABLET_URL,
  CAMERA_URL,
  NEWS_URL,
  NEWS_API_KEY,
};
