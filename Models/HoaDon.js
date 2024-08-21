const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const HoaDonSchema = new Schema({
    maHoaDon: String, 
    nhanVienLamHoaDon: { type: mongoose.Schema.Types.ObjectId, ref: 'NhanVien', require: true },
    thoiGian: { type: Date, default: Date.now }, 
    danhSachSanPham: [{
        sanPham: { type: mongoose.Schema.Types.ObjectId, ref: 'SanPham' },
        soLuong: Number, 
    }],
    khachHang: { type: mongoose.Schema.Types.ObjectId, ref: 'KhachHang' },
    tongTien: { type: Number }
});

// Pre-save hook to calculate tongTien
//dung async =>> Lap trinh bat dong bo ,tự động trả về một Promise
HoaDonSchema.pre('save', async function(next) {
    const hoaDon = this;

    hoaDon.tongTien = 0;

    // Calculate total price
    for (let item of hoaDon.danhSachSanPham) {
        //await =>> tạm dừng thực hiện hàm cho đến khi một Promise được giải quyết
        //populate =>>truy xuất thông tin tu SanPham
        await hoaDon.populate({
            //path: doi tuong muon truy xuat va thay doi du lieu
            path: `danhSachSanPham.${hoaDon.danhSachSanPham.indexOf(item)}.sanPham`,
            //select: truong muon truy xuat
            select: 'giaBan'
        }).execPopulate();

        // Calculate tongTien
        if (item.sanPham && item.sanPham.giaBan) {
            hoaDon.tongTien += item.sanPham.giaBan * item.soLuong;
        }
    }

    next();
});

const HoaDon = mongoose.model('HoaDon', HoaDonSchema);

module.exports = HoaDon;
