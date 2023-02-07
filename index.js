"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 10;
const prisma = new client_1.PrismaClient();
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/createAccount", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    const verifyUser = yield prisma.users.findFirst({
        where: {
            email: email,
        },
    });
    if (verifyUser) {
        res.json({ message: "Email já cadastrado!" });
    }
    else {
        try {
            bcrypt_1.default.hash(password, saltRounds, function (err, hash) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield prisma.users.create({
                        data: {
                            email: email,
                            password: hash,
                            username: username,
                        },
                    });
                    res.json({ message: "success" });
                });
            });
        }
        catch (error) {
            res.send(error);
        }
    }
}));
app.get("/getCars", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const carsData = yield prisma.vehicles.findMany({});
    res.json({ carsData });
}));
app.get("/getCars/:carClass", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vehicleClass = req.params.carClass;
    try {
        const vehicle = yield prisma.vehicles.findMany({
            where: { class: vehicleClass }
        });
        res.json({ vehicle });
    }
    catch (error) {
        res.json({ message: "Veiculo não encontrado!" });
    }
}));
app.listen(3001, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:3001`);
});
