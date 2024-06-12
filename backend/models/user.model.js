const sql = require('../utils/db');

// Constructor
const User = function(user) {
  this.username = user.username;
  this.password = user.password;
  this.category_id = user.category_id;
  this.vendor_id = user.vendor_id;
};

// Create a new User
User.create = (newUser, result) => {
  sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created user: ", { id: res.insertId, ...newUser });
    result(null, { id: res.insertId, ...newUser });
  });
};

// Find a user by ID
User.findById = (userId, result) => {
  sql.query(`SELECT users.*, category.category_name, vendor.vendor_name FROM users
             JOIN category ON users.category_id = category.category_id
             JOIN vendor ON users.vendor_id = vendor.vendor_id
             WHERE users.id = ?`, userId, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // User not found with the id
    result({ kind: "not_found" }, null);
  });
};

// Get all users
User.getAll = (result) => {
  sql.query(`SELECT users.id, users.username, users.password, category.category_name, vendor.vendor_name FROM users
             JOIN category ON users.category_id = category.category_id
             JOIN vendor ON users.vendor_id = vendor.vendor_id`, (err, res) => {
    if (err) {
      console.log("SQL error: ", err);
      result(err, null);
      return;
    }

    console.log("users: ", res);
    result(null, res);
  });
};

// Update a user by ID
User.updateById = (id, user, result) => {
  sql.query(
    "UPDATE users SET username = ?, password = ?, category_id = ?, vendor_id = ? WHERE id = ?",
    [user.username, user.password, user.category_id, user.vendor_id, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        // User not found with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated user: ", { id: id, ...user });
      result(null, { id: id, ...user });
    }
  );
};

// Remove a user by ID
User.remove = (id, result) => {
  sql.query("DELETE FROM users WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      // User not found with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted user with id: ", id);
    result(null, res);
  });
};

// Remove all users
User.removeAll = (result) => {
  sql.query("DELETE FROM users", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log(`deleted ${res.affectedRows} users`);
    result(null, res);
  });
};

module.exports = User;
