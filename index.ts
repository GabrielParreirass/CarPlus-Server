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

app.post("/createBooking", async (req, res) => {
  const date1 = req.body.date1
  const date2 = req.body.date2
  const dayQtd = req.body.dayQtd
  const value = req.body.value
  const userEmail = req.body.currentUserEmail
  const carClass = req.body.carClass

  const createdBooking = await prisma.users.update({
    where:{
      email: userEmail
    },
    data:{
      bookings:{
        create:{
          date1: date1,
          date2: date2,
          dayQtd: dayQtd,
          value: value,
          carClass: carClass
        }
      }
    }
  })

  res.send(createdBooking)

})

app.listen(3001, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:3001`);
});
