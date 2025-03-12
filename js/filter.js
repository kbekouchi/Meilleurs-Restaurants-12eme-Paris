/**
 * Système de filtrage des restaurants
 * Permet de filtrer les restaurants selon différents critères
 */

document.addEventListener('DOMContentLoaded', function() {
    // Récupération des éléments du DOM
    const filterForm = document.getElementById('filter-form');
    const cuisineFilter = document.getElementById('cuisine-filter');
    const ratingFilter = document.getElementById('rating-filter');
    const searchInput = document.getElementById('search-input');
    const resetButton = document.getElementById('reset-filters');
    const restaurantCards = document.querySelectorAll('.restaurant-card');
    const resultCount = document.getElementById('result-count');
    
    // Initialisation du compteur de résultats
    updateResultCount(restaurantCards.length);
    
    // Écouteur d'événement pour le formulaire de filtrage
    filterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        applyFilters();
    });
    
    // Écouteur d'événement pour le bouton de réinitialisation
    resetButton.addEventListener('click', function() {
        cuisineFilter.value = 'all';
        ratingFilter.value = 'all';
        searchInput.value = '';
        applyFilters();
    });
    
    // Écouteurs d'événements pour les changements de filtres (filtrage en temps réel)
    cuisineFilter.addEventListener('change', applyFilters);
    ratingFilter.addEventListener('change', applyFilters);
    searchInput.addEventListener('input', applyFilters);
    
    /**
     * Applique les filtres sélectionnés aux cartes de restaurants
     */
    function applyFilters() {
        const selectedCuisine = cuisineFilter.value;
        const selectedRating = parseFloat(ratingFilter.value);
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        let visibleCount = 0;
        
        restaurantCards.forEach(card => {
            // Récupération des données du restaurant
            const cuisine = card.querySelector('.restaurant-cuisine').textContent.toLowerCase();
            const ratingText = card.querySelector('.review-count').textContent;
            const rating = parseFloat(ratingText.split('/')[0]);
            const name = card.querySelector('.restaurant-name').textContent.toLowerCase();
            const address = card.querySelector('.restaurant-address').textContent.toLowerCase();
            const comment = card.querySelector('.restaurant-comment').textContent.toLowerCase();
            
            // Vérification des critères de filtrage
            const matchesCuisine = selectedCuisine === 'all' || cuisine.includes(selectedCuisine.toLowerCase());
            const matchesRating = isNaN(selectedRating) || rating >= selectedRating;
            const matchesSearch = searchTerm === '' || 
                                 name.includes(searchTerm) || 
                                 cuisine.includes(searchTerm) || 
                                 address.includes(searchTerm) || 
                                 comment.includes(searchTerm);
            
            // Affichage ou masquage de la carte selon les filtres
            if (matchesCuisine && matchesRating && matchesSearch) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Mise à jour du compteur de résultats
        updateResultCount(visibleCount);
    }
    
    /**
     * Met à jour le compteur de résultats
     */
    function updateResultCount(count) {
        resultCount.textContent = `${count} restaurant${count > 1 ? 's' : ''} trouvé${count > 1 ? 's' : ''}`;
    }
});