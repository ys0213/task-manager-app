import express from "express";
import { createProject, getAllProjects } from "../controllers/projectController.js";

const router = express.Router();

router.post("/", createProject);
router.get("/", getAllProjects);

router.get("/:id", async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Project not found" });
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
