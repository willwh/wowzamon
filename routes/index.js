
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'WowzaMon' })
};

exports.login = function(req, res){
  res.render('login', { title: 'WowzaMon Admin' })
};
