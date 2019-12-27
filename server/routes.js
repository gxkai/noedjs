const router = require('koa-router')({
  prefix: '/'
})

const controllers = require('./controllers')

router.get('/', controllers.sites)

module.exports = router
