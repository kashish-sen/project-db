const User = require("../models/userModel");

const addUser = async (req, res) => {

  try {

    const user = new User(req.body);

    await user.save();

    res.json({
      message: "User added successfully"
    });

  } catch (error) {

    res.json({
      error: error.message
    });

  }

};

module.exports = { addUser };