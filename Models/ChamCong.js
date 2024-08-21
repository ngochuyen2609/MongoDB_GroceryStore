const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const ChamCongSchema = new Schema({
    batDau: { type: Date, default: Date.now },
    ketThuc: { type: Date }, 
    tinhTrang: { type: String },
    nhanVien: { type: mongoose.Schema.Types.ObjectId, ref: 'NhanVien', required: true },
    thoiGianLam: { type: Number }, // đơn vị là giờ
});

// Pre-save hook để tính toán thời gian làm việc và cập nhật tình trạng
ChamCongSchema.pre('save', async function(next) {
    const chamCong = this;

    // Kiểm tra xem ketThuc có tồn tại không
    if (chamCong.ketThuc != null) {
        chamCong.tinhTrang = 'Da ket thuc ca';
        chamCong.thoiGianLam = chamCong.ketThuc.getHours - chamCong.batDau.getHours;
    }

    next();
});

const ChamCong = mongoose.model('ChamCong', ChamCongSchema);

module.exports = ChamCong;
