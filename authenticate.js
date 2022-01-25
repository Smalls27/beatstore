const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const Admin = require("./models/AdminSchema");

passport.use(new LocalStrategy((username, password, done) => {
    Admin.findOne({ username: username }, async (err, user) => {
        const loginPassword = password;
        if (err) return done(err);
        if (!user) return done(null, false, { message: "User does not exist..."});

        if (await bcrypt.compare(loginPassword, user.password)) {
            return done(null, user);
        } else {
            return done(null, false, { message: "Password is incorrect."});
        }
    });
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    Admin.findById(id, (err, user) => {
        done(err, user);
    })
});

exports.initialize = passport.initialize();
exports.session = passport.session();