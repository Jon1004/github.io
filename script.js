document.addEventListener('DOMContentLoaded', function() {
    
  const offresData = [
    {"titre": "Formateur·trice Pré Insertion F/H", "entreprise": "Hellowork", "contrat": "CDD", "salaire": "30 - 31 k€ brut annuel", "lieu": "Morlaix - 29", "url": "https://www.apec.fr/candidat/recherche-emploi.html/emploi/detail-offre/176539823W", "description": "Description pour le poste de formateur pré-insertion..."},
    {"titre": "Formateur Encadrant Technique d'Insertion F/H", "entreprise": "AFPA", "contrat": "CDD", "salaire": "30 - 30 k€ brut annuel", "lieu": "Chevigny-Saint-Sauveur - 21", "url": "https://www.apec.fr/candidat/recherche-emploi.html/emploi/detail-offre/176531167W", "description": "Description pour le poste de formateur et encadrant technique..."},
    {"titre": "Formateur Encadrant Technique d'Insertion F/H", "entreprise": "AFPA", "contrat": "CDD", "salaire": "30 - 30 k€ brut annuel", "lieu": "Besançon - 25", "url": "https://www.apec.fr/candidat/recherche-emploi.html/emploi/detail-offre/176531104W", "description": "Description pour le poste de formateur et encadrant technique..."},
    {"titre": "Formateur.trice Français Langues Etrangères F/H", "entreprise": "AFPA", "contrat": "CDD", "salaire": "30 - 31 k€ brut annuel", "lieu": "Romans-sur-Isère - 26", "url": "https://www.apec.fr/candidat/recherche-emploi.html/emploi/detail-offre/176511484W", "description": "Description pour le poste de formateur FLE..."},
    {"titre": "Adjoint de Direction F/H", "entreprise": "BATIMENT CFA BOURGOGNE- FRANCHE- COMTE", "contrat": "CDI", "salaire": "A partir de 41 k€ brut annuel", "lieu": "Besançon - 25", "url": "https://www.apec.fr/candidat/recherche-emploi.html/emploi/detail-offre/176383133W", "description": "Seconder le directeur de l'établissement dans ses missions..."},
    {"titre": "Adjoint de Direction F/H", "entreprise": "BATIMENT CFA BOURGOGNE- FRANCHE- COMTE", "contrat": "CDI", "salaire": "A partir de 40 k€ brut annuel", "lieu": "Dijon - 21", "url": "https://www.apec.fr/candidat/recherche-emploi.html/emploi/detail-offre/176588635W", "description": "Vous secondez le Directeur de CFA et le représentez dans ses missions. Vous animez et pilotez les équipes pédagogiques et administratives."},
    {"titre": "Conseiller en Insertion Professionnelle F/H", "entreprise": "ID FORMATION", "contrat": "CDI", "salaire": "A négocier", "lieu": "Paris - 75", "url": "https://www.apec.fr/candidat/recherche-emploi.html/emploi/detail-offre/176542552W", "description": "Accompagner les publics dans leur parcours d'insertion sociale et professionnelle. Animer des ateliers thématiques."},
    {"titre": "Consultant en bilan de compétences", "entreprise": "Cabinet RH", "contrat": "Indépendant", "salaire": "Selon mission", "lieu": "Lyon - 69", "url": "#", "description": "Réaliser des bilans de compétences pour des professionnels..."},
    {"titre": "Formateur sécurité F/H", "entreprise": "SECURITAS FORMATION", "contrat": "CDI", "salaire": "A négocier", "lieu": "Rennes - 35", "url": "https://www.apec.fr/candidat/recherche-emploi.html/emploi/detail-offre/176566050W", "description": "Animer les formations réglementaires en sécurité (SST, CQP APS)..."}
  ];
  const articlesData = [
    {"titre": "La ludopédagogie ou comment apprendre en jouant", "auteur": "Formation Professionnelle Continue", "resume": "Découvrez comment la ludopédagogie transforme l'apprentissage en une expérience engageante et efficace grâce au jeu.", "url": "https://www.formation-professionnelle-continue.fr/ludopedagogie-ou-comment-apprendre-en-jouant/", "image_url": "https://picsum.photos/400/300?random=1"},
    {"titre": "Quels sont les grands principes de l’andragogie ?", "auteur": "Evolutis", "resume": "L'andragogie se base sur l'expérience et l'autonomie de l'apprenant adulte. Explorons ses concepts clés.", "url": "https://www.evolutis-formation.fr/la-ludopedagogie-une-autre-facon-dapprendre-en-entreprise/", "image_url": "https://picsum.photos/400/300?random=2"},
    {"titre": "L'actualité de la formation professionnelle", "auteur": "Centre Inffo", "resume": "Restez à jour sur les dernières réformes, les financements et les innovations dans le secteur de la formation.", "url": "https://www.centre-inffo.fr/actualites", "image_url": "https://picsum.photos/400/300?random=3"}
  ];
    
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
  const modalDate = document.getElementById('modal-date');
  const modalDescription = document.getElementById('modal-description');
  const modalApplyBtn = document.getElementById('modal-apply-btn');
  const tabJobs = document.getElementById('tab-jobs');
  const tabArticles = document.getElementById('tab-articles');
  const viewJobs = document.getElementById('view-jobs');
  const viewArticles = document.getElementById('view-articles');
  const articlesContainer = document.getElementById('articles-container');

  const allTitres = [...new Set(offresData.map(offre => offre.titre))];
  const allLieux = [...new Set(offresData.map(offre => offre.lieu))];

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
  jobTypeInput.addEventListener('input', () => showSuggestions(jobTypeInput, jobTypeSuggestions, allTitres));
  locationInput.addEventListener('input', () => showSuggestions(locationInput, locationSuggestions, allLieux));
  document.addEventListener('click', function(event) {
    if (!event.target.closest('.input-container')) {
      jobTypeSuggestions.style.display = 'none';
      locationSuggestions.style.display = 'none';
    }
  });

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
    articles.forEach(function(article, index) {
      const carteHTML = `<a href="${article.url}" target="_blank" rel="noopener noreferrer" class="article-card"><div class="article-image"><img src="${article.image_url}" alt="Image pour ${article.titre}"></div><div class="article-content"><h3>${article.titre}</h3><p>${article.resume}</p><span class="author">Par : ${article.auteur}</span></div></a>`;
      articlesContainer.innerHTML += carteHTML;
    });
  }

  function ouvrirModale(offre) {
    modalTitle.textContent = offre.titre || '';
    modalCompany.textContent = offre.entreprise || '';
    modalLieu.textContent = offre.lieu || '';
    modalContrat.textContent = offre.contrat || '';
    modalSalaire.textContent = offre.salaire || '';
    modalDate.textContent = offre.date_publication || '';
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
  searchButton.addEventListener('click', lancerRecherche);

  resultsContainer.addEventListener('click', function(event) {
    const carteCliquee = event.target.closest('.result-card');
    if (carteCliquee) {
      const index = carteCliquee.dataset.index;
      const offreSelectionnee = resultsContainer.offresAffichees[index];
      if (offreSelectionnee) {
        ouvrirModale(offreSelectionnee);
      }
    }
  });

  closeModalBtn.addEventListener('click', fermerModale);
  modalContainer.addEventListener('click', function(event) {
    if (event.target === modalContainer) {
      fermerModale();
    }
  });

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
  tabJobs.addEventListener('click', () => switchView('jobs'));
  tabArticles.addEventListener('click', () => switchView('articles'));

  lancerRecherche();
  afficherArticles(articlesData);
  switchView('jobs');
});