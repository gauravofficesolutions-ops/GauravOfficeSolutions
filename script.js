// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const productsGrid = document.getElementById('productsGrid');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close mobile menu on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Global variables for pagination
let currentProducts = [];
let currentPage = 1;
let itemsPerPage = 50;
let selectedProducts = new Set(); // Track selected products for quote

// Product loading and display
async function loadProducts() {
    try {
        // Show loading spinner
        productsGrid.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
            </div>
        `;

        const response = await fetch('products.json');
        if (!response.ok) {
            throw new Error('Failed to load products');
        }
        
        const products = await response.json();
        
        // Use the products directly as they're already in the correct format
        const transformedProducts = products.map(product => ({
            name: product.name,
            description: product.description,
            long_description: product.readMore,
            category: product.category,
            tags: [],
            image: product.image,
            price: product.price,
            contactAction: product.contactAction
        }));
        
        // Debug: Log category distribution
        const categoryCount = {};
        transformedProducts.forEach(product => {
            categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
        });
        console.log('Office Product Categories:', categoryCount);
        
        // Store all products globally for filtering
        currentProducts = transformedProducts;
        
        // Display products with pagination
        displayProducts(transformedProducts, 1, itemsPerPage);
        
    } catch (error) {
        console.error('Error loading products:', error);
        productsGrid.innerHTML = `
            <div class="error-message">
                <h3>Unable to load products</h3>
                <p>Please try refreshing the page or contact us for assistance.</p>
            </div>
        `;
    }
}

function displayProducts(products, page = 1, itemsPerPage = 50) {
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <h3>No products available</h3>
                <p>Please check back later for our latest products.</p>
            </div>
        `;
        return;
    }

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = products.slice(startIndex, endIndex);
    
    productsGrid.innerHTML = paginatedProducts.map(product => createProductCard(product)).join('');
    
    // Add pagination controls
    addPaginationControls(products, page, itemsPerPage);
    
    // Add intersection observer for animations
    addScrollAnimations();
}

function addPaginationControls(products, currentPage, itemsPerPage) {
    const totalPages = Math.ceil(products.length / itemsPerPage);
    
    if (totalPages <= 1) return;
    
    // Generate page number buttons
    let pageButtons = '';
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        pageButtons += `
            <button class="page-number-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }
    
    const paginationHTML = `
        <div class="pagination">
            <button class="pagination-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i> Previous
            </button>
            
            <div class="page-numbers">
                ${pageButtons}
            </div>
            
            <div class="page-info">
                <div class="current-page">Page ${currentPage} of ${totalPages}</div>
                <div class="total-products">${products.length} total products</div>
            </div>
            
            <button class="pagination-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
                Next <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    `;
    
    // Remove existing pagination
    const existingPagination = document.querySelector('.pagination');
    if (existingPagination) {
        existingPagination.remove();
    }
    
    productsGrid.insertAdjacentHTML('afterend', paginationHTML);
}

function changePage(page) {
    if (page < 1) return;
    const totalPages = Math.ceil(currentProducts.length / itemsPerPage);
    if (page > totalPages) return;
    
    currentPage = page;
    displayProducts(currentProducts, currentPage, itemsPerPage);
    
    // Scroll to top of products section
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

function createProductCard(product) {
    const imageUrl = product.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDMwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjUwIiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmN2YzZjA7c3RvcC1vcGFjaXR5OjEiIC8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2U4ZTRlMTtzdG9wLW9wYWNpdHk6MSIgLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMDAiIHI9IjQwIiBmaWxsPSIjOEI0NTEzIiBvcGFjaXR5PSIwLjMiLz4KPGNpcmNsZSBjeD0iMTUwIiBjeT0iMTUwIiByPSIzMCIgZmlsbD0iIyMyQzYyODIiIG9wYWNpdHk9IjAuNCIvPgo8dGV4dCB4PSIxNTAiIHk9IjE4MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOEI0NTEzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+';
    const name = product.name || 'Unnamed Product';
    const shortDescription = product.description || 'No description available.';
    const longDescription = product.long_description || shortDescription;
    const category = product.category || 'Other';
    const tags = product.tags || [];
    const productId = `product-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create tags HTML (non-clickable)
    const tagsHTML = tags.length > 0 ? `
        <div class="product-tags">
            <span class="tag-text">${tags.join(', ')}</span>
        </div>
    ` : '';
    
    return `
        <div class="product-card" data-category="${category.toLowerCase().replace(/\s+/g, '-')}" data-product-id="${productId}">
            <div class="product-category">${category}</div>
            <img src="${imageUrl}" alt="${name}" class="product-image" loading="lazy" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDMwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjUwIiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmN2YzZjA7c3RvcC1vcGFjaXR5OjEiIC8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2U4ZTRlMTtzdG9wLW9wYWNpdHk6MSIgLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMDAiIHI9IjQwIiBmaWxsPSIjOEI0NTEzIiBvcGFjaXR5PSIwLjMiLz4KPGNpcmNsZSBjeD0iMTUwIiBjeT0iMTUwIiByPSIzMCIgZmlsbD0iIyMyQzYyODIiIG9wYWNpdHk9IjAuNCIvPgo8dGV4dCB4PSIxNTAiIHk9IjE4MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOEI0NTEzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'">
            <div class="product-content">
                <h3 class="product-name">${name}</h3>
                <p class="product-description">${shortDescription}</p>
                ${longDescription !== shortDescription ? `
                    <button class="expand-btn" onclick="toggleDescription('${productId}')">
                        <span class="expand-text">Read More</span>
                        <i class="fas fa-chevron-down expand-icon"></i>
                    </button>
                    <div class="product-long-description" id="long-desc-${productId}" style="display: none;">
                        <p>${longDescription}</p>
                    </div>
                ` : ''}
                ${tagsHTML}
                <button class="quote-btn" onclick="openWhatsApp('${name}', '${product.contactAction}')">
                    <i class="fab fa-whatsapp"></i> Price on Request
                </button>
            </div>
        </div>
    `;
}

