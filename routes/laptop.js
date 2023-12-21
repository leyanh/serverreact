var express = require("express");
var router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "laptop_react",
});
db.connect(() => console.log("Connect database !"));
// http://localhost:4000/laptop/sp
router.get("/sp", function (req, res) {
  let sql =
    "SELECT id_sp, ten_sp, gia, gia_km, hinh, ngay, soluotxem, hot FROM sanpham";
  db.query(sql, (err, data) => {
    if (err) {
      res.json({ "thong bao": "Lỗi lấy danh sách sản phẩm", err });
    } else {
      res.json(data);
    }
  });
});
//http://localhost:4000/laptop/moi/2
router.get("/moi/:sosp?", function (req, res) {
  let sosp = parseInt(req.params.sosp || 1);
  if (sosp <= 1) sosp = 1;
  let sql =
    "SELECT id_sp, ten_sp, gia, hinh, ngay soluotxem FROM sanpham ORDER BY ngay desc LIMIT 0, ?";
  db.query(sql, sosp, (err, data) => {
    if (err) res.json({ "thong bao": "Loi lay list sp", err });
    else res.json(data);
  });
});

// http://localhost:4000/laptop/sp/1
router.get("/sp/:id", function (req, res) {
  let id = parseInt(req.params.id);
  if (id <= 0) {
    res.json({ "thong bao": "Khong tim thay san pham", id: id });
    return;
  }
  let sql = "SELECT * FROM sanpham WHERE id_sp = ?";
  db.query(sql, id, (err, data) => {
    if (err) res.json({ "thong bao": "Loi lay san pham", err });
    else res.json(data[0]);
  });
});
// http://localhost:4000/laptop/sptrongloai/1
router.get("/sptrongloai/:id_loai", function (req, res) {
  let id_loai = parseInt(req.params.id_loai);
  if (id_loai <= 0) {
    res.json({ "thong bao": "Khong tim thay loai", id_loai: id_loai });
    return;
  }
  let sql =
    "SELECT id_sp, ten_sp, gia, gia_km, hinh, hot, ngay FROM sanpham WHERE id_loai=? ORDER by id_sp desc";
  db.query(sql, id_loai, (err, data) => {
    if (err) res.json({ "thong bao": "Loi lay san pham trong loai", err });
    else res.json(data);
  });
});

// http://localhost:4000/laptop/loai/
router.get("/loai", function (req, res) {
  let sql = "SELECT id_loai, ten_loai FROM loai";

  db.query(sql, (err, data) => {
    if (err) {
      console.error("Lỗi truy vấn SQL loai:", err);
      res.json({ "thong bao": "Có lỗi xảy ra khi lấy thông tin loại" });
    } else {
      res.json(data);
    }
  });
});
// http://localhost:4000/laptop/loai/1
router.get("/loai/:id_loai", function (req, res) {
  let id_loai = parseInt(req.params.id_loai);
  let sql = "SELECT id_loai, ten_loai FROM loai WHERE id_loai= ?";
  db.query(sql, id_loai, (err, data) => {
    if (err) res.json({ "thong bao": "Loi lay loai", err });
    else res.json(data[0]);
  });
});

// http://localhost:4000/laptop/sanpham/search?query=MSI
router.get("/sanpham/search", function (req, res) {
  const query = req.query.query;
  if (!query) {
    res.json({ "thong bao": "Vui lòng nhập từ khóa tìm kiếm" });
    return;
  }
  let sql = "SELECT * FROM sanpham WHERE ten_sp LIKE ?";
  db.query(sql, [`%${query}%`], (err, data) => {
    if (err) {
      console.error("Lỗi truy vấn SQL search:", err);
      res.json({ "thong bao": "Có lỗi xảy ra khi tìm kiếm sản phẩm" });
    } else {
      res.json(data);
    }
  });
});
// Cart
router.post("/luudonhang/", (req, res) => {
  let data = req.body;
  let sql = `INSERT INTO don_hang SET ?`;
  db.query(sql, data, (err, data) => {
    if (err) res.json({ id_dh: -1, thongbao: "loi luu don hang" }, err);
    else {
      id_dh = data.inserId;
      res.json({ id_dh: id_dh, thongbao: "da luu don hang" });
    }
  });
});

router.post("/luugiohang/", (req, res) => {
  let data = req.body;
  let sql = `INSERT INTO don_hang_chi_tiet SET ?`;
  db.query(sql, data, (err, data) => {
    if (err) res.json({ thongbao: "loi luu sp" }, err);
    else res.json({ thongbao: "Da luu sp vao db", id_sp: data.id_sp });
  });
});

module.exports = router;
