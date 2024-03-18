import { Response, Request } from "express";
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from "./db/db";
const userRoutes = require("./routes/user.routes");
const taskRoutes = require("./routes/task.routes");

const app = express();
app.use(express.json());
dotenv.config()

const port = process.env.PORT

app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: '*',
    methods: 'GET,POST,PATCH,DELETE'
  })
);

connectDB();

//routes
app.get('/', (req: Request, res: Response) => {
  res.send({ title: 'Express js' })
});

app.use("/user", userRoutes);
app.use("/task", taskRoutes);

app.listen(port, () => {
    console.log(`server running on port ${port}`)
})

module.exports = app;
