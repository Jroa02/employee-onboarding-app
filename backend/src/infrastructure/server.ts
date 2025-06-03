import express, { Request, Response, NextFunction } from "express";
import { setLeaderRoutes } from "./../interface/routes/LeaderRoutesRoutes";
import { setUserRoutes } from "./../interface/routes/UserRoutes";
import { setPermissionRoutes } from "./../interface/routes/PermissionRoutes";
import { setTIRoutes } from "./../interface/routes/TIRoutes";
import { setEquipmentRoutes } from "./../interface/routes/EquipmentRoutes";
import { setSolicitudRoutes } from "./../interface/routes/SolicitudRoutes";
import { setHistorialRoutes } from "./../interface/routes/HistorialRoutes";
import { createConnection } from "./database/connection";
import * as OpenApiValidator from "express-openapi-validator";
import * as path from "path";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3001;

// Set up OpenAPI Validator
const apiSpec = path.join(__dirname, "./../../static/OAS.yml");
app.use(
  OpenApiValidator.middleware({
    apiSpec,
    validateRequests: true,
    validateResponses: true,
  })
);

createConnection();
// routes
const apiRouter = express.Router();
setLeaderRoutes(apiRouter);
setUserRoutes(apiRouter);
setPermissionRoutes(apiRouter);
setTIRoutes(apiRouter);
setEquipmentRoutes(apiRouter);
setSolicitudRoutes(apiRouter);
setHistorialRoutes(apiRouter);
app.use("/", apiRouter);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`ERROR: ${err}`);
  res.status(err.status || 500).json({
    status: err.status || 500,
    error: err.error || "Internal Server Error",
    message: err.message,
  });
});

if (process.env.NODE_ENV === "DEVELOPMENT") {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT} 🚀`);
  });
}

module.exports = app;
