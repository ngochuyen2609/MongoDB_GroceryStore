const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const KhachHangThanhVienSchema = new Schema({
    ten: String,  
    soDienThoai:  {type : String, require:true},
    diemTichLuy:  {type:Number,default:0}, 
    ngayDangKy: {type : Date, default: Date.now}, 
}, { collection: 'khachhangs' });

const KhachHangThanhVien = mongoose.model('KhachHangThanhVien', KhachHangThanhVienSchema);

module.exports = KhachHangThanhVien;
