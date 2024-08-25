const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const NhanVienSchema = new Schema({
    ten: {type : String},
    soCCCD :{type : String },
    tuoi:  Number, 
    diaChi: String, 
    soDienThoai: {type : String},
    chucVu: {type : String}, 
    luong: { type: Number, default:0 },
    ngayBatDauLamViec:  {type : String, default : Date.now},
}, { collection: 'nhanviens' });

const NhanVien = mongoose.model('NhanVien', NhanVienSchema);

module.exports = NhanVien;
