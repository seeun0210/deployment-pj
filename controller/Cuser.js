const { User } = require("../models");
const { bcryptPassword, compareFunc } = require("../utils/encrypt");

exports.index = (req, res) => {
  res.render("index", { data: req.session.userInfo });
};

exports.getRegister = (req, res) => {
  res.render("register");
};

exports.getLogin = (req, res) => {
  res.render("login");
};

exports.getUsers = async (req, res) => {
  if (req.session.userInfo) {
    const result = await User.findAll();
    res.render("users", { name: req.session.userInfo.name, users: result });
  } else {
    res.redirect("/login");
  }
};

exports.getProfile = async (req, res) => {
  const result = await User.findOne({
    where: { id: req.session.userInfo.id }, // 세션으로 아이디 꺼내와서 한 명 조회
  });
  res.render("profile", { data: result });
};

exports.postRegister = async (req, res) => {
  try {
    const { pw, name, userid } = req.body;
    const hash = await bcryptPassword(pw); // 비밀번호 암호화하여 저장
    // console.log(pw, hash);
    await User.create({ userid, name, pw: hash });
    res.json({ result: true });
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error");
  }
};

exports.postLogin = async (req, res) => {
  try {
    // Step1. 아이디를 찾아서 사용자 존재 유무 체크
    const { userid, pw } = req.body;
    const user = await User.findOne({
      where: { userid },
    });

    // Step2. 입력된 비밀번호 암호화하여 기존 데이터와 비교
    if (user) {
      const result = await compareFunc(pw, user.pw); // true or false
      if (result) {
        req.session.userInfo = { name: user.name, id: user.id }; // 세션 생성
        res.json({ result: true, data: user });
      } else {
        res.json({ result: false, message: "비밀번호가 틀렸습니다." });
      }
    } else {
      res.json({ result: false, message: "존재하는 사용자가 없습니다" });
    }
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error");
  }
};

exports.patchProfile = async (req, res) => {
  try {
    const { name, pw, id } = req.body;
    await User.update({ name, pw }, { where: { id } });

    res.json({ result: true });
  } catch (err) {
    console.error(err);
    res.send("Internal Sever Error");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.body;
    await User.destroy({
      where: { id },
    });
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        return res.send("Internal Server Error");
      }
      res.json({ result: true });
    }); // 세션 삭제
  } catch (err) {
    console.error(err);
    res.send("Internal Sever Error");
  }
};
