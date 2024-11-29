const express = require("express");
const cors = require("cors");
const AllRoutes = require("./Routers/Package.js");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/packages", AllRoutes);

app.listen(port, () => {
  console.log(`my server is runing on : ${port}`);
});
