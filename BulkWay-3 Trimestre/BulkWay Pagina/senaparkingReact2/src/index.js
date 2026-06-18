import dotenv from "dotenv";
import app from "./app/app.js";
import { modelApp } from "./config/models.app.js";

dotenv.config();

// Sincronizar modelos
modelApp(true);

const port = process.env.SERVER_PORT || 3001;

app.listen(port, () => {
  console.log(`Connected Server .... ${port}`);
});