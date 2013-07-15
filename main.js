var express = require('express');
var app = express();

app.set('view engine', 'jade');
app.use(express.logger());
app.use('/js', express.static(__dirname + '/static/js'));
app.use('/img', express.static(__dirname + '/static/img'));
app.use('/css', express.static(__dirname + '/static/css'));

app.post('/api/add-issue', function(req, res) {
  res.end(JSON.stringify({ok:true}));
});

app.get('/api/get-issue', function(req, res) {
  res.end(JSON.stringify({ok: true,
                          issueList: [
                            { title: 'issue1',
                              options: ['opt11', 'opt12'],
                              resultMap: { 'opt11': 32,
                                           'opt12': 45 }},
                            { title: 'issue2',
                              options: ['opt21', 'opt22'],
                              resultMap: { 'opt21': 93,
                                           'opt22': 25 }},
                            { title: 'issue3',
                              options: ['opt31', 'opt32'],
                              resultMap: { 'opt31': 90,
                                           'opt32': 342 }}
                          ]}));
});

app.get('/', function(req, res){
  app.render('list', {
    title: "test"
  }, function(err, html) {
    console.error(err);
    console.log(html);
    res.end(html);
  });
});

app.listen(3000);
