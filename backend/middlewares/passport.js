const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const AdminModel = require('../models/Admin');
const ClientModel = require('../models/Client');
const logger = require('./logging');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, async (jwtPayload, done) => {
      // console.log("jwtPayload.role", jwtPayload.role);
      if (jwtPayload.role === 'admin') {
        try {
          const foundUser = await AdminModel.findOne(
            {
              isDeleted: false,
              _id: jwtPayload.id,
            },
            '-password -__v -isDeleted',
          );
          const user = { ...foundUser.toObject(), isAdmin: true };
          if (foundUser) return done(null, user);
          return done(null, false);
        } catch (error) {
          logger.error(error);
          return done(null, false);
        }
      } else {
        try {
          const foundUser = await ClientModel.findOne(
            {
              isDeleted: false,
              _id: jwtPayload.id,
            },
            '-password -__v -isDeleted',
          );
          // if (!foundUser.isVerified) return done(null, false);
          const user = { ...foundUser.toObject(), isAdmin: false };
          if (foundUser) return done(null, user);
          return done(null, false);
        } catch (error) {
          logger.error(error);
          return done(null, false);
        }
      }
      // normal user
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};
