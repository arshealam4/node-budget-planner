import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import errorHandler from "./lib/errorHandler";

// registered all models
import * as budgetsModel from "./models/BudgetsModel";
budgetsModel;

// registered all routes
import budgetsRouter from "./routes/budgets";

const app = express();
app.use(cors()); // middleware that can be used to enable CORS

app.use(logger("dev")); // middleware to logs error
app.use(express.json()); // parses incoming requests with JSON payloads
app.use(express.urlencoded({ extended: false })); // parses incoming requests with urlencoded payloads
app.use(cookieParser()); // middleware to parse cookie header
app.use(express.static(path.join(__dirname, "public"))); // middleware to serves static files

import("./lib/maindb");

// adding prefix with route
const API = "/api/v1/";
app.use(API + "budget", budgetsRouter);

// catch 404 and forward to error handler
app.use(errorHandler.routeNotFound);

export default app;
