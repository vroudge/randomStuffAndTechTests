



var mongodb = require('mongodb');

var cast = function(schema, comparedObject){

    var castBool = function(value){
        var valueString = (value + '').toLowerCase();
        if(valueString === 'true'){
            return true
        }else if (valueString === 'false'){
            return false
        }else{
            return null;
        }
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

    clonedCompared._id =storedId;    console.log(clonedCompared.number);
    clonedCompared.number = parseInt(clonedCompared.number); //classic parseInt

    clonedCompared.boolean = castBool(clonedCompared.boolean);
    if(clonedCompared.boolean === null){
        delete clonedCompared.boolean;
    }

    clonedCompared.date = new Date(clonedCompared.date);
    if(isNaN(clonedCompared.date.getTime())){
        delete clonedCompared.date;
    }

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
            if(nestedElem.number){
                nestedElem.number = parseInt(nestedElem.number);
            }

        });

    });

    if(clonedCompared.undeclared){
        delete clonedCompared.undeclared;
    }

    return clonedCompared;
};

module.exports = cast;
