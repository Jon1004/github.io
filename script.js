document.addEventListener('DOMContentLoaded', function() {
    let offresData = [];
    let articlesData = [];
    let allTitres = [];
    let allLieux = [];

    const jobTypeInput = document.getElementById('jobType');
    const locationInput = document.getElementById('location');
    const jobTypeSuggestions = document.getElementById('jobTypeSuggestions');
    const locationSuggestions = document.getElementById('locationSuggestions');
    const searchButton = document.getElementById('searchButton');
    const resultsContainer = document.getElementById('results-container');
    const modalContainer = document.getElementById('modal-container');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalTitle = document.getElementById('modal-title');
    const modalCompany = document.getElementById('modal-company');
    const modalLieu = document.getElementById('modal-lieu');
    const modalContrat = document.getElementById('modal-contrat');
    const modalSalaire = document.getElementById('modal-salaire');
    const modalDescription = document.getElementById('modal-description');
    const modalApplyBtn = document.getElementById('modal-apply-btn');
    const tabJobs = document.getElementById('tab-jobs');
    const tabArticles = document.getElementById('tab-articles');
    const viewJobs = document.getElementById('view-jobs');
    const viewArticles = document.getElementById('view-articles');
    const articlesContainer = document.getElementById('articles-container');

    function initializeApp(offres, articles) {
        offresData = offres;
        articlesData = articles;

        allTitres = [...new Set(offresData.map(offre => offre.titre))];
        allLieux = [...new Set(offresData.map(offre => offre.lieu))];

        jobTypeInput.addEventListener('input', () => showSuggestions(jobTypeInput, jobTypeSuggestions, allTitres));
        locationInput.addEventListener('input', () => showSuggestions(locationInput, locationSuggestions, allLieux));
        
        searchButton.addEventListener('click', lancerRecherche);
        resultsContainer.addEventListener('click', handleResultsClick);
        closeModalBtn.addEventListener('click', fermerModale);
        modalContainer.addEventListener('click', (event) => { if (event.target === modalContainer) fermerModale(); });
        tabJobs.addEventListener('click', () => switchView('jobs'));
        tabArticles.addEventListener('click', () => switchView('articles'));

        lancerRecherche();
        afficherArticles(articlesData);
        switchView('jobs');
    }

    Promise.all([
        fetch('offres.json').then(res => res.ok ? res.json() : []),
        fetch('articles_veille.json').then(res => res.ok ? res.json() : [])
    ])
    .then(([offres, articles]) => {
        initializeApp(offres, articles);
    })
    .catch(error => {
        console.error("Erreur de chargement des données:", error);
        resultsContainer.innerHTML = '<p style="text-align: center; color: #d63031;">Erreur: Impossible de charger les données.</p>';
    });

    function showSuggestions(input, suggestionsBox, suggestionsList) {
        const value = input.value.toLowerCase().trim();
        suggestionsBox.innerHTML = '';
        if (value.length < 2) {
            suggestionsBox.style.display = 'none';
            return;
        }
        const filtered = suggestionsList.filter(item => (item || '').toLowerCase().includes(value));
        if (filtered.length > 0) {
            filtered.slice(0, 5).forEach(suggestion => {
                const div = document.createElement('div');
                div.textContent = suggestion;
                div.className = 'suggestion-item';
                div.onclick = () => {
                    input.value = suggestion;
                    suggestionsBox.style.display = 'none';
                    searchButton.click();
                };
                suggestionsBox.appendChild(div);
            });
            suggestionsBox.style.display = 'block';
        } else {
            suggestionsBox.style.display = 'none';
        }
    }
    
    function afficherResultats(offres) {
        resultsContainer.innerHTML = '';
        if (offres.length === 0) {
            resultsContainer.innerHTML = '<p style="text-align: center; color: #6c757d; padding: 40px;">Aucune offre ne correspond à ta recherche.</p>';
            return;
        }
        resultsContainer.offresAffichees = offres;
        offres.forEach(function(offre, index) {
            const carteHTML = `<div class="result-card" data-index="${index}"><h3>${offre.titre}</h3><p class="company">${offre.entreprise}</p><div class="details"><span>${offre.lieu || ''}</span> &bull; <span>${offre.contrat || ''}</span></div></div>`;
            resultsContainer.innerHTML += carteHTML;
        });
    }

    function afficherArticles(articles) {
        articlesContainer.innerHTML = '';
        if (!articles || articles.length === 0) {
            articlesContainer.innerHTML = '<p style="text-align: center; color: #6c757d; padding: 40px;">Aucun article de veille trouvé pour le moment.</p>';
            return;
        }
        articles.forEach(function(article, index) {
            const carteHTML = `<a href="${article.url}" target="_blank" rel="noopener noreferrer" class="article-card"><div class="article-image"><img src="https://picsum.photos/400/300?random=${index}" alt="Image illustrative"></div><div class="article-content"><h3>${article.titre}</h3><p>${article.resume}</p><span class="author">Par : ${article.auteur}</span></div></a>`;
            articlesContainer.innerHTML += carteHTML;
        });
    }

    function ouvrirModale(offre) {
        modalTitle.textContent = offre.titre || '';
        modalCompany.textContent = offre.entreprise || '';
        modalLieu.textContent = offre.lieu || '';
        modalContrat.textContent = offre.contrat || '';
        modalSalaire.textContent = offre.salaire || '';
        modalDescription.innerHTML = (offre.description || "Pas de description.").replace(/\n/g, '<br>');
        modalApplyBtn.href = offre.url || '#';
        modalContainer.classList.remove('hidden');
    }

    function fermerModale() {
        modalContainer.classList.add('hidden');
    }
    
    function lancerRecherche() {
        jobTypeSuggestions.style.display = 'none';
        locationSuggestions.style.display = 'none';
        const jobTypeQuery = jobTypeInput.value.toLowerCase().trim();
        const locationQuery = locationInput.value.toLowerCase().trim();
        const resultatsFiltres = offresData.filter(function(offre) {
            const titreOffre = (offre.titre || '').toLowerCase();
            const descriptionOffre = (offre.description || '').toLowerCase();
            const lieuOffre = (offre.lieu || '').toLowerCase();
            const correspondAuPoste = titreOffre.includes(jobTypeQuery) || descriptionOffre.includes(jobTypeQuery);
            const correspondAuLieu = lieuOffre.includes(locationQuery);
            return correspondAuPoste && correspondAuLieu;
        });
        afficherResultats(resultatsFiltres);
    }
    
    function handleResultsClick(event) {
        const carteCliquee = event.target.closest('.result-card');
        if (carteCliquee) {
            const index = carteCliquee.dataset.index;
            const offreSelectionnee = resultsContainer.offresAffichees[index];
            if (offreSelectionnee) {
                ouvrirModale(offreSelectionnee);
            }
        }
    }

    function switchView(viewToShow) {
        if (viewToShow === 'jobs') {
            viewJobs.classList.remove('hidden');
            viewArticles.classList.add('hidden');
            tabJobs.classList.add('active');
            tabArticles.classList.remove('active');
        } else {
            viewJobs.classList.add('hidden');
            viewArticles.classList.remove('hidden');
            tabJobs.classList.remove('active');
            tabArticles.classList.add('active');
        }
    }
});
