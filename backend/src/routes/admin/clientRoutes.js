import express from "express";
import { addClient, getAllClients, getClientById, updateClient, deleteClient } from "../../controllers/admin/clientController.js";
import authenticateUser from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateUser(["admin"], "adminToken"));

router.post("/add", addClient);
router.get("/", getAllClients);
router.get("/:id", getClientById);
router.put("/edit/:id", updateClient);
router.delete("/delete/:id", deleteClient);

export default router;