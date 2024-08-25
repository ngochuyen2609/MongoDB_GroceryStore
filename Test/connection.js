const mongoose = require('mongoose');

//connection with database
before (function (done){
    mongoose.connect('mongodb://localhost/GroceryStore');

    //thiết lập một listener để lắng nghe sự kiện 'open' trên đối tượng mongoose.connection
    mongoose.connection.once('open',function(){
        console.log('Ket noi thanh cong');
        done();
    }).on('ERROR',function(error){
        console.log('Ket noi khong thanh cong',error);
    })
})

//SQL : Table , Row , Column , Joins , Primary Key
//NoSQL : Collection, Document , Field, Embeded Document , Linking , Primary 