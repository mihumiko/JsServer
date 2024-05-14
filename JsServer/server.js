const express = require('express');
const fs = require('fs');
const app = express();
const port = 8080;
const host = '25.52.242.153';

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Разрешаем доступ с любых доменов
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Разрешаем указанные HTTP-методы
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Разрешаем указанные заголовки
    res.setHeader('Access-Control-Allow-Credentials', true); // Разрешаем передачу куки (если используются)
    next();
});

//all_groups
app.get('/all_groups', (req, res) => {

    const path = 'D:/code/Server/Server/ALL_GROUPS'; 
    fs.readdir(path, (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).send('Read error');
        } else {
            res.status(200).send(files.map((p) => translateGroup(p.split('.').slice(0, -1).join('.'))));
        }
    });
});

//group_number
app.post('/group_number', (req, res) => {

    const body = req.body();
    const number = body.group;
    const path = `D:/code/Server/Server/ALL_GROUPS/${number}.json`; 

    let data = fs.readFileSync(path, 'utf8');

    res.json(data);
});

app.listen(port, host, () => {
    console.log(`Example app listening on port :${port}`);
});

function translateGroup(value) {
    let translate = {
        A: 'А',
        B: 'Б',
        V: 'В',
        O: 'О',
        M: 'М',
        E: 'Е',
        I: 'И',
        C: 'С',
        R: 'Р',
    };
    let a = Object.keys(translate);

    return [...value.slice(6)]
        .map((v) => (a.includes(v) ? translate[v] : v))
        .join('');
}