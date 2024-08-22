const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();
const port = 3000;

// PostgreSQL bağlantı bilgileri
const pool = new Pool({
  user: 'nezirdb_user',
  host: 'dpg-cpb3nfnsc6pc73a1rtug-a.frankfurt-postgres.render.com',
  database: 'nezirdb',
  password: 'vqhpBrHQ2K0T6eXtx1Ti3TrcLzlYcWSb',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

// Post verileri işlemek için
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ana sayfa
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Kayıt ekleme endpoint'i
app.post('/add-person', async (req, res) => {
  const { adi, soyadi, tel, tel_2, adres, aktif } = req.body;

  const query = `
    INSERT INTO kisiler_kisiler (adi, soyadi, tel, tel_2, adres, aktif, eklenme, guncellenme)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;
  const values = [adi, soyadi, tel, tel_2, adres, aktif || true, new Date(), new Date()];

  try {
    await pool.query(query, values);
    res.redirect('/');
  } catch (err) {
    console.error('Kayıt eklenirken hata oluştu:', err);
    res.status(500).send('Bir hata oluştu.');
  }
});

// Kişileri listeleme endpoint'i (JSON formatında veri döner)
app.get('/list-persons', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM kisiler_kisiler');
    res.json(result.rows); // JSON formatında veri döner
  } catch (err) {
    console.error('Kişiler listelenirken hata oluştu:', err);
    res.status(500).json({ error: 'Bir hata oluştu.' });
  }
});

// Sunucuyu başlat
app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} üzerinde çalışıyor`);
});
