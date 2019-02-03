//module required
var piggy = require('./piggyback.js');

piggy.piggyServer(3030, 'public', 'myeventlog.json');


piggy.handleRoute('/add/:id/');
