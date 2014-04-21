var express    = require('express');
var index      = require('./routes/index');
var discussion = require('./routes/discussion');
var path       = require('path');

var app        = express();

app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', index.get);
app.get('/discussion', discussion.get);

app.get('/topic/:id', function(req, res){
  res.location(req.url);
});

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
