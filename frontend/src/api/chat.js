// frontend/src/api/chat.js

import axios from "axios";

const API = "http://localhost:8000";

// =====================================
// CHATBOT API
// =====================================

export const sendMessage = async (message, user = "student") => {

  try {

    const response = await axios.post(
      `${API}/chat`,
      {
        message,
        user,
      }
    );

    return response.data.reply;

  } catch (error) {

    console.log(error);

    return "⚠️ Unable to connect to AI server.";

  }

};


// =====================================
// ATTENDANCE
// =====================================

export const getAttendance = async () => {

  try {

    const response = await axios.get(
      `${API}/attendance`
    );

    return response.data;

  } catch (error) {

    console.log(error);

    return {};

  }

};


// =====================================
// MARKS
// =====================================

export const getMarks = async () => {

  try {

    const response = await axios.get(
      `${API}/marks`
    );

    return response.data;

  } catch (error) {

    console.log(error);

    return {};

  }

};


// =====================================
// EXAMS
// =====================================

export const getExams = async () => {

  try {

    const response = await axios.get(
      `${API}/exams`
    );

    return response.data;

  } catch (error) {

    console.log(error);

    return [];

  }

};
export const loginUser = async ({ username, password, role }) => {
  try {
    const response = await axios.post(`${API}/login`, {
      username,
      password,
      role,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getChatHistory = async (user = "student") => {
  try {
    const response = await axios.get(`${API}/chat/history`, {
      params: { user }
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const appendChatHistory = async (entry) => {
  try {
    await axios.post(`${API}/chat/history`, entry);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const addFaq = async ({ question, answer }) => {
  try {
    const response = await axios.post(`${API}/admin/faqs`, {
      question,
      answer,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteFaq = async (question) => {
  try {
    const response = await axios.delete(`${API}/admin/faqs`, {
      params: { question }
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const uploadNote = async (note) => {
  try {
    const response = await axios.post(`${API}/admin/notes`, note);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteNote = async (noteId) => {
  try {
    const response = await axios.delete(`${API}/admin/notes/${noteId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// =====================================
// NOTES
// =====================================

export const getNotes = async () => {

  try {

    const response = await axios.get(
      `${API}/notes`
    );

    return response.data;

  } catch (error) {

    console.log(error);

    return {};

  }

};


// =====================================
// CLUBS
// =====================================

export const getClubs = async () => {

  try {

    const response = await axios.get(
      `${API}/clubs`
    );

    return response.data;

  } catch (error) {

    console.log(error);

    return [];

  }

};


// =====================================
// PROFILE
// =====================================

export const getProfile = async () => {

  try {

    const response = await axios.get(
      `${API}/profile`
    );

    return response.data;

  } catch (error) {

    console.log(error);

    return {};

  }

};


// =====================================
// NOTIFICATIONS
// =====================================

export const getNotifications = async () => {

  try {

    const response = await axios.get(
      `${API}/notifications`
    );

    return response.data;

  } catch (error) {

    console.log(error);

    return [];

  }

};