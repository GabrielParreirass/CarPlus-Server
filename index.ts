import { PrismaClient } from "@prisma/client";
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";
const saltRounds = 10;

const prisma = new PrismaClient();
dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());

app.post("/createAccount", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;

  const verifyUser = await prisma.users.findFirst({
    where: {
      email: email,
    },
  });

  if (verifyUser) {
    res.json({ message: "Email já cadastrado!" });
  } else {
    try {
      bcrypt.hash(password, saltRounds, async function (err, hash) {
        await prisma.users.create({
          data: {
            email: email,
            password: hash,
            username: username,
          },
        });
        res.json({ message: "success" });
      });
    } catch (error) {
      res.send(error);
    }
  }
});

app.get("/getCars", async (req, res) => {
  const carsData = await prisma.vehicles.findMany({})

  res.json({carsData})
})

app.get("/getCars/:carClass", async (req, res) => {
  const vehicleClass = req.params.carClass
  try {
    const vehicle = await prisma.vehicles.findMany({
      where: {class: vehicleClass}
    })
    res.json({vehicle})
  } catch (error) {
    res.json({ message: "Veiculo não encontrado!" });
  }
})

app.listen(3001, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:3001`);
});
