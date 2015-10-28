var path      = require('path')
  , mongoose  = require('mongoose')
  , mockgoose = require('mockgoose')
  , walk      = require('walk');


mockgoose(mongoose);


mongoose.connect('localhost/apptic');


require('js-yaml');
require('babel/register');


walk.walkSync(__dirname, {
    followLinks : false,
    filters     : ['__fake', '__fixtures'],
    listeners   : {
        file : function (root, fileStats, next) {
            if (process.env.CASE) {
                if ((new RegExp(process.env.CASE, 'i')).test(fileStats.name)) {
                    require(path.join(root, fileStats.name));
                }
            } else {
                require(path.join(root, fileStats.name));
            }

            next();
        }
    }
});