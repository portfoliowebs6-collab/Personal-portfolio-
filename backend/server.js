const express = require('express');
const app = express();

// Middleware (jaise express.json)
app.use(express.json());

// === Inhe yahan paste karna hai ===
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// Server listen karne wala code sabse last me hota hai
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

