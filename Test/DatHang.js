const mongoose = require('mongoose');
const assert = require('assert');
const DatHang = require('../Models/DatHang');
const NhanVien = require('../Models/NhanVien');
const NhaCungCap = require('../Models/NhaCungCap');
const ChamCong = require('../Models/ChamCong'); // Import missing ChamCong model
const SanPham = require('../Models/SanPham'); // Import missing SanPham model

describe('Dat hang', function () {
    it('should handle order placement correctly', async function () {
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

            // Thiết lập dữ liệu sản phẩm
            const sanPham1 = new SanPham({ maSanPham: '1', giaBan: 100, soLuongTonKho: 10 });
            const sanPham2 = new SanPham({ maSanPham: '2', giaBan: 200, soLuongTonKho: 20 });
            await sanPham1.save();
            await sanPham2.save();

            // Thiết lập dữ liệu nhà cung cấp
            const nhaCungCap = new NhaCungCap({ tenNhaCungCap: 'Nha Cung Cap 1', soDienThoai: '0246255' });
            await nhaCungCap.save();

            // Thiết lập dữ liệu đặt hàng
            const datHang = new DatHang({
                sanPhamDat: [
                    { sanPham: sanPham1._id, soLuong: 1 },
                    { sanPham: sanPham2._id, soLuong: 2 }
                ],
                nhanVien: nhanVien._id,
                nhaCungCap: nhaCungCap._id
            });

            // Lưu dữ liệu đặt hàng
            const savedDatHang = await datHang.save();

            // Kiểm tra thông tin đặt hàng
            const record = await DatHang.findById(savedDatHang._id)
                .populate('nhanVien')
                .populate('nhaCungCap')
                .exec();

            assert(record !== null); // Đảm bảo thông tin đặt hàng đã được lưu
            assert(record.sanPhamDat.length === 2); // Kiểm tra số lượng sản phẩm trong đơn đặt hàng
            assert(record.nhanVien.soCCCD === '123456789'); // Kiểm tra mã nhân viên
            assert(record.nhaCungCap.soDienThoai === '0246255'); // Kiểm tra số điện thoại nhà cung cấp

            console.log(record);

        } catch (err) {
            console.error('Error:', err);
            throw err;
        }
    });
});
