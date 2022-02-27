"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const api_1 = __importDefault(require("./routes/api"));
dotenv_1.default.config({ path: (path_1.default.resolve(__dirname, '.env')) });
const app = (0, express_1.default)();
const port = process.env.PORT || 3200;
app.use(express_1.default.static(path_1.default.resolve(__dirname, "public")));
app.use("/api", api_1.default);
app.listen(port, () => {
    console.log(`Palvelin avattiin porttiin ${port}`);
});
