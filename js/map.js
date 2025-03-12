/**
 * Carte interactive pour les restaurants du 12ème arrondissement
 * Utilise Leaflet.js et OpenStreetMap
 */

document.addEventListener('DOMContentLoaded', function() {
    // Coordonnées du centre de la carte (12ème arrondissement de Paris)
    const CENTER_LAT = 48.8420;
    const CENTER_LNG = 2.3919;
    const DEFAULT_ZOOM = 14;
    
    // Création de la carte
    const map = L.map('map').setView([CENTER_LAT, CENTER_LNG], DEFAULT_ZOOM);
    
    // Ajout des tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Données des restaurants (avec coordonnées)
    const restaurants = [
        {
            name: "Le Quincy",
            cuisine: "Cuisine traditionnelle française",
            rating: 4.7,
            reviews: 962,
            address: "28 Avenue Ledru-Rollin, 75012 Paris",
            lat: 48.8491,
            lng: 2.3754,
            color: "#d35400"
        },
        {
            name: "Le Lys d'Or",
            cuisine: "Cuisine chinoise traditionnelle",
            rating: 4.5,
            reviews: 743,
            address: "5 Rue de Lyon, 75012 Paris",
            lat: 48.8479,
            lng: 2.3698,
            color: "#c0392b"
        },
        {
            name: "Les Zygomates",
            cuisine: "Bistrot parisien",
            rating: 4.4,
            reviews: 825,
            address: "7 Rue de Capri, 75012 Paris",
            lat: 48.8447,
            lng: 2.3881,
            color: "#8e44ad"
        },
        {
            name: "Le Cidre d'Or",
            cuisine: "Crêperie bretonne",
            rating: 4.3,
            reviews: 678,
            address: "46 Avenue Daumesnil, 75012 Paris",
            lat: 48.8450,
            lng: 2.3811,
            color: "#27ae60"
        },
        {
            name: "Underground Coffee Gare de Lyon",
            cuisine: "Café-restaurant",
            rating: 4.2,
            reviews: 542,
            address: "22 Boulevard Diderot, 75012 Paris",
            lat: 48.8442,
            lng: 2.3729,
            color: "#2980b9"
        },
        {
            name: "Anco",
            cuisine: "Cuisine méditerranéenne",
            rating: 4.3,
            reviews: 389,
            address: "15 Rue Crozatier, 75012 Paris",
            lat: 48.8472,
            lng: 2.3826,
            color: "#16a085"
        },
        {
            name: "Le Train Bleu",
            cuisine: "Gastronomie française",
            rating: 4.1,
            reviews: 2453,
            address: "Gare de Lyon, Place Louis-Armand, 75012 Paris",
            lat: 48.8443,
            lng: 2.3737,
            color: "#2c3e50"
        },
        {
            name: "La Table du Cambodge",
            cuisine: "Cuisine cambodgienne",
            rating: 4.2,
            reviews: 356,
            address: "33 Rue de Picpus, 75012 Paris",
            lat: 48.8421,
            lng: 2.3964,
            color: "#7f8c8d"
        },
        {
            name: "Pizzeria Tripletta Reuilly",
            cuisine: "Pizzeria italienne",
            rating: 4.5,
            reviews: 729,
            address: "15 Boulevard de Reuilly, 75012 Paris",
            lat: 48.8383,
            lng: 2.3901,
            color: "#e74c3c"
        },
        {
            name: "Brasserie Happyculture",
            cuisine: "Brasserie moderne",
            rating: 4.0,
            reviews: 483,
            address: "24 Rue de Charenton, 75012 Paris",
            lat: 48.8486,
            lng: 2.3714,
            color: "#f39c12"
        }
    ];
    
    const markers = [];
    
    // Fonction pour créer le HTML des infobulles
    function createPopupContent(restaurant) {
        return `
            <div class="map-info">
                <h3>${restaurant.name}</h3>
                <p class="cuisine">${restaurant.cuisine}</p>
                <div class="rating">
                    <span class="stars">${getStarsHTML(restaurant.rating)}</span>
                    <span>${restaurant.rating}/5 (${restaurant.reviews} avis)</span>
                </div>
                <p class="address">${restaurant.address}</p>
                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.name + ' ' + restaurant.address)}" target="_blank" class="link">Voir sur Google Maps</a>
            </div>
        `;
    }
    
    // Fonction pour générer les étoiles HTML
    function getStarsHTML(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        let starsHTML = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '★';
        }
        
        if (halfStar) {
            starsHTML += '☆';
        }
        
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '☆';
        }
        
        return starsHTML;
    }
    
    // Ajouter les marqueurs pour chaque restaurant
    restaurants.forEach(restaurant => {
        const marker = L.circleMarker([restaurant.lat, restaurant.lng], {
            radius: 8,
            fillColor: restaurant.color,
            color: "#fff",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);
        
        marker.bindPopup(createPopupContent(restaurant));
        marker.restaurant = restaurant;
        markers.push(marker);
        
        // Événements de survol pour les marqueurs
        marker.on('mouseover', function() {
            this.setRadius(12);
            this.setStyle({
                fillOpacity: 1,
                weight: 2
            });
        });
        
        marker.on('mouseout', function() {
            this.setRadius(8);
            this.setStyle({
                fillOpacity: 0.8,
                weight: 1
            });
        });
    });
    
    // Fonction pour filtrer les marqueurs (intégration avec le système de filtrage existant)
    function filterMarkers(cuisine, minRating, searchTerm) {
        markers.forEach(marker => {
            const restaurant = marker.restaurant;
            
            const matchesCuisine = cuisine === 'all' || restaurant.cuisine.toLowerCase().includes(cuisine.toLowerCase());
            const matchesRating = minRating === 'all' || restaurant.rating >= parseFloat(minRating);
            const matchesSearch = searchTerm === '' || 
                restaurant.name.toLowerCase().includes(searchTerm) || 
                restaurant.cuisine.toLowerCase().includes(searchTerm) || 
                restaurant.address.toLowerCase().includes(searchTerm);
            
            if (matchesCuisine && matchesRating && matchesSearch) {
                marker.setStyle({
                    opacity: 1,
                    fillOpacity: 0.8
                });
            } else {
                marker.setStyle({
                    opacity: 0.2,
                    fillOpacity: 0.2
                });
            }
        });
    }
    
    // Intégration avec les filtres existants si disponibles
    const cuisineFilter = document.getElementById('cuisine-filter');
    const ratingFilter = document.getElementById('rating-filter');
    const searchInput = document.getElementById('search-input');
    
    if (cuisineFilter && ratingFilter && searchInput) {
        const updateFilters = function() {
            const selectedCuisine = cuisineFilter.value;
            const selectedRating = ratingFilter.value;
            const searchTerm = searchInput.value.toLowerCase().trim();
            
            filterMarkers(selectedCuisine, selectedRating, searchTerm);
        };
        
        cuisineFilter.addEventListener('change', updateFilters);
        ratingFilter.addEventListener('change', updateFilters);
        searchInput.addEventListener('input', updateFilters);
        
        // Bouton pour centrer la carte
        const centerMapButton = document.getElementById('center-map');
        if (centerMapButton) {
            centerMapButton.addEventListener('click', function() {
                map.setView([CENTER_LAT, CENTER_LNG], DEFAULT_ZOOM);
            });
        }
    }
});