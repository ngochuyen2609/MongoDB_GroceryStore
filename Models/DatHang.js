const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const DatHangSchema = new Schema({
    maDonHang: { type: String},
    nhanVien: { type: mongoose.Schema.Types.ObjectId, ref: 'NhanVien' },  
    sanPhamDat: [{
        sanPham: { type: mongoose.Schema.Types.ObjectId, ref: 'SanPham'},
        soLuong: { type: Number, required: true }
    }],
    nhaCungCap :{ type: mongoose.Schema.Types.ObjectId, ref: 'NhaCungCap' },
    ngayDatHang: { type: Date, default: Date.now },
    trangThai: { type: String, default: 'Đang xử lý' }  // Trạng thái đơn hàng: Đang xử lý, Đã giao, Đã hủy, v.v.
});

const DatHang = mongoose.model('DatHang', DatHangSchema);

module.exports = DatHang;
