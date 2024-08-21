const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const SanPhamSchema = new Schema({
    maSanPham: String, 
    tenSanPham:  String, 
    phanLoai:  String ,
    giaBan: Number, 
    nhaSanXuat:  String, 
    soLuongTonKho:  Number, 
    ngaySanXuat:  Date ,
    hanSuDung:  Date ,
    khuyenMai : String,
});

const SanPham = mongoose.model('SanPham', SanPhamSchema);

module.exports = SanPham;
