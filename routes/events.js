var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('eventsdb', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'events' database");
        db.collection('events', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'events' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});
 
exports.findAll = function(req, res) {
    db.collection('events', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addEvent = function(req, res) {
    var events = req.body;
    console.log('Adding events: ' + JSON.stringify(events));
    db.collection('events', function(err, collection) {
        collection.insert(events, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
};

exports.deleteEvent = function(req, res) {
    var id = req.params.id;
    console.log('Deleting events: ' + id);
    db.collection('events', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};

//exports.findById = function(req, res) {
//    var id = req.params.id;
//    console.log('Retrieving events: ' + id);
//    db.collection('wines', function(err, collection) {
//        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
//            res.send(item);
//        });
//    });
//};
//
//
//
//exports.updateWine = function(req, res) {
//    var id = req.params.id;
//    var events = req.body;
//    console.log('Updating events: ' + id);
//    console.log(JSON.stringify(events));
//    db.collection('wines', function(err, collection) {
//        collection.update({'_id':new BSON.ObjectID(id)}, events, {safe:true}, function(err, result) {
//            if (err) {
//                console.log('Error updating events: ' + err);
//                res.send({'error':'An error has occurred'});
//            } else {
//                console.log('' + result + ' document(s) updated');
//                res.send(events);
//            }
//        });
//    });
//}
//

 
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    var events = [
    {
		title: 'Long Event',
		start: new Date(y, m, d - 5),
		end: new Date(y, m, d - 2)
	},
    {
        title: 'Birthday Party',
		start: new Date(y, m, d + 1, 19, 0),
		end: new Date(y, m, d + 1, 22, 30),
		allDay: false
    }];
 
    db.collection('events', function(err, collection) {
        collection.insert(events, {safe:true}, function(err, result) {});
    });
 
};