const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const NhaCungCapSchema = new Schema({
    tenNhaCungCap : {type : String },
    diaChi:  {type : String}, 
    soDienThoai:  {type : String}, 
    sanPhamCungCaps: [{
        sanPham: { type: mongoose.Schema.Types.ObjectId, ref : 'SanPham'},
        soLuong: { type: Number, default: 0 },
    }]
});

const NhaCungCap = mongoose.model('NhaCungCap', NhaCungCapSchema);

module.exports = NhaCungCap;
