import type { Context } from '@/global'
import { env } from 'hono/adapter'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'

export class AuthService {
  private passport: typeof passport

  constructor(c: Context) {
    this.passport = passport
    this.passport.use(
      new GoogleStrategy(
        {
          clientID: env(c).GOOGLE_AUTH_CLIENT_ID,
          clientSecret: env(c).GOOGLE_AUTH_CLIENT_SECRET,
          callbackURL: env(c).GOOGLE_AUTH_CALLBACK_URL,
          scope: ['profile'],
          state: true,
        },
        // https://github.com/jaredhanson/passport-google-oauth2
        (accessToken, refreshToken, profile, callback) => {
          console.log('いぬ')

          console.log({ accessToken, refreshToken, profile, callback })
        },
      ),
    )

    this.passport.serializeUser((user, done) => {
      console.log('Serializer Called!')
      console.log({ user, done })
      done(null, user)
    })
    this.passport.deserializeUser((user, done) => {
      console.log('Deserializer Called!')
      console.log({ user, done })
      done(null, user as Express.User)
    })

    this.passport.initialize()
  }

  authenticateWithGoogle() {
    console.log('called but...')
    return this.passport.authenticate(
      'google',
      {
        successRedirect: '/',
        failureRedirect: '/',
      },
      () => {
        console.log('うおおおおおおお')
      },
    )
  }
}
