const fs = require('fs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();

const port = 8080;
const host = '26.35.147.101';
const tokenKey = 'Propusk';
const tokenExpiredTime = 60;

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*'); // Разрешаем доступ с любых доменов
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST'); // Разрешаем указанные HTTP-методы
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Разрешаем указанные заголовки
	res.setHeader('Access-Control-Allow-Credentials', true); // Разрешаем передачу куки (если используются)
	next();
});

app.use(bodyParser.json());

app.listen(port, host, () => {
	console.log(`Example app listening on port : ${port}`);
});

//all_groups
app.get('/all_groups', (req, res) => {
	const path = './ALL_GROUPS';
	fs.readdir(path, (err, files) => {
		if (err) {
			console.error(err);
			res.status(500).send('Read error');
		} else {
			res.status(200).send({
				groups: files.map((p) =>
					translateGroup(p.split('.').slice(0, -1).join('.'))
				),
			});
		}
	});
});

//group_number
app.post('/group_number', (req, res) => {
	const body = req.body;
	const number = body.group;

	const path = `./ALL_GROUPS/${number}.json`;
	console.log(path);

	let data = fs.readFileSync(path, 'utf8');

	//res.json(JSON.parse(data));
	res.send({ id: number, lessons: JSON.parse(data) });
});

//edit
app.post('/edit', (req, res) => {
	const token = req.headers.authorization;
	console.log(token);
	if (!checkJWT(token)) {
		return res.status(401).send({ messege: 'Invalid JWT token' });
	}
	const body = req.body;
	const id = body.id;
	const path = `./ALL_GROUPS/${id}.json`;

	fs.writeFileSync(path, JSON.stringify(body.group));
	res.status(200).send({ massege: 'Edited' });
	console.log(body);
});

//login
app.post('/login', (req, res) => {
	const path = 'Users.json';

	const data = fs.readFileSync(path, 'utf8');
	const users = JSON.parse(data);

	const { name, password } = req.body;
	console.log(name, password);
	const user = users.find((u) => u.login === name && u.password === password);

	if (!user) {
		return res.status(401).json({ message: 'Invalid username or password' });
	}

	const token = jwt.sign({ name }, tokenKey, { expiresIn: tokenExpiredTime });

	res.status(200).json({ token });
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

	return [...value].map((v) => (a.includes(v) ? translate[v] : v)).join('');
}

function checkJWT(JWTValue) {
	if (!JWTValue) {
		return false;
	}

	if (!jwt.verify(JWTValue, tokenKey)) {
		return false;
	}
	return true;
}
