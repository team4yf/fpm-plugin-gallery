var should = require("should");
var YF = require("yf-fpm-client-nodejs").default;

YF.init({appkey: '123123', masterKey: '1b7e5703602b6fce1cae7364ac0f2244', endpoint: 'http://localhost:9999/api'});


describe('Gallery', function(){
  it('list function', function(done){
    var func = new YF.Func('gallery.list');
    func.invoke({})
      .then(function(data){
        console.log(data);
        done();
      }).catch(function(err){
        done(err);
      });
  });
  it('upload function', function(done){
    var func = new YF.Func('gallery.upload');
    func.invoke([{data:'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', 
      name: 'desktop3.png', size: '3439', type: 'image/png'}
    ]).then(function(data){
      console.log(data);
      done();
    }).catch(function(err){
      done(err);
    });
  });

})
