// Les données sont directement intégrées ici
const offresData = [{"titre": "Formateur·trice Pré Insertion F/H", "entreprise": "Hellowork", "contrat": "CDD", "salaire": "30 - 31 k€ brut annuel", "lieu": "Morlaix - 29", "url": "https://www.apec.fr/candidat/recherche-emploi.html/emploi/detail-offre/176539823W", "description": "Placé sous la responsabilité de son hiérarchique, le formateur met en oeuvre une pédagogie adaptée visant la professionnalisation et la qualification pour favoriser l'accès à l'emploi des bénéficiaires."}, {"titre": "Adjoint de Direction F/H", "entreprise": "BATIMENT CFA BOURGOGNE- FRANCHE- COMTE", "contrat": "CDI", "salaire": "A partir de 40 k€ brut annuel", "lieu": "Dijon - 21", "url": "https://www.apec.fr/candidat/recherche-emploi.html/emploi/detail-offre/176588635W", "description": "Vous secondez le Directeur de CFA et le représentez dans ses missions. Vous animez et pilotez les équipes pédagogiques et administratives."}, {"titre": "Conseiller en Insertion Professionnelle F/H", "entreprise": "ID FORMATION", "contrat": "CDI", "salaire": "A négocier", "lieu": "Paris - 75", "url": "https://www.apec.fr/candidat/recherche-emploi.html/emploi/detail-offre/176542552W", "description": "Accompagner les publics dans leur parcours d'insertion sociale et professionnelle. Animer des ateliers thématiques."}];
const articlesData = [{"titre": "La ludopédagogie ou comment apprendre en jouant", "auteur": "Formation Professionnelle Continue", "resume": "Découvrez comment la ludopédagogie transforme l'apprentissage en une expérience engageante et efficace grâce au jeu.", "url": "https://www.formation-professionnelle-continue.fr/ludopedagogie-ou-comment-apprendre-en-jouant/", "image_url": "https://picsum.photos/400/300?random=1"}, {"titre": "Quels sont les grands principes de l’andragogie ?", "auteur": "Evolutis", "resume": "L'andragogie se base sur l'expérience et l'autonomie de l'apprenant adulte. Explorons ses concepts clés.", "url": "https://www.evolutis-formation.fr/la-ludopedagogie-une-autre-facon-dapprendre-en-entreprise/", "image_url": "https://picsum.photos/400/300?random=2"}, {"titre": "L'actualité de la formation professionnelle", "auteur": "Centre Inffo", "resume": "Restez à jour sur les dernières réformes, les financements et les innovations dans le secteur de la formation.", "url": "https://www.centre-inffo.fr/actualites", "image_url": "https://picsum.photos/400/300?random=3"}];

// Le reste du code est la logique de l'application
const jobTypeInput = document.getElementById('jobType');
const locationInput = document.getElementById('location');
const searchButton = document.getElementById('searchButton');
const resultsContainer = document.getElementById('results-container');
const tabJobs = document.getElementById('tab-jobs');
const tabArticles = document.getElementById('tab-articles');
const viewJobs = document.getElementById('view-jobs');
const viewArticles = document.getElementById('view-articles');
const articlesContainer = document.getElementById('articles-container');
const modalContainer = document.getElementById('modal-container');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalTitle = document.getElementById('modal-title');
const modalCompany = document.getElementById('modal-company');
const modalLieu = document.getElementById('modal-lieu');
const modalContrat = document.getElementById('modal-contrat');
const modalSalaire = document.getElementById('modal-salaire');
const modalDescription = document.getElementById('modal-description');
const modalApplyBtn = document.getElementById('modal-apply-btn');

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
        const carteHTML = `<a href="${article.url}" target="_blank" rel="noopener noreferrer" class="article-card"><div class="article-image"><img src="${article.image_url}" alt="Image illustrative"></div><div class="article-content"><h3>${article.titre}</h3><p>${article.resume}</p><span class="author">Par : ${article.auteur}</span></div></a>`;
        articlesContainer.innerHTML += carteHTML;
    });
}

function lancerRecherche() {
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
tabJobs.addEventListener('click', () => switchView('jobs'));
tabArticles.addEventListener('click', () => switchView('articles'));

// Affichage initial
lancerRecherche();
afficherArticles(articlesData);
switchView('jobs');
