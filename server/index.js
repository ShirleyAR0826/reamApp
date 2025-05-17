import express from 'express';
import bodyParser from 'body-parser';
import assetRoutes from './routes/assetRoutes.js';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api/assets', assetRoutes);

app.listen(3001, () => console.log('Server running on http://localhost:3001'));

