import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import v1RouterAuth from './v1/routes/auth.js';
import v1RouterWallet from './v1/routes/wallet.js';
import verifyUserToken from './midlewares/verify_user_token.js';
import { transporter } from './utils/sendEmail.js';
import dotenv from 'dotenv';

dotenv.config();
const mongoString: string = process.env.MONGO_URL || '/';
const app = express();
const PORT = process.env.PORT || 8081;

// verify connection configuration
transporter.verify(function (error) {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

// connect to mongoose
mongoose.connect(mongoString);

const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error);
});

database.once('connected', () => {
  console.log('Database Connected');
});

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// *** call to version 1 routes ***
app.use('/api/v1/auth', v1RouterAuth);
app.use('/api/v1/wallet', verifyUserToken, v1RouterWallet);

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});
