const mongoose = require('mongoose');
const assert = require('assert');
const HoaDon = require('../Models/HoaDon');
const NhanVien = require('../Models/NhanVien');

describe('Quan ly doanh thu', function () {

    it('Truy xuat doanh thu cua ca cua hang', async function () {
        try {
            const hoaDons = await HoaDon.find({}).exec();
            let sum = 0;
            hoaDons.forEach(hoaDon => {
                sum += hoaDon.tongTien;
            });

            console.log(`Tong doanh thu: ${sum}`);

            // Kiểm tra tổng doanh thu, ví dụ:
            assert(sum >= 0); // Kiểm tra tổng doanh thu có không âm

        } catch (err) {
            console.error('Error:', err);
            throw err;
        }
    });

    it('Truy xuat doanh thu cua 1 nhan vien', async function () {
        try {
            // Thiết lập dữ liệu nhân viên
            const nhanVien = new NhanVien({ soCCCD: '123456789' });
            await nhanVien.save();

            // Tìm doanh thu của nhân viên này
            const hoaDons = await HoaDon.find({ nhanVienLamHoaDon: nhanVien._id }).exec();
            let sum = 0;
            hoaDons.forEach(hoaDon => {
                sum += hoaDon.tongTien;
            });

            console.log(`Tong doanh thu cua nhan vien ${nhanVien.soCCCD}: ${sum}`);

            // Kiểm tra tổng doanh thu, ví dụ:
            assert(sum >= 0); // Kiểm tra tổng doanh thu có không âm

        } catch (err) {
            console.error('Error:', err);
            throw err;
        }
    });
});
