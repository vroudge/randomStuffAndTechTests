var mongodb = require('mongodb');


var schema = {
    _id     : mongodb.ObjectID,
    name    : String,
    number  : Number,
    boolean : Boolean,
    date    : Date,
    address : [{
        street      : String,
        coordinates : []
    }],
    deeply : {
        nested : {
            object : {
                active : Boolean,
                date   : Date,
                num    : Number
            }
        }
    },
    array : [{
        of : {
            arrays : [{
                _id    : mongodb.ObjectID,
                name   : String,
                number : Number
            }]
        }
    }]
};


module.exports = schema;