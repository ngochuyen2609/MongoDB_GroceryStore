const mongoose = require('mongoose');
const assert = require('assert');
const NhanVien = require('../Models/NhanVien');
const HoaDon = require('../Models/HoaDon');
const KhachHang = require('../Models/KhachHang');
const SanPham = require('../Models/SanPham');
const ChamCong = require('../Models/ChamCong');

describe('Quan ly hoa don va ban hang', function () {
    // Trước mỗi test,xóa bỏ dữ liệu trong collection 
    before(function (done) {
        mongoose.connection.collections.hoadons.drop(function () {
            done();
        });
    });


    it('Ban hang va luu hoa don, dang ky khach hang thanh vien', async function () {
        try {
            // Thiết lập dữ liệu nhân viên
            const nhanVien = new NhanVien({ soCCCD: '123456789' });
            await nhanVien.save();

            // Thiết lập dữ liệu chấm công
            const chamCong = new ChamCong({
                nhanVien: nhanVien._id,
                batDau: new Date('2024-08-12T06:00:00Z'),
                ketThuc: new Date('2024-08-12T22:00:00Z'),
            });
            await chamCong.save();

            // Thiết lập dữ liệu khách hàng
            const khachHang = new KhachHang({ soDienThoai: '0123456789' });
            await khachHang.save();

            // Thiết lập dữ liệu sản phẩm
            const sanPham1 = new SanPham({ maSanPham: '1', giaBan: 100, soLuongTonKho: 10 });
            const sanPham2 = new SanPham({ maSanPham: '2', giaBan: 200, soLuongTonKho: 20 });
            await sanPham1.save();
            await sanPham2.save();

            // Thiết lập dữ liệu hóa đơn
            let hoaDon = new HoaDon({
                danhSachSanPham: [
                    { sanPham: sanPham1._id, soLuong: 1 },
                    { sanPham: sanPham2._id, soLuong: 2 }
                ],
                nhanVienLamHoaDon: nhanVien._id,
                khachHang: khachHang._id,
            });

            // Tìm nhân viên
            const nhanVienData = await NhanVien.findById(hoaDon.nhanVienLamHoaDon).exec();
            if (!nhanVienData) throw new Error('Không tìm thấy nhân viên');

            // Kiểm tra xem nhân viên có đang làm việc hay không
            const chamCongData = await ChamCong.findOne({
                nhanVien: nhanVienData._id,
                // batDau: { $lte: new Date() },
                // ketThuc: { $gte: new Date() }
            }).exec();
            if (!chamCongData) throw new Error('Nhân viên không đang làm việc');

            // Cập nhật nhanVienLamHoaDon trong hóa đơn
            hoaDon.nhanVienLamHoaDon = nhanVienData._id;
            const savedHoaDon = await hoaDon.save();


            // Xử lý danh sách sản phẩm
            const promises = savedHoaDon.danhSachSanPham.map(async (item, index) => {
                const sanPham = await SanPham.findById(item.sanPham).exec();
                if (sanPham) {
                    if (sanPham.soLuongTonKho > item.soLuong) {
                        await SanPham.updateOne({ _id: sanPham._id }, { $inc: { soLuongTonKho: -item.soLuong } });
                        savedHoaDon.danhSachSanPham[index].sanPham = sanPham._id;
                        console.log(`san pham duoc ban con: ${sanPham}`)
                    } else if (sanPham.soLuongTonKho === item.soLuong) {
                        await sanPham.deleteOne();
                        console.log('sold out');
                    } else {
                        console.log(`Không đủ sản phẩm ${item.sanPham}`);
                    }
                } else {
                    console.log(`Cửa hàng không có sản phẩm ${item.sanPham}`);
                }
    
            });
            await Promise.all(promises);

            // Xử lý khách hàng
            if (savedHoaDon.khachHang) {
                const khachHangData = await KhachHang.findById(savedHoaDon.khachHang).exec();
                if (khachHangData) {
                    await KhachHang.updateOne({ _id: khachHangData._id }, { $inc: { diemTichLuy: 1 } });
                } else {
                    const newKhachHang = new KhachHang({ soDienThoai: '0123456789', diemTichLuy: 1 });
                    await newKhachHang.save();
                    savedHoaDon.khachHang = newKhachHang._id;
                }
            }

            // Lưu lại hóa đơn
            await savedHoaDon.save();

            // Kiểm tra kết quả
            assert.strictEqual(savedHoaDon.danhSachSanPham.length, 2);
            assert.strictEqual(savedHoaDon.nhanVienLamHoaDon.toString(), nhanVien._id.toString());
            
            console.log(hoaDon);

        } catch (err) {
            console.error('Error:', err);
            throw err;
        }
    });

})
