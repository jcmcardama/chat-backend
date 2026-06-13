import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './config/swagger.json';

import userRoutes from './routes/user.routes';
import groupRoutes from './routes/group.routes';     
import messageRoutes from './routes/message.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/messages', messageRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

export { app };