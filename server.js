// server.js
const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Endpoint untuk mendapatkan lirik
app.post('/api/lyrics', async (req, res) => {
  try {
    const { title, artist } = req.body;

    if (!title || !artist) {
      return res.status(400).json({ 
        error: 'Title dan artist harus diisi' 
      });
    }

    console.log(`📝 Mencari lirik untuk: ${title} - ${artist}`);

    // Jalankan Python script
    const pythonProcess = spawn('python', [
      'gemini.py',
      title,
      artist
    ]);

    let dataFromPython = '';
    let errorFromPython = '';

    // Tangkap output dari Python
    pythonProcess.stdout.on('data', (data) => {
      dataFromPython += data.toString();
    });

    // Tangkap error dari Python
    pythonProcess.stderr.on('data', (data) => {
      errorFromPython += data.toString();
    });

    // Ketika Python selesai
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('❌ Error dari Python:', errorFromPython);
        return res.status(500).json({
          error: 'Gagal mendapatkan lirik dari Python',
          details: errorFromPython
        });
      }

      console.log('✅ Lirik berhasil didapatkan');

      res.json({
        success: true,
        title,
        artist,
        lyrics: dataFromPython.trim()
      });
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ 
      error: 'Gagal mendapatkan lirik',
      details: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  console.log(`📂 Pastikan folder 'public' dan file 'index.html' sudah ada`);
  console.log(`🐍 Menggunakan Python script dengan Gemini 2.0 Flash`);
  console.log(`⚠️  Pastikan Python dan google-genai sudah terinstall`);
});