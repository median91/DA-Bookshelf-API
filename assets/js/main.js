let books = [];


window.addEventListener('load', () => {
  books = JSON.parse(localStorage.getItem('book')) || [], updateUI(books);
  
  $('form').onsubmit = addbook;
  
  $('.opsi>.form-masukkan').onchange = searchData;
  $('#isCompleted').onclick = (e) => {
    $('form>button').innerText = e.target.checked ? 'Simpan Sebagai Udah dibaca' : 'Simpan Sebagai Belum dibaca';
  };
  
  $('#tambahBuku').onclick = () => {
    const isEdit  = $('form').id;
    const isShown = !$('.inputan-data').classList.contains('hide');
    if(isShown && isEdit) {
      if(confirm('Batal Mengubah Data?')) {
        $('.inputan-data>h3').innerText = 'Inputkan Data';
        $('form').removeAttribute('id');
        $('form').reset();
      }
    } else {
      $('.inputan-data').classList.toggle('hide');
    }
  };
});


function updateUI(books) {
  const finished   = $('.udah-dibaca'), 
        unfinished = $('.belum-dibaca');
        
  finished.innerHTML = '', unfinished.innerHTML = '';
  
  for(let book of books) {
    let item   = $new('div', { id: book.id, css: ['book'] });
    let title  = $new('h4', { text: `${book.title}` });
    let author = $new('p', { text: `Penulis: ${book.author}` });
    let year   = $new('p', { text: `Tahun: ${book.year}` });
    let group  = $new('button', { css: ['button', 'button-success'], text: `${ book.isCompleted ? 'Belum selesai' : 'Udah dibaca'}`, action: moveGroup });
    let remove = $new('button', { css: ['button', 'button-danger'], text: 'Hapus', action: removebook });
    let edit   = $new('button', { css: ['button', 'button-warning'], text: 'Edit', action: editbook });
    
    [title, author, year, group, remove, edit].forEach(e => {
      item.appendChild(e);
    });
    
    book.isCompleted ? finished.appendChild(item) : unfinished.appendChild(item);
  }
  
  !finished.hasChildNodes() ? finished.innerHTML = 'Tidak Ada Data Untuk Ditampilkan' : 0;
  !unfinished.hasChildNodes() ? unfinished.innerHTML = 'Tidak Ada Data Untuk Ditampilkan' : 0;
}


function moveGroup(e) {
  const position = books.findIndex(i => i.id == e.target.parentNode.id);
  books[position].isCompleted = !books[position].isCompleted;
  saveData();
  updateUI(books);
}


function removebook(e) {
  if(confirm('Yakin Menghapus Data?')) {
    const position = books.findIndex(i => i.id == e.target.parentNode.id);
    books.splice(position, 1);
    saveData();
    updateUI(books);
  }
}


function editbook(e) {
  const position = books.findIndex(i => i.id == e.target.parentNode.id);
  
  $('#title').value  = books[position].title;
  $('#author').value = books[position].author;
  $('#year').value   = books[position].year;
  $('#isCompleted').checked = books[position].isCompleted;
  
  $('form').id = position;
  
  $('.inputan-data>h3').innerText = 'Edit Data';
  $('.inputan-data').classList.remove('hide');
  $('.inputan-data').scrollIntoView();
  
  $('#title').focus();
}


function addbook() {
  const position = $('form').id;
  
  let model = {
    id: +new Date(),
    title: $('#title').value,
    author: $('#author').value,
    year: $('#year').value,
    isCompleted: $('#isCompleted').checked
  }
  
  if(position) {
    books[position].title  = model.title;
    books[position].author = model.author;
    books[position].year   = model.year;
    books[position].isCompleted = model.isCompleted;
  } else {
    books.push(model);
  }
  
  saveData();
  updateUI(books);
}


function searchData(e) {
  e = e.target.value;
  
  updateUI(books.filter(book => {
    return book.title.toLowerCase().includes(e.toLowerCase());
  }));
}


function saveData() {
  localStorage.setItem('book', JSON.stringify(books));
}


function $new(e,a) {
  e = document.createElement(e);
  a.id ? e.id = a.id : 0;
  a.text ? e.innerText = a.text : 0;
  a.action ? e.addEventListener('click', a.action) : 0;
  a.css ? a.css.forEach(css => e.classList.add(css)) : 0;
  return e;
}


function $(e) {
  e = document.querySelectorAll(e);
  return e.length >= 1 ? e[0] : e;
}