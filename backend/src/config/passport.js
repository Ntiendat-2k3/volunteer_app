const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {User} = require('../database/models');
const authService = require('../services/auth.service');

function configurePassport() {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        try {
            const user = await authService.validateUser(email, password);
            if (! user) {
                return done(null, false, {message: 'Sai email hoặc mật khẩu'});
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }));

    // Lưu user.id vào session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Lấy lại user từ id trong session
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findByPk(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
}

module.exports = configurePassport;
