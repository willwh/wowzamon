var Server = mongoose.model('Server')
  , Comment = mongoose.model('Comment')


module.exports = function(app){
  app.param('serverId', function(req, res, next, id){
    Server
      .findOne({ _id : id })
      .run(function(err,server) {
        if (err) return next(err);
        if (!server) return next(new Error('Failed to load server ' + id));
        req.server = server;
        next();
      })
  });

  app.post('/comment/:serverId', function (req, res) {
    if (req.body.comment && req.body.comment.body != '' && req.loggedIn) {
      var comment = new Comment({})
      comment.server = req.server.id
      comment.body = req.body.comment.body
      if (req.loggedIn)
        comment.user = req.session.auth.userId
      comment.save(function (err) {
        if (err) throw err
        req.flash('notice', 'Comment added successfully')
        res.redirect('/server/'+req.server.id)
      })
    }
    else
      res.redirect('/server/'+req.server.id)
  })
}
