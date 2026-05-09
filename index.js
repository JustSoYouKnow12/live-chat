import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
console.log(dirname);

app.use(express.static(path.join(dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(dirname, 'views'));

const data = [];


app.post('/join', (req, res) => {
    const nickname = req.body.nickname;
    data.push({
        nickname: 'System',
        message: 'Welcome ' + nickname,
        datetime: new Date()
    })
    res.render('chat', { nickname });
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});