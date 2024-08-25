const mongoose = require('mongoose');
const assert = require('assert');
//assert dùng để thực hiện các kiểm tra điều kiện trong kiểm thử.
const NhanVien = require('../Models/NhanVien');
const ChamCong = require('../Models/ChamCong');


describe('Quan ly nhan vien', function () {
    // Trước mỗi test,xóa bỏ dữ liệu trong collection 
    before(function (done) {
        mongoose.connection.collections.nhanviens.drop(function () {
            done();
        });
    });

    //Thiet lap du lieu
    before('Thiet lap du lieu nhan vien', function (done) {
        const nhanVien = new NhanVien({
            soCCCD: '123456789'
        });

        nhanVien.save().then(function () {
                const chamCong = new ChamCong({
                    nhanVien: nhanVien._id,
                    batDau: new Date('2024-08-12T06:00:00Z'),
                    ketThuc: new Date('2024-08-12T22:00:00Z'),
                });

                return chamCong.save();
            }).then(function () {
                done();
            }).catch(function (err) {
                done(err);
            });
    });


    // Kiểm thử: Tìm nhân viên theo soCCCD
    it('Tim nhan vien theo CCCD', function (done) {
        const nhanVien = new NhanVien({
            soCCCD: '123456789'
        });

        // Giả sử bạn muốn tìm nhân viên với số CCCD 
        NhanVien.findOne({ soCCCD: nhanVien.soCCCD }).then(function (record) {
            if (record) {
                console.log('Nhân viên đã được tìm thấy:', record);
            } else {
                console.log('Không tìm thấy nhân viên.');
            }
            done();
        }).catch(function (err) {
            console.error('Đã xảy ra lỗi khi tìm nhân viên:', err);
            done(err);
        });
    });
    
    // Kiểm thử: Tìm nhân viên theo thời gian
    it('Tìm nhân viên theo thời gian', function (done) {
        // Tìm tất cả các tài liệu có batDau nằm trong ngày 2024-08-12
        const startDate = new Date('2024-08-12T00:00:00Z');
        const endDate = new Date('2024-08-13T00:00:00Z');
                
        // Giả sử bạn muốn tìm các tài liệu có batDau trong khoảng thời gian
        ChamCong.find({batDau: { $gte: startDate, $lt: endDate }}).populate('nhanVien').then(function (records) {
            if (records.length > 0) {
                console.log('Nhân viên đã được tìm thấy:', records.map(record => record.nhanVien));
            } else {
                console.log('Không tìm thấy nhân viên.');
            }
            done();
        }).catch(function (err) {
            console.error('Đã xảy ra lỗi khi tìm nhân viên:', err);
            done(err);
        });
    });

    // Kiểm thử: Xóa nhân viên
   
    it('Xoa nhan vien', function (done) {
        const nhanVien = new NhanVien({
            soCCCD: '123456789'
        });

        NhanVien.deleteOne({ soCCCD: nhanVien.soCCCD }).then(function () {
            return NhanVien.findOne({ soCCCD: nhanVien.soCCCD });
        }).then(function (record) {
            assert(record === null); // Kiểm tra xem nhân viên đã bị xóa chưa
            done();
        }).catch(function (err) {
            done(err);
        });
    });

});
