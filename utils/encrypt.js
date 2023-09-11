const bcrypt = require("bcrypt");
const saltRounds = 11; // 솔트 라운드 수 정의. 값이 클 수록 해시 생성에 시간이 길어짊. (비밀번호 추축이 어려워짐)

// 비밀번호 암호화 함수
const bcryptPassword = (password) => bcrypt.hash(password, saltRounds);

// 비밀번호 비교 함수
const compareFunc = (password, dbPassword) => bcrypt.compare(password, dbPassword);

module.exports = {
  bcryptPassword,
  compareFunc
}
