// Server schema

var ServerSchema = new Schema({
    title       : {type : String, default : '', trim : true}
  , hostname    : {type : String, default : '', trim : true}
  , port        : {type : String, default : '', trim : true}
  , username    : {type : String, default : '', trim : true}
  , password    : {type : String, default : '', trim : true}
  , user        : {type : Schema.ObjectId, ref : 'User'}
  , created_at  : {type : Date, default : Date.now}
})

ServerSchema.path('title').validate(function (title) {
  return title.length > 0
}, 'Server title cannot be blank')

ServerSchema.path('hostname').validate(function (hostname) {
  return hostname.length > 0
}, 'Server hostname cannot be blank')


mongoose.model('Server', ServerSchema)
