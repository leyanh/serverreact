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

// http://localhost:4000/admin/sp
router.get("/sp", (req, res) => {
  let sql = `SELECT id_sp, ten_sp, gia,gia_km, hinh, ngay, soluotxem FROM sanpham ORDER By ngay desc`;
  db.query(sql, (err, data) => {
    if (err) res.json({ thongbao: "loi lay list sp", err });
    else res.json(data);
  });
});
// http://localhost:4000/admin/sp/1
router.get("/sp/:id", (req, res) => {
  let id = parseInt(req.params.id);
  if (id <= 0) {
    res.json({ thongbao: "Khong biet san pham", id: id });
    return;
  }
  let sql = `SELECT * FROM sanpham WHERE id_sp =?`;
  db.query(sql, id, (err, data) => {
    if (err) res.json({ thongbao: "Loi lay san pham", err });
    else res.json(data[0]);
  });
});

// http://localhost:4000/admin/sp
router.post("/sp", (req, res) => {
  let data = req.body;
  let sql = "INSERT INTO sanpham SET ?";
  db.query(sql, data, (err, data) => {
    if (err) res.json({ thongbao: "Loi chen 1 san pham", err });
    else res.json({ thongbao: "Da chen 1 san pham", id_sp: data.insertId });
  });
});
// http://localhost:4000/admin/sp/5001
router.put("/sp/:id_sp", (req, res) => {
  console.log("PUT request received");
  let data = req.body;
  let id = req.params.id_sp;
  console.log("id_sp:", id);
  let sql = `UPDATE sanpham SET ? WHERE id_sp = ?`;
  db.query(sql, [data, id], (err, data) => {
    if (err) res.json({ thongbao: "Loi cap nhat san pham", err });
    else res.json({ thongbao: "Da cap nhat san pham" });
  });
});
// http://localhost:4000/admin/sp/5001
router.delete("/sp/:id_sp", (req, res) => {
  let id = req.params.id_sp;
  let sql = `DELETE FROM sanpham WHERE id_sp = ?`;
  db.query(sql, id, (err, data) => {
    if (err) res.json({ thongbao: "Loi xoa san pham", err });
    else res.json({ thongbao: "Da xoa san pham" });
  });
});

module.exports = router;