// Toggle description function
function toggleDescription(productId) {
    const longDesc = document.getElementById(`long-desc-${productId}`);
    const expandBtn = document.querySelector(`[onclick="toggleDescription('${productId}')"]`);
    const expandText = expandBtn.querySelector('.expand-text');
    const expandIcon = expandBtn.querySelector('.expand-icon');
    
    if (longDesc.style.display === 'none') {
        longDesc.style.display = 'block';
        expandText.textContent = 'Read Less';
        expandIcon.style.transform = 'rotate(180deg)';
    } else {
        longDesc.style.display = 'none';
        expandText.textContent = 'Read More';
        expandIcon.style.transform = 'rotate(0deg)';
    }
}

// WhatsApp functionality
function openWhatsApp(productName, contactAction) {
    const message = contactAction || `Hello, I am interested in ${productName}. Please provide more details.`;
    const whatsappUrl = `https://wa.me/9398268465?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Quote functionality
function addToQuote(productName) {
    selectedProducts.add(productName);
    updateQuoteButton();
    
    // Show feedback
    const button = event.target.closest('.quote-btn');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Added';
    button.style.background = '#28a745';
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '';
    }, 1500);
}

function updateQuoteButton() {
    const quoteBtn = document.getElementById('quoteButton');
    if (quoteBtn) {
        const count = selectedProducts.size;
        quoteBtn.innerHTML = `<i class="fas fa-calculator"></i> Request Quote ${count > 0 ? `(${count})` : ''}`;
        quoteBtn.style.display = count > 0 ? 'block' : 'none';
    }
}

function requestQuote() {
    if (selectedProducts.size === 0) {
        alert('Please select at least one product to request a quote.');
        return;
    }
    
    const productList = Array.from(selectedProducts).join('\n• ');
    const message = `Hi! I'm interested in getting a quote for the following office products:\n\n• ${productList}\n\nPlease provide pricing and availability details. Thank you!`;
    
    const whatsappUrl = `https://wa.me/919398268465?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Scroll animations
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe product cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Search and filter functionality
function addSearchAndFilter() {
    // Create search and filter UI
    const searchFilterHTML = `
        <div class="search-filter-container">
            <div class="search-box">
                <input type="text" id="searchInput" placeholder="🔍 Search office products by name, description, or tags..." 
                       style="width: 100%; max-width: 500px; padding: 15px 25px; border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 30px; font-size: 1.1rem; outline: none; transition: all 0.3s ease; margin: 0 auto; display: block; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px);">
            </div>
            <div class="filter-section">
                <h3>Filter by Category</h3>
                <div class="filter-buttons" id="filterButtons">
                    <button class="filter-btn active" data-category="all">📦 All Products</button>
                </div>
            </div>
            <div class="product-count">
                <span id="productCount">Loading products...</span>
            </div>
            <div class="quote-section">
                <button id="quoteButton" class="quote-button" onclick="requestQuote()" style="display: none;">
                    <i class="fas fa-calculator"></i> Request Quote
                </button>
            </div>
        </div>
    `;
    
    productsGrid.insertAdjacentHTML('beforebegin', searchFilterHTML);
    
    // Add event listeners
    const searchInput = document.getElementById('searchInput');
    const filterButtonsContainer = document.getElementById('filterButtons');
    let allProducts = [];
    
    // Load all products for filtering
    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            // Use products directly as they're already in the correct format
            allProducts = products.map(product => ({
                name: product.name,
                description: product.description,
                long_description: product.readMore,
                category: product.category,
                tags: [],
                image: product.image,
                price: product.price,
                contactAction: product.contactAction
            }));
            
            // Get unique categories
            const categories = [...new Set(allProducts.map(p => p.category))];
            
            // Add category filter buttons
            categories.forEach(category => {
                const button = document.createElement('button');
                button.className = 'filter-btn';
                button.dataset.category = category;
                button.textContent = `🏷️ ${category}`;
                filterButtonsContainer.appendChild(button);
            });
            
            // Update product count
            document.getElementById('productCount').textContent = `Showing ${allProducts.length} office products`;
            
            // Add event listeners to new filter buttons
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    // Remove active class from all buttons
                    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    // Add active class to clicked button
                    btn.classList.add('active');
                    
                    const searchTerm = searchInput.value.toLowerCase();
                    filterProducts(searchTerm, btn.dataset.category);
                });
            });
        });
    
    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterProducts(searchTerm, getActiveCategory());
    });
    
    function getActiveCategory() {
        const activeBtn = document.querySelector('.filter-btn.active');
        return activeBtn ? activeBtn.dataset.category : 'all';
    }
    
    function filterProducts(searchTerm, category) {
        console.log('Filtering by category:', category, 'search term:', searchTerm);
        
        const filtered = allProducts.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                                product.description.toLowerCase().includes(searchTerm) ||
                                product.long_description.toLowerCase().includes(searchTerm);
            const matchesCategory = category === 'all' || product.category === category;
            return matchesSearch && matchesCategory;
        });
        
        console.log('Filtered products count:', filtered.length);
        
        // Update current products and reset to page 1
        currentProducts = filtered;
        currentPage = 1;
        
        // Update product count
        document.getElementById('productCount').textContent = `Showing ${filtered.length} office products`;
        
        // Display products with pagination
        displayProducts(filtered, 1, itemsPerPage);
    }
}

// Instagram Card Interactions
function initializeInstagramCard() {
    const likeBtn = document.querySelector('.like-btn');
    const likesCount = document.querySelector('.likes-count');
    const commentBtn = document.querySelector('.comment-btn');
    const shareBtn = document.querySelector('.share-btn');
    const bookmarkBtn = document.querySelector('.bookmark-btn');
    
    let isLiked = false;
    let isBookmarked = false;
    let currentLikes = 127;
    
    // Like functionality
    if (likeBtn) {
        likeBtn.addEventListener('click', () => {
            const heartIcon = likeBtn.querySelector('i');
            
            if (isLiked) {
                heartIcon.classList.remove('fas');
                heartIcon.classList.add('far');
                currentLikes--;
                likeBtn.style.color = '#262626';
            } else {
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
                currentLikes++;
                likeBtn.style.color = '#ed4956';
                
                // Add animation
                likeBtn.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    likeBtn.style.transform = 'scale(1)';
                }, 200);
            }
            
            isLiked = !isLiked;
            likesCount.textContent = `${currentLikes} likes`;
        });
    }
    
    // Bookmark functionality
    if (bookmarkBtn) {
        bookmarkBtn.addEventListener('click', () => {
            const bookmarkIcon = bookmarkBtn.querySelector('i');
            
            if (isBookmarked) {
                bookmarkIcon.classList.remove('fas');
                bookmarkIcon.classList.add('far');
                bookmarkBtn.style.color = '#262626';
            } else {
                bookmarkIcon.classList.remove('far');
                bookmarkIcon.classList.add('fas');
                bookmarkBtn.style.color = '#2d5016';
                
                // Add animation
                bookmarkBtn.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    bookmarkBtn.style.transform = 'scale(1)';
                }, 200);
            }
            
            isBookmarked = !isBookmarked;
        });
    }
    
    // Comment functionality
    if (commentBtn) {
        commentBtn.addEventListener('click', () => {
            // Open WhatsApp for comments/feedback
            const message = "Hi! I saw your Instagram post about office solutions. I'd like to know more about your products and services.";
            const whatsappUrl = `https://wa.me/9398268465?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    }
    
    // Share functionality
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            if (navigator.share) {
                navigator.share({
                    title: 'Gaurav Office Solutions',
                    text: 'Check out Gaurav Office Solutions for premium office supplies and waste management solutions!',
                    url: window.location.href
                });
            } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(window.location.href).then(() => {
                    // Show feedback
                    const originalIcon = shareBtn.querySelector('i');
                    const originalClass = originalIcon.className;
                    originalIcon.className = 'fas fa-check';
                    shareBtn.style.color = '#28a745';
                    
                    setTimeout(() => {
                        originalIcon.className = originalClass;
                        shareBtn.style.color = '#262626';
                    }, 1500);
                });
            }
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    
    // Add search and filter after products are loaded
    setTimeout(() => {
        addSearchAndFilter();
    }, 1000);
    
    // Initialize Instagram card interactions
    setTimeout(() => {
        initializeInstagramCard();
    }, 1500);
});

// Error handling for images
document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDMwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjUwIiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmN2YzZjA7c3RvcC1vcGFjaXR5OjEiIC8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2U4ZTRlMTtzdG9wLW9wYWNpdHk6MSIgLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMDAiIHI9IjQwIiBmaWxsPSIjOEI0NTEzIiBvcGFjaXR5PSIwLjMiLz4KPGNpcmNsZSBjeD0iMTUwIiBjeT0iMTUwIiByPSIzMCIgZmlsbD0iIyMyQzYyODIiIG9wYWNpdHk9IjAuNCIvPgo8dGV4dCB4PSIxNTAiIHk9IjE4MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOEI0NTEzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+';
    }
}, true);
