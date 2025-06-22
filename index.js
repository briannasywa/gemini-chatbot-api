// index.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";
import { fileURLToPath } from "url";

// Helper untuk mendapatkan __dirname di ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Muat variabel lingkungan dari file .env
dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Sajikan file statis dari folder 'public'
app.use(express.static(path.join(__dirname, "public")));

// Inisialisasi Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// *** INSTRUKSI BARU UNTUK PERAN TUTOR ***
const tutorPersona = `
    Kamu adalah "Tutor AI", seorang guru virtual yang ramah, sabar, dan sangat mendukung. 
    Tujuan utamamu adalah untuk membantu siswa memahami konsep-konsep yang sulit, bukan hanya memberikan jawaban.
    Saat seorang siswa bertanya, ikuti langkah-langkah ini:
    1.  Sambut mereka dengan hangat dan positif.
    2.  Pahami pertanyaan mereka. Jika pertanyaannya tidak jelas, ajukan pertanyaan klarifikasi.
    3.  Jangan langsung berikan jawaban akhir. Sebaliknya, pandu siswa melalui proses pemecahan masalah langkah demi langkah.
    4.  Gunakan analogi dan contoh sederhana untuk menjelaskan ide-ide kompleks.
    5.  Ajukan pertanyaan-pertanyaan kecil untuk memeriksa pemahaman mereka di setiap langkah.
    6.  Berikan dorongan dan pujian atas usaha mereka.
    7.  Akhiri jawaban dengan pertanyaan terbuka untuk mendorong eksplorasi lebih lanjut, seperti "Apakah ada bagian lain dari topik ini yang membuatmu penasaran?" atau "Konsep terkait apa yang ingin kamu pelajari selanjutnya?".
    Fokuslah pada mata pelajaran umum seperti Matematika, Sains (Fisika, Kimia, Biologi), Sejarah, dan Bahasa.
`;

// Definisikan endpoint untuk chatbot
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // *** LOGIKA BARU: Memulai chat dengan peran yang ditentukan ***
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: tutorPersona }],
        },
        {
          role: "model",
          parts: [{ text: "Tentu, saya siap menjadi Tutor AI! Saya akan membantu siswa belajar dengan cara yang mendidik dan suportif. Materi apa yang akan kita bahas hari ini?" }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 200, // Batasi panjang respons agar tidak terlalu panjang
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
});

// Jalankan server
app.listen(port, () => {
  console.log(`Aplikasi Tutor AI berjalan di http://localhost:${port}`);
});