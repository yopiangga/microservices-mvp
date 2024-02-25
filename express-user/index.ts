import express, { Application, Response, Request, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import helmet from "helmet";

const app = express();
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const prisma = new PrismaClient();

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get("/users/:id", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });
  res.json(user);
});

app.post("/users", async (req, res) => {
  const user = await prisma.user.create({
    data: req.body,
  });
  res.json(user);
});

app.put("/users/:id", async (req, res) => {
  const user = await prisma.user.update({
    where: {
      id: parseInt(req.params.id),
    },
    data: req.body,
  });
  res.json(user);
});

app.delete("/users/:id", async (req, res) => {
  await prisma.user.delete({
    where: {
      id: parseInt(req.params.id),
    },
  });
  res.json({ message: "User deleted successfully" });
});

app.listen(3001, () => {
  console.log("User service listening on port 3001");
});
