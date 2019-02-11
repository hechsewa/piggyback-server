# piggyback-server
A project for design patterns classes implementing a simple piggyback server using NodeJS and AngularJS (a node module) and use of said module (demo.js).


## how piggyback works
Piggybacking is one of the methods from the 'Reverse AJAX' group, which also consists of: 'Comet', 'Polling', 'Long Polling'. Piggybacking is when the server sends back not only request response, but also other events that occured since client's last request. Here it is on the diagram:

![alt text](https://raw.githubusercontent.com/hechsewa/piggyback-server/master/imgs/piggyback-diagram.gif)

## pros and cons of piggyback method

Pros:
+ allows to remove spare client requests (ones that don't require a server's data response)

Cons:
- it can be a long time before some major server change will be visible to clients (when a client doesn't send any requests, they cannot see current server changes)

##how to run demo app

```
node demo.js
```

in web browser:

```
localhost:3030
```

##sample demo app output

![alt text](https://raw.githubusercontent.com/hechsewa/piggyback-server/master/imgs/screen2.png)

![alt text](https://raw.githubusercontent.com/hechsewa/piggyback-server/master/imgs/screen3.png)
