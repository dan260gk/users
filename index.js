const express = require('express');
const app = express();
const path = require('path');
const userRoutes = require('./routes/user.js')
const bodyParser = require("body-parser")
app.use(bodyParser.json());

app.use('/api',userRoutes)
app.use(express.static(path.join(__dirname, 'public')));
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
///api/user en post
//body fistname y lastname o id y amount
//statsus 1 is gud
//status 0 is bad
//