const jwt = require('jsonwebtoken')

let JWT

module.exports = {
  path: '/api/v1/auth/refresh-token',
  delay: 500,
  method: 'POST',
  status: (req, res, next) => {
    JWT = jwt.sign(
      {
        countryCode: 'PL',
        email: 'test@geotags.pl',
        id: '5cdfb6a6bad88bb5dbf1eccf',
        languageCode: 'pl-PL',
        roles: [],
        isActive: true,
      },
      'fake-key',
      {
        expiresIn: 900,
      }
    )
    res.status(200)
    res.cookie('accessToken', JWT, {
      expires: new Date(Date.now() + 900000),
      path: '/logout',
    })
    next()
  },
  template: () => {
    return {
      accessToken: JWT,
    }
  },
}
