const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');

const app = express();

const pool = mysql.createPool({
  host: 'kolei.ru',
  user: 'nzaskupin',
  password: '230104',
  database: 'nzaskupin'
});

app.use(cors());
app.use(bodyParser.json());

const secretKey = 'ваш_секретный_ключ'; // Замените на ваш секретный ключ
const blacklistedTokens = new Set(); // Черный список токенов

// Middleware для проверки токена
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send({ error: 'Токен не предоставлен' });

  if (blacklistedTokens.has(token)) {
    return res.status(403).send({ error: 'Токен недействителен' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).send({ error: 'Недействительный токен' });
    req.user = user;
    next();
  });
};

// API для регистрации
app.post('/register', (req, res) => {
  const { name, phoneNumber, password, birthday, genderId, surname, patronymic } = req.body;

  if (genderId !== 1 && genderId !== 2) {
    return res.status(400).send({ error: 'Неправильное значение для пола' });
  }

  pool.query(
    'INSERT INTO KpUser (name, phoneNumber, password, birthday, genderId, surname, patronymic) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, phoneNumber, password, birthday, genderId, surname, patronymic],
    (error, results) => {
      if (error) {
        console.error('Ошибка при регистрации:', error);
        return res.status(500).send({ error: 'Что-то пошло не так при регистрации' });
      }

      const userId = results.insertId;
      const cardNumber = Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
      const cvvCode = Math.floor(100 + Math.random() * 900).toString();
      const balance = 5000; // начальный баланс

      pool.query(
        'INSERT INTO KpAccount (cardNumber, cvvCode, balance, userId) VALUES (?, ?, ?, ?)',
        [cardNumber, cvvCode, balance, userId],
        (error, accountResults) => {
          if (error) {
            console.error('Ошибка при создании счета:', error);
            return res.status(500).send({ error: 'Что-то пошло не так при создании счета' });
          }

          res.status(201).send({
            id: userId,
            name,
            phoneNumber,
            birthday,
            genderId,
            surname,
            patronymic,
            account: {
              cardNumber,
              cvvCode,
              balance
            }
          });
        }
      );
    }
  );
});

// API для входа
app.post('/login', (req, res) => {
  const { phoneNumber, password } = req.body;

  pool.query('SELECT * FROM KpUser WHERE phoneNumber = ?', [phoneNumber], (error, results) => {
    if (error) {
      console.error('Ошибка при входе:', error);
      return res.status(500).send({ error: 'Что-то пошло не так при входе' });
    }

    if (results.length === 0) {
      return res.status(401).send({ error: 'Неверный номер телефона или пароль' });
    }

    const user = results[0];

    if (password !== user.password) {
      return res.status(401).send({ error: 'Неверный номер телефона или пароль' });
    }

    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
    res.send({ token });
  });
});

// API для получения данных текущего пользователя (с аутентификацией)
app.get('/me', authenticateToken, (req, res) => {
  const userId = req.user.userId;

  const query = `SELECT 
      KpUser.id, KpUser.name, KpUser.phoneNumber, KpUser.birthday, 
      KpUser.genderId, KpUser.surname, KpUser.patronymic,
      KpAccount.cardNumber, KpAccount.Balance, KpAccount.cvvCode
    FROM KpUser
    LEFT JOIN KpAccount ON KpUser.id = KpAccount.userId
    WHERE KpUser.id = ?
  `;

  pool.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Ошибка при получении данных пользователя:', error);
      return res.status(500).send({ error: 'Что-то пошло не так при получении данных' });
    }

    if (results.length === 0) {
      return res.status(404).send({ error: 'Пользователь не найден' });
    }

    const user = results[0];
    res.send(user);
  });
});

