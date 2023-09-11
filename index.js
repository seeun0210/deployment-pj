const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
dotenv.config();

const app = express();
const db = require('./models');
const PORT = process.env.PORT || 8888;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false, // 세션 데이터가 변경되지 않더라도 세션을 다시 저장할 지 여부(default:true)
    saveUninitialized: true, // 세션 데이터가 초기화 되지 않은 상태에서도 세션을 저장할 지 여부,
    // 초기화 되지 않은 세션 데이터? -> 세션을 시작한 후 데이터를 저장하지 않는 상태
    cookie: {
      httpOnly: true,
      maxAge: 60 * 1000, // 1분
    },
  })
);

const userRouter = require('./routes/user');
app.use('/', userRouter);

app.get('*', (req, res) => {
  res.render('404');
});

db.sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
});
