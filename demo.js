//module required
var piggy = require('./piggyback.js');


piggy.piggyServer(3030, 'public', 'myeventlog.json');

//piggy.emitRandomEvents();
//piggy.handleReq('get','/add/:id/');
piggy.handleReq('post','/');
