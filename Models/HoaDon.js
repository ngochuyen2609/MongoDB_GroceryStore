const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HoaDonSchema = new Schema({
    maHoaDon: String, 
    nhanVienLamHoaDon: { type: mongoose.Schema.Types.ObjectId, ref: 'NhanVien' },
    thoiGian: { type: Date, default: Date.now }, 
    danhSachSanPham: [{
        sanPham: { type: mongoose.Schema.Types.ObjectId, ref: 'SanPham' },
        soLuong: Number, 
    }],
    khachHang: { type: mongoose.Schema.Types.ObjectId, ref: 'KhachHang' },
    tongTien: { type: Number }
}, { collection: 'hoadons' });

// Pre-save hook to calculate tongTien
HoaDonSchema.pre('save', async function(next) {
    const hoaDon = this;

    hoaDon.tongTien = 0;

    // Create an array of promises to get the price of each product
    const promises = hoaDon.danhSachSanPham.map(async (item, index) => {
        // Populate the sanPham field
        await hoaDon.populate({
            path: `danhSachSanPham.${index}.sanPham`,
            select: 'giaBan'
        });

        // Calculate tongTien
        if (item.sanPham && item.sanPham.giaBan) {
            hoaDon.tongTien += item.sanPham.giaBan * item.soLuong;
        }
    });

    // Wait for all promises to resolve
    await Promise.all(promises);

    next();
});

const HoaDon = mongoose.model('HoaDon', HoaDonSchema);

module.exports = HoaDon;
