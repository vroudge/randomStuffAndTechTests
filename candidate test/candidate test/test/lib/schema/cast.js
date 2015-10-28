var expect  = require('chai').expect
  , mongodb = require('mongodb')
  , cast    = require('../../../lib/schema/cast')
  , schema  = require('../../__fixtures/lib/schema/schema');


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


var invalidObj = {
    name       : 'Oscar',
    number     : '10abcd',
    boolean    : 'not-a-boolean',
    date       : 'not-a-date-string',
    undeclared : 'remove this',
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
                name   : 'Go Find It',
                number : '33'
            }]
        }
    }]
};



var expectedValid = {
    _id     : new mongodb.ObjectID('562f399c7b2a6bcd7a47239a'),
    name    : 'Oscar',
    number  : 10,
    boolean : true,
    date    : new Date('2015-10-01T00:00:00.000Z'),
    address : [{
        street      : '4 rue Choron',
        coordinates : [41.393735, 2.1811019]
    }],
    deeply : {
        nested : {
            object : {
                active : true,
                date   : new Date('2015-10-01T00:00:00.000Z'),
                num    : 10
            }
        }
    },
    array : [{
        of : {
            arrays : [{
                _id    : new mongodb.ObjectID('562f399c7b2a6bcd7a47239a'),
                name   : 'Go Find It',
                number : '33'
            }, {
                _id    : new mongodb.ObjectID('562f399c7b2a6bcd7a47239a'),
                name   : 'Something'
            }]
        }
    }]
};


var expectedInvalid = {
    _id  : new mongodb.ObjectID('562f399c7b2a6bcd7a47239a'),
    name : 'Oscar',
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
                _id    : new mongodb.ObjectID('562f399c7b2a6bcd7a47239a'),
                name   : 'Go Find It',
                number : '33'
            }]
        }
    }]
};


describe('Casting object according to a schema', function () {

    var result1 = cast(schema, validObject)
      , result2 = cast(schema, invalidObj);

    it('should cast string to Mongodb ObjectID', function () {
        expect(result1._id).to.be.instanceof(mongodb.ObjectID);
    });

    it('should cast valid numeric string to Number', function () {
        expect(result1.number).to.equal(10);
    });

    it('should cast string true|false to Boolean', function () {
        expect(result1.boolean).to.equal(true);
    });

    it('should cast valid date string to Date', function () {
        expect(result1.date).to.be.instanceof(Date);
        expect(result1.date).to.deep.equal(new Date('2015-10-01T00:00:00.000Z'));
    });

    it('should nested array of array to the expected shape', function () {
        expect(result1.address[0]).to.deep.equal({ street : '4 rue Choron', coordinates : [41.393735, 2.1811019] });
    });

    it('should update deeply nested objects to the expected shape', function () {
        expect(result1.deeply.nested.object).to.deep.equal(expectedValid.deeply.nested.object);
    });

    it('should update deeply nested objects to the expected shape', function () {
        expect(result1.deeply.nested.object).to.deep.equal(expectedValid.deeply.nested.object);
    });

    it('should update array of arrays with correct length', function () {
        expect(result1.array[0].of.arrays).to.have.length.of(2);
    });

    it('should update array of arrays correctly', function () {
        expect(result1.array).to.deep.equal(expectedValid.array);
    });

    it('should insert Mongodb ObjectIDs where missing', function () {
        expect(result1.array[0].of.arrays[1]._id).to.be.instanceof(mongodb.ObjectID);
        expect(result2._id).to.be.instanceof(mongodb.ObjectID);
    });

    it('should update the entire object to the expected result', function () {
        expect(result1).to.deep.equal(expectedValid);
        expect(result2).to.deep.equal(expectedInvalid);
    });

    it('should not mutate the original object', function () {
        expect(result1).to.not.deep.equal(validObject);
        expect(result2).to.not.deep.equal(invalidObj);
    });

});