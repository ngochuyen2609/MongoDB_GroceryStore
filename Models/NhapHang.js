const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const NhapHangSchema = new Schema({
    danhSachSanPham: [{
        sanPham : {type: mongoose.Schema.Types.ObjectId,ref:'SanPham'},
        soLuong:  Number, 
    }],
    nhanVienNhapHang: { type: Schema.Types.ObjectId, ref: 'NhanVien'},
    ngayNhap: { type: Date, default: Date.now }, 
    giaNhap: { type: Number},
    nhaCungCap: { type: String }
});

const NhapHang = mongoose.model('NhapHang', NhapHangSchema);

module.exports = NhapHang;
