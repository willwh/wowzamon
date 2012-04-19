var Server = mongoose.model('Server')
  , Comment = mongoose.model('Comment')
  , rest = require('restler')
  , sys = require('util')

module.exports = function(app){

  // New server
  app.get('/servers/new', auth.requiresLogin, function(req, res){
    res.render('servers/new', {
      title: 'New Server',
      server: new Server({})
    })
  })

  app.param('id', function(req, res, next, id){
    Server
      .findOne({ _id : req.params.id })
      .populate('user')
      .run(function(err,server) {
        if (err) return next(err)
        if (!server) return next(new Error('Failed to load server ' + id))
        req.server = server
        Comment
          .find({server : req.server})
          .run(function (err, comments) {
            if (err) throw err
            req.comments = comments
            next()
          })
      })
  })

  // Create an server
  app.post('/servers', function(req, res){
    var server = new Server(req.body.server)
    server.user = req.session.auth.userId

    server.save(function(err){
      if (err) {
        utils.mongooseErrorHandler(err, req)
        res.render('servers/new', {
            title: 'New Server'
          , server: server
        })
      }
      else {
        req.flash('notice', 'Created successfully')
        res.redirect('/server/'+server._id)
      }
    })
  })

  // Edit an server
  app.get('/server/:id/edit', auth.requiresLogin, function(req, res){
    res.render('servers/edit', {
      title: 'Edit '+req.server.title,
      server: req.server
    })
  })

  // Update server
  app.put('/servers/:id', function(req, res){
    var server = req.server

    server.title = req.body.server.title
    server.hostname = req.body.server.hostname
    server.port = req.body.server.port
    server.username = req.body.server.username
    server.password = req.body.server.password

    server.save(function(err, doc) {
      if (err) {
        utils.mongooseErrorHandler(err, req)
        res.render('servers/edit', {
            title: 'Edit Server'
          , server: server
        })
      }
      else {
        req.flash('notice', 'Updated successfully')
        res.redirect('/server/'+server._id)
      }
    })
  })

  // View an server
  app.get('/server/:id', function(req, res){
    rest.get('http://hqx.netromedia.com:8778/jolokia/read/WowzaMediaServerPro:name=Connections').on('complete', function(serverconns) {
     if (serverconns instanceof Error) {
       sys.puts('Error: ' + serverconns.message);
         this.retry(5000); // try again after 5 sec
       } else {
         res.render('servers/show', {
           title: req.server.title,
           server: req.server,
           Jolokia: serverconns,
           Connections: JSON.parse(serverconns),
           comments: req.comments
         })
       }
    })
  })
  // Delete an server
  app.del('/server/:id', function(req, res){
    var server = req.server
    server.remove(function(err){
      req.flash('notice', 'Deleted successfully')
      res.redirect('/servers')
    })
  })

  // Listing of Servers
  app.get('/servers', function(req, res){
    Server
      .find({})
      .desc('created_at') // sort by date
      .run(function(err, servers) {
        if (err) throw err
        res.render('servers/index', {
          title: 'List of Servers',
          servers: servers
        })
      })
  })

  // home
  app.get('/', function(req, res){
    res.redirect('/servers')
  })
}
