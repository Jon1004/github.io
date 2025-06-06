document.addEventListener('DOMContentLoaded', function() {
  
  // On initialise des variables qui contiendront nos données une fois chargées
  let offresData = [];
  let articlesData = [];
  let allTitres = [];
  let allLieux = [];

  // On capture tous les éléments de la page
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

  // --- ÉTAPE CLÉ : ON VA CHERCHER LES DONNÉES EN LIGNE ---
  
  fetch('offres.json') // Il cherche le fichier offres.json à la racine de ton site
    .then(response => {
      if (!response.ok) {
        throw new Error("Le fichier offres.json est introuvable.");
      }
      return response.json();
    })
    .then(data => {
      console.log("Données des offres chargées !");
      offresData = data; // On remplit notre variable avec les données
      allTitres = [...new Set(offresData.map(offre => offre.titre))];
      allLieux = [...new Set(offresData.map(offre => offre.lieu))];
      
      // On affiche les résultats une fois les données prêtes
      afficherResultats(offresData);
    })
    .catch(error => {
      console.error(error);
      resultsContainer.innerHTML = '<p style="text-align: center; color: #d63031;">Erreur: Impossible de charger les offres pour le moment.</p>';
    });

  // (On pourrait faire la même chose pour les articles avec un fichier articles.json)

  // Toutes nos fonctions restent les mêmes
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
  
  // ... et toutes les autres fonctions (fermerModale, lancerRecherche, showSuggestions, switchView...)
  // ... et tous les autres addEventListener
  
  function fermerModale() { modalContainer.classList.add('hidden'); }
  function lancerRecherche() {
    jobTypeSuggestions.style.display = 'none';
    locationSuggestions.style.display = 'none';
    const jobTypeQuery = jobTypeInput.value.toLowerCase().trim();
    const locationQuery = locationInput.value.toLowerCase().trim();
    const resultatsFiltres = offresData.filter(function(offre) {
      const titreOffre = (offre.titre || '').toLowerCase();
      const lieuOffre = (offre.lieu || '').toLowerCase();
      const correspondAuPoste = titreOffre.includes(jobTypeQuery);
      const correspondAuLieu = lieuOffre.includes(locationQuery);
      return correspondAuPoste && correspondAuLieu;
    });
    afficherResultats(resultatsFiltres);
  }
  function showSuggestions(input, suggestionsBox, suggestionsList) {
    const value = input.value.toLowerCase().trim();
    suggestionsBox.innerHTML = '';
    if (value.length < 2) { suggestionsBox.style.display = 'none'; return; }
    const filtered = suggestionsList.filter(item => (item || '').toLowerCase().includes(value));
    if (filtered.length > 0) {
      filtered.slice(0, 5).forEach(suggestion => {
        const div = document.createElement('div');
        div.textContent = suggestion;
        div.className = 'suggestion-item';
        div.onclick = () => { input.value = suggestion; suggestionsBox.style.display = 'none'; searchButton.click(); };
        suggestionsBox.appendChild(div);
      });
      suggestionsBox.style.display = 'block';
    } else { suggestionsBox.style.display = 'none'; }
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
  
  searchButton.addEventListener('click', lancerRecherche);
  jobTypeInput.addEventListener('input', () => showSuggestions(jobTypeInput, jobTypeSuggestions, allTitres));
  locationInput.addEventListener('input', () => showSuggestions(locationInput, locationSuggestions, allLieux));
  document.addEventListener('click', function(event) { if (!event.target.closest('.input-container')) { jobTypeSuggestions.style.display = 'none'; locationSuggestions.style.display = 'none'; } });
  resultsContainer.addEventListener('click', function(event) {
    const carteCliquee = event.target.closest('.result-card');
    if (carteCliquee) {
      const index = carteCliquee.dataset.index;
      const offreSelectionnee = resultsContainer.offresAffichees[index];
      if (offreSelectionnee) { ouvrirModale(offreSelectionnee); }
    }
  });
  closeModalBtn.addEventListener('click', fermerModale);
  modalContainer.addEventListener('click', function(event) { if (event.target === modalContainer) { fermerModale(); } });
  tabJobs.addEventListener('click', () => switchView('jobs'));
  tabArticles.addEventListener('click', () => switchView('articles'));

  // Affichage initial
  switchView('jobs');
});
