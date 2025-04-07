import Task from "../models/Task.js";

// 모든 작업 조회
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "작업 목록을 불러오지 못했습니다." });
  }
};

// 작업 추가
export const createTask = async (req, res) => {
  const { title, description } = req.body;

  try {
    const newTask = new Task({ title, description });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: "작업 생성에 실패했습니다." });
  }
};

// 작업 수정
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  try {
    const task = await Task.findByIdAndUpdate(
      id,
      { title, description, status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "작업을 찾을 수 없습니다." });
    }

    res.json(task);
  } catch (err) {
    res.status(400).json({ message: "작업 수정에 실패했습니다." });
  }
};

// 작업 삭제
export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ message: "작업을 찾을 수 없습니다." });
    }

    res.json({ message: "작업이 삭제되었습니다." });
  } catch (err) {
    res.status(400).json({ message: "작업 삭제에 실패했습니다." });
  }
};
