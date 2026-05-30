import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
console.log(dirname);

app.use(express.static(path.join(dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(dirname, 'views'));

let MessageId = 1;
const data = [];
const users = [];

app.post('/join', (req, res) => {
    const nickname = req.body.nickname;
    users.push(nickname);
    const lastMessageId = MessageId++;
    data.push({
        id: lastMessageId,
        nickname: 'System',
        message: 'Welcome ' + nickname,
        datetime: new Date()
    })
    users.push(nickname);

    res.render('chat', { nickname, lastMessageId: lastMessageId-1});
});

app.post('/send', (req, res) => {
    const msg = req.body.messageContent;
    const nickname = req.body.nickname;
    console.log(msg, ', ', nickname);
    data.push({
        id: MessageId++,
        nickname,
        message: msg,
        datetime: new Date()
    })
    res.send('OK');
});

app.get('/poll', (req, res) => {
    console.log(req.query.lastMessageId);
    const lastMessageId = Number(req.query.lastMessageId);

    res.status(200).json(data.filter(d => d.id > lastMessageId));
});

app.get('/check/nickname', (req, res) => {
    console.log(req.query.nickname);
    const foundIndex = users.findIndex(u => u.toLowerCase() === req.query.nickname.toLowerCase());
    res.status(200).json({ result: foundIndex >= 0 });
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});