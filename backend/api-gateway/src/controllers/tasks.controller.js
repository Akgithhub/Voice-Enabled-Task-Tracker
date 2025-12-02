import httpClient from "../utils/httpClient.js";
import serviceUrls from "../config/serviceUrls.js";

export const createTask = async (req, res) => {
  try {
    const response = await httpClient.post(
      `${serviceUrls.TASK_SERVICE_URL}/task/createTask`,
      req.body
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error?.response?.status || 500).json({
      error: error.message,
    });
  }
};

export const getAllTasks = async (req, res) => {
  console.log("🔥 GATEWAY: Incoming request for /tasks");
  try {
    const response = await httpClient.get(
      `${serviceUrls.TASK_SERVICE_URL}/task/getAllTask`
      // `http://localhost:3000/getAllTask`
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(error?.response?.status || 500).json({ error: error.message });
    console.log("Error in API Gateway - /getAllTask: ",error);
    
  }
};

export const getTaskById = async (req, res) => {
  try {
    const response = await httpClient.get(
      `${serviceUrls.TASK_SERVICE_URL}/task/getTask`,
      { params: { id: req.params.id } }
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(error?.response?.status || 500).json({ error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const response = await httpClient.put(
      `${serviceUrls.TASK_SERVICE_URL}/task/updateTask/${req.params.id}`,
      req.body
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(error?.response?.status || 500).json({ error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const response = await httpClient.delete(
      `${serviceUrls.TASK_SERVICE_URL}/task/deleteTask/${req.params.id}`
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(error?.response?.status || 500).json({ error: error.message });
  }
};
