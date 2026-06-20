import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { writeFile, readFile } from 'fs/promises';

const app = express();

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);



app.use(express.static(path.join(dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(dirname, 'views'));
let MessageId = 1;
const data = [];
const users = []
try {
    const rawData = await readFile('chat_history.json', 'utf-8');
    const jsonData = JSON.parse(rawData);        
    users.push(...jsonData.users);
    data.push(...jsonData.history);   
    MessageId = Math.max(...data.map(d => d.id))+1;

} catch (err) {
        if (err.code === 'ENOENT') {
            console.log('File not found. Fresh file installed.');
        }
        else {
            throw err;
        }
}



app.post('/join', async (req, res) => {
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

    await writeFile('chat_history.json', JSON.stringify({ users: users, 
    history: data }, null, 2));

    res.render('chat', { nickname, lastMessageId: lastMessageId-1});
});

app.post('/send', async (req, res) => {
    const msg = req.body.messageContent;
    const nickname = req.body.nickname;
    data.push({
        id: MessageId++,
        nickname,
        message: msg,
        datetime: new Date()
    });
    await writeFile('chat_history.json', JSON.stringify({ users: users, 
    history: data }, null, 2));
    
    res.send('OK');
});

app.get('/poll', (req, res) => {
    const lastMessageId = Number(req.query.lastMessageId);

    res.status(200).json(data.filter(d => d.id > lastMessageId));
});

app.get('/check/nickname', (req, res) => {
    const foundIndex = users.findIndex(u => u.toLowerCase() === req.query.nickname.toLowerCase());
    res.status(200).json({ result: foundIndex >= 0 });
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});