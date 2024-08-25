const mongoose = require('mongoose');
const assert = require('assert'); // assert is used for checking conditions in tests.
const KhachHang = require('../Models/KhachHang');

describe('Quan ly KhachHang', function () {
    // Before each test, drop the KhachHangs collection to start with a clean state.
    before(function (done) {
        mongoose.connection.collections.khachhangs.drop(function () {
            done();
        });
    });

    //Thiet lap du lieu //Them khach hang
    before('thiet lap du lieu', function (done) {
        const khachHang = new KhachHang({
            soDienThoai: '123456789'  // Simulated input data
        });

        khachHang.save().then(function () {
                done();
        }).catch(function(err){
            done(err);
        })
    });

    // Test: Find a KhachHang by soDienThoai
    it('Tim Khach Hang', function (done) {
        const  soDienThoai= '123456789'  ;

        KhachHang.findOne({ soDienThoai: soDienThoai }).then(function (record) {
            if (record) {
                console.log('Khach hang da dang ky thanh vien:', record);
            } else {
                console.log('Khach hang chua ton tai.');
            }
            done();
        }).catch(function (err) {
            console.error('Đã xảy ra lỗi khi tìm khach hang:', err);
            done(err);
       
        });
    });

});
