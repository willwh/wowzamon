// comment schema

var Comments = new Schema({
    body        : {type : String, default : ''}
  , server     : {type : Schema.ObjectId, ref : 'Server'}
  , user        : {type : Schema.ObjectId, ref : 'User'}
  , created_at  : {type : Date, default : Date.now}
})

mongoose.model('Comment', Comments)
