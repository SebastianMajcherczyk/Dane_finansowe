
var { dbService } = require('../services/db.service');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var { jwtSecret } = require('./../data/env');

var controller = {
    // Define the logIn function to handle user login requests
    logIn: async (req, res) => {
        try {
            // Extract login and password from the request body
            const { login, password } = req.body;

            console.log('Login :' + login);
            console.log('Password :' + password);

            let conn; // Declare a connection variable
            try {
                conn = await dbService.connect(); // Try to establish a database connection

                // Execute a SQL query to get the user data. The question mark is a placeholder that gets
                // replaced by the contents of the array in the second argument
                const rows = await conn.query('SELECT * FROM users where user = ?', [login]);

                // Extract the first row of the result set, which should be the user data
                const user = rows[0];

                // If there is no user data, send a 401 Unauthorized status and a "Wrong user" message
                if (!user) {
                    res.status(401);
                    return res.send({ status: 'Wrong user' });
                }

                // Compare the provided password with the hashed password in the database
                bcrypt.compare(password, user.password, function (err, result) {
                    // If there is an error, send a 500 Internal Server Error status and a message
                    if (err) {
                        res.status(500);
                        res.send({ status: 'Internal error' });
                    }
                    // If the passwords match
                    if (result) {
                        delete user.password; // Remove the password from the user object

                        // Create a JSON Web Token (JWT) from the user data
                        const token = jwt.sign(user, jwtSecret);

                        // Set a cookie on the response that stores the JWT
                        res.cookie('jwt', token, {
                            httpOnly: true, // The cookie is only accessible by the server
                            // secure: true, // Uncomment this line to send the cookie over HTTPS only
                            maxAge: 1800, // The cookie expires after 1800 seconds (30 minutes)
                        });

                        // Send a "Success" status and the token
                        return res.send({
                            status: 'Success',
                            token,
                        });
                    } else { // If the passwords do not match
                        // Send a 401 Unauthorized status and a "Wrong login data" message
                        res.status(401);
                        return res.send({ status: 'Wrong login data' });
                    }
                });
            } finally {
                // Disconnect from the database, regardless of whether an error occurred or not
                dbService.disconnect(conn);
            }
        } catch (error) { // If any other error occurs
            console.log(error); // Log the error
            // Send a "Internal error" message
            return res.send('Internal error');
        }
    },

    // Define the logOut function to handle user logout requests
    logOut: (req, res) => {
        res.clearCookie('jwt'); // Remove the JWT cookie
        res.send({ status: 'Logged out successfully' }); // Send a "Logged out successfully" message
    },
};

module.exports = controller; // Export the controller
