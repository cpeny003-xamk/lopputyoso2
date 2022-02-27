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
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const apiRouter = express_1.default.Router();
apiRouter.get("/miehet/:nimi", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let etunimet = req.params.nimi.split(" ");
    let ensiSumma = yield prisma.$queryRaw `SELECT Sum(Lukumaara) AS Etunimet FROM miehetetunimi`;
    let muuSumma = yield prisma.$queryRaw `SELECT Sum(Lukumaara) AS MuutNimet FROM miehetmuutnimet`;
    let summa = ensiSumma.concat(muuSumma);
    console.log(summa);
    let nimitiedot = yield prisma.miehetetunimi.findMany({
        select: {
            id: true,
            Nimi: true,
            Lukumaara: true
        },
        where: {
            Nimi: etunimet[0]
        },
    });
    for (let i = 1; i < etunimet.length; i++) {
        let muutnimet = yield prisma.miehetmuutnimet.findMany({
            select: {
                id: true,
                Nimi: true,
                Lukumaara: true,
            },
            where: {
                Nimi: etunimet[i]
            },
        });
        nimitiedot.push(muutnimet[0]);
    }
    let tietopaketti = summa.concat(nimitiedot);
    res.json(tietopaketti);
}));
apiRouter.get("/naiset/:nimi", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let etunimet = req.params.nimi.split(" ");
    let ensiSumma = yield prisma.$queryRaw `SELECT Sum(Lukumaara) AS Etunimet FROM naisetetunimi`;
    let muuSumma = yield prisma.$queryRaw `SELECT Sum(Lukumaara) AS MuutNimet FROM naisetmuutnimet`;
    let summa = ensiSumma.concat(muuSumma);
    console.log(summa);
    let nimitiedot = yield prisma.naisetetunimi.findMany({
        select: {
            id: true,
            Nimi: true,
            Lukumaara: true
        },
        where: {
            Nimi: etunimet[0]
        },
    });
    for (let i = 1; i < etunimet.length; i++) {
        let muutnimet = yield prisma.naisetmuutnimet.findMany({
            select: {
                id: true,
                Nimi: true,
                Lukumaara: true,
            },
            where: {
                Nimi: etunimet[i]
            },
        });
        nimitiedot.push(muutnimet[0]);
    }
    let tietopaketti = summa.concat(nimitiedot);
    res.json(tietopaketti);
}));
apiRouter.get("/sukunimi/:nimi", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sukunimi = req.params.nimi.split(/ |-/g);
        let summa = yield prisma.$queryRaw `SELECT Sum(Lukumaara) AS lkm FROM sukunimet`;
        console.log(summa);
        let nimitiedot = yield prisma.sukunimet.findMany({
            select: {
                id: true,
                Sukunimi: true,
                Lukumaara: true
            },
            where: {
                Sukunimi: sukunimi[0]
            },
        });
        for (let i = 1; i < sukunimi.length; i++) {
            let muutnimet = yield prisma.sukunimet.findMany({
                select: {
                    id: true,
                    Sukunimi: true,
                    Lukumaara: true,
                },
                where: {
                    Sukunimi: sukunimi[i]
                },
            });
            nimitiedot.push(muutnimet[0]);
        }
        let tietopaketti = summa.concat(nimitiedot);
        res.json(tietopaketti);
    }
    catch (error) {
        console.log(error);
    }
}));
apiRouter.get("/nimiarvonta", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.query.sukupuoli == "nainen") {
            let kolmeNimea = yield prisma.$queryRaw `SELECT * From naisetkaikki WHERE Lukumaara BETWEEN ${req.query.minimi} AND ${req.query.maksimi}`;
            let random = [];
            let nimienLkm = Number(req.query.nimienlkm);
            if (kolmeNimea.length >= nimienLkm) {
                if (nimienLkm === 1) {
                    for (let i = 0; i < nimienLkm; i++) {
                        random.push(kolmeNimea[Math.floor(Math.random() * (kolmeNimea.length))]);
                    }
                    res.json(random);
                }
                else if (nimienLkm === 2) {
                    for (let i = 0; i < nimienLkm; i++) {
                        random.push(kolmeNimea[Math.floor(Math.random() * (kolmeNimea.length))]);
                        if (random.length === 2 && random[0] === random[1]) {
                            random.pop();
                            i--;
                        }
                    }
                    res.json(random);
                }
                else if (nimienLkm === 3) {
                    for (let i = 0; i < nimienLkm; i++) {
                        random.push(kolmeNimea[Math.floor(Math.random() * (kolmeNimea.length))]);
                        if (random.length === 2 && random[0] === random[1]) {
                            random.pop();
                            i--;
                        }
                        else if (random.length === 3 && random[1] === random[2] || random[0] === random[2]) {
                            random.pop();
                            i--;
                        }
                    }
                    res.json(random);
                }
            }
            else
                res.status(404).json({ "Virhe": "Hakuehdoilla ei löytynyt tietoja" });
        }
        else {
            let kolmeNimea = yield prisma.$queryRaw `SELECT * From miehetkaikki WHERE Lukumaara BETWEEN ${req.query.minimi} AND ${req.query.maksimi}`;
            let random = [];
            let nimienLkm = Number(req.query.nimienlkm);
            if (kolmeNimea.length >= nimienLkm) {
                if (nimienLkm === 1) {
                    for (let i = 0; i < nimienLkm; i++) {
                        random.push(kolmeNimea[Math.floor(Math.random() * (kolmeNimea.length))]);
                    }
                    res.json(random);
                }
                else if (nimienLkm === 2) {
                    for (let i = 0; i < nimienLkm; i++) {
                        random.push(kolmeNimea[Math.floor(Math.random() * (kolmeNimea.length))]);
                        if (random.length === 2 && random[0] === random[1]) {
                            random.pop();
                            i--;
                        }
                    }
                    res.json(random);
                }
                else if (nimienLkm === 3) {
                    for (let i = 0; i < nimienLkm; i++) {
                        random.push(kolmeNimea[Math.floor(Math.random() * (kolmeNimea.length))]);
                        if (random.length === 2 && random[0] === random[1]) {
                            random.pop();
                            i--;
                        }
                        else if (random.length === 3 && random[1] === random[2] || random[0] === random[2]) {
                            random.pop();
                            i--;
                        }
                    }
                    res.json(random);
                }
            }
            else
                res.status(404).json({ "Virhe": "Hakuehdoilla ei löytynyt tietoja" });
        }
    }
    catch (error) {
        res.json(error);
    }
}));
exports.default = apiRouter;
