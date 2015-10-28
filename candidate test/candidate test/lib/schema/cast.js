



var mongodb = require('mongodb');
/*
var validObject = {
    _id     : '562f399c7b2a6bcd7a47239a',
    name    : 'Oscar',
    number  : '10',
    boolean : 'true',
    date    : '2015-10-01T00:00:00.000Z',
    address : [{
        street      : '4 rue Choron',
        coordinates : [41.393735, '2.1811019']
    }],
    deeply : {
        nested : {
            object : {
                active : 'true',
                date   : '2015-10-01T00:00:00.000Z',
                num    : 10
            }
        }
    },
    array : [{
        of : {
            arrays : [{
                _id    : '562f399c7b2a6bcd7a47239a',
                name   : 'Go Find It',
                number : '33'
            }, {
                name   : 'Something'
            }]
        }
    }]
};
validObject.array.forEach(function(elem, index, array){
    elem.of.arrays.forEach(function(nestedElem, nestedIndex, nestedArray){
        console.log(nestedElem)
        if(nestedIndex === '_id'){

            nestedArray[nestedIndex] = new mongodb.ObjectID(nestedElem);
        }
    });

});*/



var cast = function(schema, comparedObject){
    console.log(comparedObject);
    var castBool = function(value){
        return (value + '').toLowerCase() === 'true';
    };

    var clone = function clone(obj) {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    };

    var clonedCompared = clone(comparedObject);
    var storedId = new mongodb.ObjectID(clonedCompared._id);

    clonedCompared._id =storedId;

    clonedCompared.number = parseInt(clonedCompared.number); //classic parseInt
    clonedCompared.boolean = castBool(clonedCompared.boolean);
    clonedCompared.date = new Date(clonedCompared.date);

    clonedCompared.address.forEach(function(elem, index, array){
        if(elem.coordinates instanceof Array){
            elem.coordinates.forEach(function(nestedElem, nestedIndex, nestedArray){
                if(typeof nestedElem !== 'number'){
                    nestedArray[nestedIndex] = parseFloat(nestedElem);
                }
            });
        }
    });

    clonedCompared.deeply.nested.object.active = castBool(clonedCompared.deeply.nested.object.active);
    clonedCompared.deeply.nested.object.date = new Date(clonedCompared.deeply.nested.object.date);

    clonedCompared.array.forEach(function(elem){
        elem.of.arrays.forEach(function(nestedElem, nestedIndex, nestedArray){

            if(nestedElem._id){
                storedId = new mongodb.ObjectID(nestedElem._id);
                nestedArray[nestedIndex]._id = storedId;
            }else{
                nestedArray[nestedIndex]._id = storedId;
            }
        });

    });

    if(clonedCompared.undeclared){
        delete clonedCompared.undeclared;
    }

    return clonedCompared;
};

module.exports = cast;