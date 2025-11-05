
document.addEventListener('DOMContentLoaded', () => {  //caricare nella cartella padre DOM

    const API_URL = 'https://690a249b1a446bb9cc2189a3.mockapi.io/films';

    const newFilmInput = document.getElementById('new-film');
    const newDirectorInput = document.getElementById('new-director');
    const newRatingInput = document.getElementById('new-rating');
    const newDateInput = document.getElementById('new-date');
    const newTimeInput = document.getElementById('new-time');
    const filmList = document.getElementById('film-list');
    const addFilmBtn = document.getElementById('add-film');
   
    
    //Scroll down Indicator
    const indicator = document.getElementById('scroll-indicator');
        if (!indicator) return;

        // La funzione che gestisce la logica
        function checkScroll() {
            // Nasconde l'indicatore se l'utente ha scorciato più di 100 pixel
            if (window.scrollY > 100) {
                // Rimuove la classe per nasconderlo elegantemente tramite CSS opacity
                indicator.classList.remove('show');
            } else {
                // Mostra l'indicatore solo all'inizio della pagina
                indicator.classList.add('show');
            }
        }
        
        // Attiva la freccia appena la pagina è pronta
        indicator.classList.add('show'); 

        // Aggiunge l'ascoltatore di eventi per lo scroll
        window.addEventListener('scroll', checkScroll);


    let myChart = null;
                 
    // Prendi i dati per il modale di avviso
    const duplicateModal = new bootstrap.Modal(document.getElementById('duplicateModal'));
    const duplicateModalMessage = document.getElementById('duplicateModalMessage');

    // Modal messaggio film aggiunto
    const filmAggiuntoModal = new bootstrap.Modal(document.getElementById('filmAggiuntoModal'));
    const nuovoFilmModalMessage = document.getElementById('nuovoFilmModalMessage');


    //prendo i dati per il modale
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    const editForm = document.getElementById('editForm');

    //Modal messaggio film aggiornato
    const modificaSuccessoModal = new bootstrap.Modal(document.getElementById('modificaSuccessoModal'));
    const modificaSuccessoModalMessage = document.getElementById('modificaSuccessoModalMessage');
    
    //prendo i dati per il modale di eliminazione
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    //Modal messaggio film eliminato
    const filmEliminatoModal = new bootstrap.Modal(document.getElementById('filmEliminatoModal'));
    const filmEliminatoModalMessage = document.getElementById('filmEliminatoModalMessage');

    const newComment = document.getElementById('new-comment');

    //prendo l input del cerca film
    const searchFilmInput = document.getElementById('searchFilm');

    //prendo l inpu del seacrh per regista
    const searchRegistaInput = document.getElementById('searchRegista');

    let allFilms = []; // lista completa di film per il filtro

    let currentFilm = null;

 
    function renderChart(films){

        const ctx = document.getElementById('myChart');
        const labels = films.map(f => f.title);
        const data = films.map(f => Number(f.voto) || 0);


        if(!ctx) return;

        if(myChart){

            myChart.data.labels = labels;
            myChart.data.datasets[0].data = data;
            myChart.update();
        }else {

            myChart = new Chart(ctx, {
                                        type: 'line',
                                        data: {

                                            labels: labels,
                                            datasets: [{
                                                label: 'Voto',
                                                data: data,
                                                borderWidth: 3,
                                                backgroundColor: 'rgba(255, 193, 7, 0.5)',
                                                borderColor: 'rgba(255, 193, 7, 1)'
                                            }]

                                        },
                                        options: {
                                            responsive: true,
                                            maintainAspectRatio: true,
                                            plugins: {
                                                legend: { display: false },
                                                title: { display: true, text: 'Voti per Film', color: '#ffc107', font: { size: 20,weight: 'bold'}},
                                                tooltip: {
                                                callbacks: {
                                                    label: (context) => `Voto: ${context.parsed.y}`
                                                }
                                                }
                                            },
                                            scales: {
                                                y: {
                                                beginAtZero: true,
                                                suggestedMax: 10,
                                                ticks: { stepSize: 1, color: '#ffc107', //valori asse Y gialli
                                                font: {
                                                    size: 14,
                                                    weight: 'bold'
                                                }
                                                },
                                                grid: {
                                                color: 'rgba(255, 255, 255, 0.1)' //linee griglia leggere
                                                }
                                            },
                                            x: {
                                                ticks: {
                                                color: '#ffffff', //nomi film bianchi
                                                font: {
                                                    size: 13
                                                }
                                                },
                                                grid: {
                                                display: false //niente linee verticali
                                                }
                                            }
                                            }
                                        }
                                        });
        }
    }


    //FUNCTION FETCH
    function fetchFilms(){
        
        fetch(API_URL)

            .then(res => {
                    //se la res non esiste (!not) viene generato un oggetto di error
                if(!res) throw new Error('Errore nel recupero dei dati');

                return res.json()

            })
            //se ho i dati, costruisco l elemento in pagina
            .then(data => {

                allFilms = data; //salvo tutti i film

                //vado a richiamare la funzione che mostra gli elementi
                renderFilteredFilms(data)
        })
        .catch(err => console.error('Errore nel fetch dei dati : ', err));
        
    }
                
    //MOSTRO I DATI
    function renderFilteredFilms(data){            
                
                filmList.innerHTML = '';//pulisco la lista

                if (data.length === 0){

                    //template literals
                    filmList.innerHTML = `<p class="text-centertext-muted mt-4">Nessun file presente.</p>`;

                    return;

                }

                //ciclo su ogni film di data
                data.forEach(film => {

                    const li = document.createElement('li');
                    li.classList.add(

                        'film-card',
                        'd-flex',
                        'justify-content-between',
                        'align-items-start',
                        'flex-wrap'

                    );

                                     
                    const infoDiv = document.createElement('div');

                    infoDiv.innerHTML = `   <div class="film-title">
                                            <i class="bi bi-camera-reels-fill text-warning"></i>${film.title}
                                            </div>

                                            <div class="film-details">
                                            🎬 <strong>Regista : </strong>${film.regista} &nbsp;|&nbsp;
                                            ⭐ <strong>Voto : </strong>${film.voto} &nbsp;|&nbsp;
                                            📅 <strong>Data : </strong>${film.date} &nbsp;|&nbsp;
                                            ⏰<strong>Orario : </strong>${film.time} &nbsp;|&nbsp;
                                            </div>
                   
                                         `;


                    //sezione bottone di ciascun film creati dinamicamente
                    const btnGroup = document.createElement('div');
                    btnGroup.classList.add('film-action', 'mt-2');

                    const editBtn = document.createElement('button');
                    
                    //associo classi bootstrap al button
                    editBtn.classList.add('btn', 'btn-primary', 'btn-sm', 'me-2');

                    //npme del bottone
                    editBtn.textContent = 'Modifica';

                    //icona bootstrap
                    editBtn.innerHTML = `<i class="bi bi-pencil"></i>`; //cambia text per imagine del bottone

                    editBtn.onclick = () => editFilm(film);//evento click del bottone

                    //DELETE BUTTON
                    const deleteBtn = document.createElement('div');
                    deleteBtn.classList.add('btn', 'btn-danger', 'btn-sm');

                    deleteBtn.textContent = 'Elimina'; //nome del bottone


                    //icona bootstrap
                    deleteBtn.innerHTML = `<i class="bi bi-trash"></i>`; //cambia text per imagine del bottone

                    deleteBtn.onclick = () => deleteFilm(film.id); //funzione  all evento click del bottone

                    btnGroup.append(editBtn, deleteBtn); //raggruppo i bottoni e unisco gli elementi

                    
                    li.innerHTML = `
                    <div class="film-info flex-grow-1">
                        <div class="film-title fw-bold mb-1">
                            <i class="bi bi-person-video3 text-warning"></i> ${film.title}
                        

                            <i class="bi bi-info-circle-fill text-primary ms-2 info-icon" 
                            role="button"
                            title="Mostra Commento"
                            data-comment="${film.comment ? film.comment.replace(/"/g, '&quot;') : 'Nessun commento disponibile'}"></i>
                        </div>

                        <div class="film-details small">
                        🎬 <strong>Regista:</strong> ${film.regista} &nbsp;|&nbsp;
                        ⭐ <strong>Voto:</strong> ${film.voto} &nbsp;|&nbsp;
                        📅 <strong>Data:</strong> ${film.date} &nbsp;|&nbsp;
                        ⏰ <strong>Orario:</strong> ${film.time} 
                        </div>
                    </div>
                    `;
                  
                    li.appendChild(btnGroup);
                    filmList.appendChild(li);

                });
                renderChart(data);       
        
    }


     //Filtro di ricerca per il titolo
    function filteredFilms(searchTitle){

        const filtered = allFilms.filter(film => 
            film.title.toLowerCase().includes(searchTitle.toLowerCase())
        );

        renderFilteredFilms(filtered);

    }


    //Filtro di ricerca per il titolo
    function filteredRegista(searchRegista){

        const filtered = allFilms.filter(film => 
            film.regista.toLowerCase().includes(searchRegista.toLowerCase())
        );

        renderFilteredFilms(filtered);

    }


  //Evento di filtro listener per filtro Titolo

    searchFilmInput.addEventListener('input', e => {

        const searchTitle = e.target.value.trim();
        filteredFilms(searchTitle);
    });


    //Evento di filtro listener per filtro regista

    searchRegistaInput.addEventListener('input', e => {

        const searchRegista = e.target.value.trim();
        filteredRegista(searchRegista);
    });


    //FUNZIONE CREATE
    addFilmBtn.addEventListener('click', () => {

        const title = newFilmInput.value.trim();
        const regista = newDirectorInput.value.trim();
        const voto = newRatingInput.value.trim();
        const date = newDateInput.value.trim();
        const time = newTimeInput.value.trim();
        const comment = newComment.value.trim();

        //se non ho il title o il regista
        if(!title || !regista) {

            alert('Inserisci almeno un Titolo o un Regista!');
            return;
        }

        //fa il controllo per vedere se il film è già stato aggiunto - lavora insieme a currentFilm = data
        const isDuplicate = allFilms.some(film => 
            film.title.trim().toLowerCase() === title.toLowerCase()
        );

        if (isDuplicate) {
            duplicateModalMessage.textContent = `Il film "${title}" è già presente nella lista. Non è possibile aggiungerlo nuovamente.`;
            duplicateModal.show();
                       
            return; // Blocca l'invio del POST
        }


        //costruisco l oggetto film
        const nuovoFilm = {title, regista, voto, date, time, comment};

             
        fetch(API_URL, {

            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(nuovoFilm),
        })
        .then(res => {
            

            if(!res.ok) throw new Error('Errore nella creazione del film!');
            
            //reset dei campi, svuoto il campo di inserimento
            newDateInput.value = '';
            newDirectorInput.value = '';
            newFilmInput.value = '';
            newRatingInput.value = '';
            newTimeInput.value = '';
            newComment.value = '';

            //aggiorna la lista
            fetchFilms();

            nuovoFilmModalMessage.textContent = `Il film "${title}" è stato aggiunto alla tua lista!`;
            filmAggiuntoModal.show();

        })
        .catch(err => console.log('Errore nel POST', err));

         
    });
 

    //FUNZIONE UPDATE
    window.editFilm = function(film) {
        //rivalorizzare film per non fare confuzione con il dato
        currentFilm = film;

        document.getElementById('editTitle').value = film.title;
        document.getElementById('editRegista').value = film.regista;
        document.getElementById('editVoto').value = film.voto;
        document.getElementById('editDate').value = film.date;
        document.getElementById('editTime').value = film.time;
        document.getElementById('editComment').value = film.comment;

        editModal.show();

    };


    editForm.addEventListener('submit', (e) => {
        e.preventDefault(); // impedisce il reload prima della modifica
      
        if(!currentFilm) return;

        //ci construiamo l oggetto

        const filmAggiornato = {

            ...currentFilm, //prendo l oggetto film


            //passo i nuovi valori per la construzione del nuovo oggetto 
            title: document.getElementById('editTitle').value.trim(),
            regista: document.getElementById('editRegista').value.trim(),
            voto: document.getElementById('editVoto').value.trim(),
            date: document.getElementById('editDate').value.trim(),
            time: document.getElementById('editTime').value.trim(),
            comment: document.getElementById('editComment').value.trim()
        };

        fetch(`${API_URL}/${currentFilm.id}`, {

            method: 'PUT',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(filmAggiornato)

        }).then(res => {
            if(!res.ok)throw new Error('Errore aggiornamento');
            editModal.hide();

            fetchFilms();

            modificaSuccessoModalMessage.textContent = `I dati del film "${filmAggiornato.title}" sono stati aggiornati correttamente!`;
            modificaSuccessoModal.show();
         
        })

        .catch(err => console.error('Errore nel metodo PUT', err));


    });


    //FUNZIONE DELETE
    window.deleteFilm = function(id){

        deleteFilmId = id; //riassegno il nome del film a Id

        fetch(`${API_URL}/${id}`)

            .then(res => res.json())

            .then(film => {

                deleteFilmTitle.textContent = film.title;
                deleteModal.show();
            })


    };


    confirmDeleteBtn.addEventListener('click', () => {

        if(!deleteFilmId) return;

        fetch(`${API_URL}/${deleteFilmId}`, {

            method: 'DELETE'


        }).then(res => {

            if(!res.ok) throw new Error('Errore eliminazione');
            deleteModal.hide();//chiudo il modal di conferma
            fetchFilms(); //aggiorno la lista dei film

            filmEliminatoModalMessage.textContent = `Il film è stato eliminato correttamente!`;
            filmEliminatoModal.show();

        })
        .catch(err => console.error('Errore nel metodo DELETE : ', err));

    });



    // Mostra il commento in un modal al clic sull'icona info
    document.addEventListener('click', (e) => {

      if (e.target.classList.contains('info-icon')) {

        const comment = e.target.getAttribute('data-comment') || 'Nessun commento disponibile';

        const title = e.target.closest('.film-info').querySelector('.film-title').innerText.trim();

        document.getElementById('infoModalLabel').innerText = `"${title}"`;

        document.getElementById('infoModalBody').innerText = comment;

      
        const infoModal = new bootstrap.Modal(document.getElementById('infoModal'));

        infoModal.show();

      }

    });

    fetchFilms();
});
