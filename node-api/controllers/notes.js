const firebase = require('../config/firebase');

// Membuat catatan pengguna
exports.createNote = async (req, res) => {
  try {
    // Ambil Unique ID dari request user, title dan content dari request body
    const { uid } = req.user;
    const { title, content } = req.body;

    // Cek apakah judulnya ada
    if (!title) {
      return res.status(400).json({ message: 'Judul perlu diisi' });
    }

    // Buat object newNote
    const newNote = {
      user_id: uid,
      title,
      content,
    };

    // Simpan catatan baru kedalam Firestore
    const noteRef = await firebase.firestore().collection('notes').add(newNote);
    const note = { id: noteRef.id, ...newNote };

    // Berikan jawaban jika berhasil
    res.status(201).json({ message: 'Catatan berhasil dibuat', note: note });
  } catch (error) {
    // Berikan jawaban jika gagal
    res.status(500).json({ error: error.message });
  }
};

// Memperbarui catatan pengguna
exports.updateNote = async (req, res) => {
  try {
    // Ambil Unique ID dari request user, id dari request params, title dan content dari request body
    const { uid } = req.user;
    const { id } = req.params;
    const { title, content } = req.body;

    // Cek apakah catatan tersebut milik pengguna
    const noteRef = firebase.firestore().collection('notes').doc(id);
    const noteSnapshot = await noteRef.get();
    const note = noteSnapshot.data();

    if (!note || note.user_id !== uid) {
      return res.status(404).json({ message: 'Catatan tidak ditemukan' });
    }

    // Perbarui catatan di Firestore
    const updateNote = {};

    if (title) {
      updateNote.title = title;
    }

    if (content) {
      updateNote.content = content;
    }

    await firebase.firestore().collection('notes').doc(id).update(updateNote);

    // Dapatkan data terbaru
    const newNoteSnapshot = await noteRef.get();
    const newNote = newNoteSnapshot.data();

    // Berikan jawaban jika berhasil
    res.status(201).json({ message: 'Catatan berhasil diperbarui', note: newNote });
  } catch (error) {
    // Berikan jawaban jika gagal
    res.status(500).json({ error: error.message });
  }
};

// Menghapus catatan pengguna
exports.deleteNote = async (req, res) => {
  try {
    // Ambil Unique ID dari request user, id dari request params
    const { uid } = req.user;
    const { id } = req.params;

    // Cek apakah catatan milik pengguna
    const noteSnapshot = await firebase.firestore().collection('notes').doc(id).get();
    const note = noteSnapshot.data();

    if (!note || note.user_id !== uid) {
      return res.status(404).json({ message: 'Catatan tidak ditemukan' });
    }

    // Hapus catatan dari Firestore
    await firebase.firestore().collection('notes').doc(id).delete();

    // Berikan jawaban jika berhasil
    res.status(200).json({ message: 'Catatan berhasil dihapus' });
  } catch (error) {
    // Berikan jawaban jika gagal
    res.status(500).json({ error: error.message });
  }
};

// Mendapatkan semua catatan pengguna
exports.getAllNotes = async (req, res) => {
  try {
    // Ambil Unique ID dari request user
    const { uid } = req.user;

    // Dapatkan semua catatan pengguna berdasarkan UID
    const notesSnapshot = await firebase.firestore().collection('notes').where('user_id', '==', uid).get();

    // Simpan semua catatan dalam array tanpa menampilkan user_id
    const notes = [];
    notesSnapshot.forEach(doc => {
      const { user_id, ...noteData } = doc.data();
      notes.push({ id: doc.id, ...noteData });
    });

    // Berikan jawaban jika berhasil
    res.status(200).json({ message: 'Catatan berhasil didapatkan', notes });
  } catch (error) {
    // Berikan jawaban jika gagal
    res.status(500).json({ error: error.message });
  }
};

// Mencari catatan pengguna berdasarkan judul atau konten
exports.searchNotes = async (req, res) => {
  try {
    // Ambil Unique ID dari request user dan query pencarian dari request query
    const { uid } = req.user;
    const { q } = req.query;

    // Cek apakah query pencarian ada
    if (!q) {
      return res.status(400).json({ message: 'Query pencarian perlu diisi' });
    }

    // Mencari catatan pengguna berdasarkan judul atau konten menggunakan query Firestore
    const notesSnapshot = await firebase
      .firestore()
      .collection('notes')
      .where('user_id', '==', uid)
      .where('title', '>=', q)
      .where('title', '<=', q + '\uf8ff')
      .get();

    // Simpan hasil pencarian dalam array tanpa menampilkan user_id
    const searchResults = [];
    notesSnapshot.forEach(doc => {
      const { user_id, ...noteData } = doc.data();
      searchResults.push({ id: doc.id, ...noteData });
    });

    // Berikan jawaban jika berhasil
    res.status(200).json({ message: 'Hasil pencarian berhasil didapatkan', searchResults });
  } catch (error) {
    // Berikan jawaban jika gagal
    res.status(500).json({ error: error.message });
  }
};
