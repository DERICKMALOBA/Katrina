const express = require('express');
const { format } = require('date-fns');
const app = express();
    const dayOfWeek = new Date();
    const x=dayOfWeek.getDay();
    console.log(`Today is ${x}`);
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});