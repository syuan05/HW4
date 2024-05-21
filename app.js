var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// 在 express.js 中，使用 sqlite3 來操作數據庫，並開啟位置在 db/sqlite.db 的資料庫，需要確認是否成功打開資料庫
const sqlite3 = require('sqlite3').verbose();   // 載入 sqlite3

let db = new sqlite3.Database('db/sqlite.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the sqlite database.');
});

// 撰寫 /api/quotes 路由，使用 SQL 來查詢所有的油價資料
app.get('/api/quotes', (req, res) => {
    db.all('SELECT * FROM oil_price', (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

// 根据油种名称查询历史油价数据的 API
app.get('/api/quotes/:type', (req, res) => {
    const type = req.params.type;
    const columns = {
        '92': 'unleaded_92',
        '95': 'unleaded_95',
        '98': 'unleaded_98',
        'diesel': 'premium_diesel'
    };
    const column = columns[type];
    if (!column) {
        res.status(400).json({"error": "Invalid fuel type"});
        return;
    }
    db.all(`SELECT adjustment_date, ${column} AS price FROM FuelPrices ORDER BY adjustment_date DESC`, (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

module.exports = app;

// 监听端口
var port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(` ${port} `);
});