//API для перевода по карте
app.post('/TransferPoKarte', authenticateToken, (req, res) => {
  const { cardNumber, amount } = req.body;
  const senderId = req.user.userId;

  if (!cardNumber || !amount || amount <= 0) {
    return res.status(400).send({ error: 'Неверные параметры перевода' });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Ошибка подключения к базе данных:', err);
      return res.status(500).send({ error: 'Ошибка сервера' });
    }

    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        console.error('Ошибка начала транзакции:', err);
        return res.status(500).send({ error: 'Ошибка сервера' });
      }

      // Шаг 1: Проверка существования получателя
      connection.query('SELECT userId FROM KpAccount WHERE cardNumber = ?', [cardNumber], (error, results) => {
        if (error || results.length === 0) {
          connection.rollback(() => {
            connection.release();
            return res.status(404).send({ error: 'Получатель не найден' });
          });
        } else {
          const recipientId = results[0].userId;

          // Шаг 2: Получение счета отправителя и проверка баланса
          connection.query('SELECT balance FROM KpAccount WHERE userId = ?', [senderId], (error, results) => {
            if (error || results.length === 0 || results[0].balance < amount) {
              connection.rollback(() => {
                connection.release();
                return res.status(400).send({ error: 'Недостаточно средств для перевода' });
              });
            } else {
              const senderBalance = results[0].balance;

              // Шаг 3: Обновление баланса отправителя
              connection.query('UPDATE KpAccount SET balance = balance - ? WHERE userId = ?', [amount, senderId], (error) => {
                if (error) {
                  connection.rollback(() => {
                    connection.release();
                    return res.status(500).send({ error: 'Ошибка при обновлении баланса отправителя' });
                  });
                } else {
                  // Шаг 4: Обновление баланса получателя
                  connection.query('UPDATE KpAccount SET balance = balance + ? WHERE userId = ?', [amount, recipientId], (error) => {
                    if (error) {
                      connection.rollback(() => {
                        connection.release();
                        return res.status(500).send({ error: 'Ошибка при обновлении баланса получателя' });
                      });
                    } else {
                      connection.commit((err) => {
                        if (err) {
                          connection.rollback(() => {
                            connection.release();
                            return res.status(500).send({ error: 'Ошибка при подтверждении транзакции' });
                          });
                        } else {
                          connection.release();
                          res.status(200).send({ message: 'Перевод выполнен успешно' });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    });
  });
});

//Api для перевода
app.post('/transferFromTo', authenticateToken, (req, res) => {
  const { phoneNumber, amount } = req.body;
  const senderId = req.user.userId;

  if (!phoneNumber || !amount || amount <= 0) {
    return res.status(400).send({ error: 'Неверные параметры перевода' });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Ошибка подключения к базе данных:', err);
      return res.status(500).send({ error: 'Ошибка сервера' });
    }

    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        console.error('Ошибка начала транзакции:', err);
        return res.status(500).send({ error: 'Ошибка сервера' });
      }

      // Шаг 1: Проверка существования получателя
      connection.query('SELECT id FROM KpUser WHERE phoneNumber = ?', [phoneNumber], (error, results) => {
        if (error || results.length === 0) {
          connection.rollback(() => {
            connection.release();
            return res.status(404).send({ error: 'Получатель не найден' });
          });
        } else {
          const recipientId = results[0].id;

          // Шаг 2: Получение счета отправителя и проверка баланса
          connection.query('SELECT balance FROM KpAccount WHERE userId = ?', [senderId], (error, results) => {
            if (error || results.length === 0 || results[0].balance < amount) {
              connection.rollback(() => {
                connection.release();
                return res.status(400).send({ error: 'Недостаточно средств для перевода' });
              });
            } else {
              const senderBalance = results[0].balance;

              // Шаг 3: Обновление баланса отправителя
              connection.query('UPDATE KpAccount SET balance = balance - ? WHERE userId = ?', [amount, senderId], (error) => {
                if (error) {
                  connection.rollback(() => {
                    connection.release();
                    return res.status(500).send({ error: 'Ошибка при обновлении баланса отправителя' });
                  });
                } else {
                  // Шаг 4: Обновление баланса получателя
                  connection.query('UPDATE KpAccount SET balance = balance + ? WHERE userId = ?', [amount, recipientId], (error) => {
                    if (error) {
                      connection.rollback(() => {
                        connection.release();
                        return res.status(500).send({ error: 'Ошибка при обновлении баланса получателя' });
                      });
                    } else {
                      connection.commit((err) => {
                        if (err) {
                          connection.rollback(() => {
                            connection.release();
                            return res.status(500).send({ error: 'Ошибка при подтверждении транзакции' });
                          });
                        } else {
                          connection.release();
                          res.status(200).send({ message: 'Перевод выполнен успешно' });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    });
  });
});

// API для выхода
app.post('/logout', authenticateToken, (req, res) => {
  const token = req.headers['authorization'];
  blacklistedTokens.add(token);
  res.send({ message: 'Вы успешно вышли из аккаунта' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
