import "dotenv/config";
import express, { Request, Response } from 'express';
import cors from "cors";
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerk.js";

const app = express();

// Middleware
app.use(cors())

app.post('/api/clerk' ,  express.raw({ type: 'application/json' }) , clerkWebhooks)

app.use(express.json());
app.use(clerkMiddleware())

const port = process.env.PORT || 5000;



app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
// import "dotenv/config";
// import express, { Request, Response } from 'express';
// import cors from "cors";
// import { clerkMiddleware } from '@clerk/express';
// import clerkWebhooks from "./controllers/clerk.js";

// const app = express();

// app.use(cors({
//   origin: ['https://hm805vp3-5173.inc1.devtunnels.ms', 'http://localhost:5173'],
//   credentials: true
// }));


// app.post('/api/clerk', express.raw({ type: 'application/json' }), clerkWebhooks);


// app.use(express.json());
// app.use(clerkMiddleware());

// const PORT = process.env.PORT || 5000;

// app.get('/', (req: Request, res: Response) => {
//     res.send('Server is Live!');
// });

// app.listen(PORT, () => {
//     console.log(`Server is running at http://localhost:${PORT}`);
// });
