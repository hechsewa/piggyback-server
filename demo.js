//module required
var piggy = require('./piggyback.js');

piggy.piggyServer(3030, 'public', 'myeventlog.json');

//piggy.getMethod('/add/:id/');
//piggy.emitRandomEvents();
piggy.postMethod('/');  
