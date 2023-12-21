var router = require("express").Router();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const PRIVATE_KEY = fs.readFileSync("private-key.txt");
// const mysql = require("mysql");
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "laptop_react",
// });
// db.connect(() => console.log("Connect database !"));
// http://localhost:4000/users/login
router.post("/login", (req, res) => {
  const { un, pw } = req.body;
  if (checkUserPass(un, pw)) {
    const userInfo = getUserInfo(un);
    const jwtBearerToken = jwt.sign({}, PRIVATE_KEY, {
      algorithm: "RS256",
      expiresIn: 120,
      subject: userInfo.id,
    });

    res.status(200).json({
      token: jwtBearerToken,
      expiresIn: 120,
      userInfo: userInfo,
    });
  } else {
    res.status(401).json({ thongbao: "Đăng nhập thất bại" });
  }
});

const checkUserPass = (un, pw) => {
  if (un === "wings" && pw === "123") {
    return true;
  }
  if (un === "wings01" && pw === "123") {
    return true;
  }
  return false;
};

const getUserInfo = (username) => {
  if (username === "wings") {
    return {
      id: "1",
      hoten: "Pham Quang Minh",
      username: "wings",
      avatar:
        "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1hbnxlbnwwfHwwfHx8MA%3D%3D",
      role: 0,
    };
  }
  if (username === "wings01") {
    return { id: "2", hoten: "Nguyễn Thị Lượm", role: 1 };
  }
  return { id: "-1", hoten: "" };
};
module.exports = router;
