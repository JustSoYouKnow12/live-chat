import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
console.log(dirname);

app.use(express.static(path.join(dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.post('/join', (req, res) => {
    const nickname = req.body.nickname;

    res.send('welcome ' + nickname);
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});