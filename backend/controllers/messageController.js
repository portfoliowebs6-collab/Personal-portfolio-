"use strict";

const { db } = require("../config/firebase");

const COLLECTION = "messages";

/*
|--------------------------------------------------------------------------
| Helper
|--------------------------------------------------------------------------
*/

function cleanMessageData(data = {}) {
  return {
    name:
      typeof data.name === "string"
        ? data.name.trim()
        : "",

    email:
      typeof data.email === "string"
        ? data.email.trim().toLowerCase()
        : "",

    message:
      typeof data.message === "string"
        ? data.message.trim()
        : "",

    subject:
      typeof data.subject === "string"
        ? data.subject.trim()
        : "",

    status:
      data.status === "read" ||
      data.status === "replied" ||
      data.status === "archived"
        ? data.status
        : "unread"
  };
}

/*
|--------------------------------------------------------------------------
| CREATE MESSAGE
| POST /api/messages
|--------------------------------------------------------------------------
*/

async function createMessage(req, res) {
  try {
    if (!db) {
      return res.status(500).json({
        success: false,
        message: "Firebase database is not configured."
      });
    }

    const messageData = cleanMessageData(req.body);

    if (!messageData.name) {
      return res.status(400).json({
        success: false,
        message: "Name is required."
      });
    }

    if (!messageData.email) {
      return res.status(400).json({
        success: false,
        message: "Email is required."
      });
    }

    if (!messageData.message) {
      return res.status(400).json({
        success: false,
        message: "Message is required."
      });
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(messageData.email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address."
      });
    }

    const now = new Date();

    const newMessage = {
      ...messageData,
      createdAt: now,
      updatedAt: now
    };

    const docRef = await db
      .collection(COLLECTION)
      .add(newMessage);

    return res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      data: {
        id: docRef.id
      }
    });
  } catch (error) {
    console.error("Create message error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send message."
    });
  }
}

/*
|--------------------------------------------------------------------------
| GET ALL MESSAGES
| GET /api/messages
|--------------------------------------------------------------------------
*/

async function getMessages(req, res) {
  try {
    if (!db) {
      return res.status(500).json({
        success: false,
        message: "Firebase database is not configured."
      });
    }

    const snapshot = await db
      .collection(COLLECTION)
      .orderBy("createdAt", "desc")
      .get();

    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.status(200).json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    console.error("Get messages error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages."
    });
  }
}

/*
|--------------------------------------------------------------------------
| GET MESSAGE BY ID
| GET /api/messages/:id
|--------------------------------------------------------------------------
*/

async function getMessageById(req, res) {
  try {
    if (!db) {
      return res.status(500).json({
        success: false,
        message: "Firebase database is not configured."
      });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Message ID is required."
      });
    }

    const doc = await db
      .collection(COLLECTION)
      .doc(id)
      .get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "Message not found."
      });
    }

    return res.status(200).json({
      success: true,
      messageData: {
        id: doc.id,
        ...doc.data()
      }
    });
  } catch (error) {
    console.error("Get message error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch message."
    });
  }
}

/*
|--------------------------------------------------------------------------
| UPDATE MESSAGE STATUS
| PATCH /api/messages/:id/status
|--------------------------------------------------------------------------
*/

async function updateMessageStatus(req, res) {
  try {
    if (!db) {
      return res.status(500).json({
        success: false,
        message: "Firebase database is not configured."
      });
    }

    const { id } = req.params;
    const { status } = req.body || {};

    const allowedStatuses = [
      "unread",
      "read",
      "replied",
      "archived"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message status."
      });
    }

    const messageRef = db
      .collection(COLLECTION)
      .doc(id);

    const existingMessage = await messageRef.get();

    if (!existingMessage.exists) {
      return res.status(404).json({
        success: false,
        message: "Message not found."
      });
    }

    await messageRef.update({
      status,
      updatedAt: new Date()
    });

    return res.status(200).json({
      success: true,
      message: "Message status updated successfully.",
      data: {
        id,
        status
      }
    });
  } catch (error) {
    console.error(
      "Update message status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update message status."
    });
  }
}

/*
|--------------------------------------------------------------------------
| DELETE MESSAGE
| DELETE /api/messages/:id
|--------------------------------------------------------------------------
*/

async function deleteMessage(req, res) {
  try {
    if (!db) {
      return res.status(500).json({
        success: false,
        message: "Firebase database is not configured."
      });
    }

    const { id } = req.params;

    const messageRef = db
      .collection(COLLECTION)
      .doc(id);

    const existingMessage = await messageRef.get();

    if (!existingMessage.exists) {
      return res.status(404).json({
        success: false,
        message: "Message not found."
      });
    }

    await messageRef.delete();

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully.",
      messageId: id
    });
  } catch (error) {
    console.error("Delete message error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete message."
    });
  }
}

/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/

module.exports = {
  getMessages,
  getMessageById,
  createMessage,
  updateMessageStatus,
  deleteMessage
};
