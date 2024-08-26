const mongoose = require('mongoose');
const assert = require('assert');
const NhapHang = require('../Models/NhapHang');
const NhanVien = require('../Models/NhanVien');
const SanPham = require('../Models/SanPham');
const ChamCong = require('../Models/ChamCong'); // Import missing ChamCong model

describe('Nhap hang', function () {
    it('should handle inventory correctly when nhập hàng', async function () {
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

            // Thiết lập dữ liệu nhập hàng
            const nhapHang = new NhapHang({
                danhSachSanPham: [
                    { sanPham: sanPham1._id, soLuong: 1 },  // Use _id to reference existing products
                    { sanPham: sanPham2._id, soLuong: 2 }
                ],
                nhanVienNhapHang: nhanVien._id
            });

            // Lưu dữ liệu nhập hàng
            const savedNhapHang = await nhapHang.save();

            // Xử lý danh sách sản phẩm
            const promises = savedNhapHang.danhSachSanPham.map(async (item) => {
                const sanPham = await SanPham.findById(item.sanPham).exec();
                if (sanPham) {
                    // Nếu sản phẩm đã tồn tại, tăng số lượng sản phẩm đó
                    await SanPham.updateOne({ _id: sanPham._id }, { $inc: { soLuongTonKho: item.soLuong } });
                    console.log(`Tăng số lượng sản phẩm ${sanPham.tenSanPham} lên ${item.soLuong}`);
                } else {
                    // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới vào danh sách
                    let newSanPham = new SanPham({ maSanPham: item.sanPham, soLuongTonKho: item.soLuong });
                    await newSanPham.save();
                    console.log(`Thêm sản phẩm mới ${newSanPham.maSanPham}`);
                }
            });
            await Promise.all(promises);

            // Kiểm tra kết quả
            assert.strictEqual(savedNhapHang.danhSachSanPham.length, 2);
            assert.strictEqual(savedNhapHang.nhanVienNhapHang.toString(), nhanVien._id.toString());

            console.log(savedNhapHang);

        } catch (err) {
            console.error('Error:', err);
            throw err;
        }
    });
});
