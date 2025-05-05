
const siteData = {

    // المهارات
    skills: [
        { name: "التصميم الجرافيكي", level: 95, icon: "fas fa-paint-brush" },
        { name: "الموشن جرافيك", level: 65, icon: "fas fa-film" },
        { name: "المونتاج", level: 85, icon: "fas fa-video" },
        { name: "التعليق الصوتي", level: 70, icon: "fas fa-microphone" },
        { name: "تطوير الويب", level: 75, icon: "fas fa-code" }
    ],
    
    // معرض الأعمال
    portfolio: [
        { 
            category: "graphic", 
            image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80", 
            title: "تصميم شعار", 
            description: "هوية بصرية لمطعم شهير متخصص في المأكولات البحرية",
            client: "مطعم البحر الأحمر",
            date: "يناير 2023",
            tags: ["شعار", "هوية بصرية", "تصميم جرافيك"]
        },
        { 
            category: "motion", 
            image: "https://images.unsplash.com/photo-1579389083078-4e7018379f7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80", 
            title: "إعلان متحرك", 
            description: "إعلان ترويجي لمنتج جديد لشركة تكنولوجيا",
            client: "شركة تكنو",
            date: "مارس 2023",
            tags: ["موشن جرافيك", "إعلان", "رسوم متحركة"]
        },
        { 
            category: "video", 
            image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80", 
            title: "فيديو ترويجي", 
            description: "فيديو ترويجي لمنتج جديد مع تأثيرات بصرية متقدمة",
            client: "شركة إنتاج",
            date: "مايو 2023",
            tags: ["مونتاج", "فيديو", "تأثيرات بصرية"]
        },
        { 
            category: "voice", 
            image: "https://images.unsplash.com/photo-1558379850-823f103f866a?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80", 
            title: "إعلان صوتي", 
            description: "تسجيل صوتي لإعلان إذاعي لشركة اتصالات",
            client: "شركة اتصالات",
            date: "أبريل 2023",
            tags: ["تعليق صوتي", "إعلان إذاعي", "تسجيل صوتي"]
        },
        { 
            category: "web", 
            image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80", 
            title: "موقع تجاري", 
            description: "تصميم وتطوير موقع إلكتروني لشركة ناشئة",
            client: "شركة ناشئة",
            date: "فبراير 2023",
            tags: ["تطوير ويب", "تصميم موقع", "واجهة مستخدم"]
        },
        { 
            category: "graphic", 
            image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80", 
            title: "بروشور دعائي", 
            description: "تصميم بروشور لمؤتمر تقني مع تصميمات جرافيكية مبدعة",
            client: "مؤتمر تك",
            date: "ديسمبر 2022",
            tags: ["بروشور", "تصميم مطبوعات", "جرافيك"]
        },
        { 
            category: "motion", 
            image: "https://images.unsplash.com/photo-1579389083078-4e7018379f7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80", 
            title: "عرض تقديمي", 
            description: "عرض تقديمي متحرك لشركة استثمارية",
            client: "شركة استثمار",
            date: "يونيو 2023",
            tags: ["عرض تقديمي", "موشن جرافيك", "شرائح متحركة"]
        },
        { 
            category: "video", 
            image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80", 
            title: "فيديو تعليمي", 
            description: "فيديو تعليمي مع رسوم متحركة وتأثيرات بصرية",
            client: "منصة تعليمية",
            date: "يوليو 2023",
            tags: ["فيديو تعليمي", "مونتاج", "رسوم متحركة"]
        }
    ],
};

// تنفيذ الكود عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initHeroAnimations();
    loadDynamicData();
    createParticles(document.getElementById('skillsParticles'), 30);
});

// ==================== الوظائف الأساسية ====================

function loadDynamicData() {
    loadSkillsSection();
    loadPortfolio();
    initPortfolioLightbox();
}



// ==================== hero sec ====================


// تأثيرات Hero Section
function initHeroAnimations() {
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        heroImage.addEventListener('mouseenter', () => {
            gsap.to(heroImage.querySelector('img'), {
                scale: 1.05,
                duration: 0.5
            });
        });
        
        heroImage.addEventListener('mouseleave', () => {
            gsap.to(heroImage.querySelector('img'), {
                scale: 1,
                duration: 0.5
            });
        });
    }
}



// ==================== معرض الأعمال المحسن ====================

function loadPortfolio() {
    const portfolioContainer = document.querySelector('.portfolio-grid');
    const shownCountElement = document.querySelector('.shown-count');
    const totalCountElement = document.querySelector('.total-count');
    
    portfolioContainer.innerHTML = '';
    totalCountElement.textContent = siteData.portfolio.length;
    
    let shownCount = 0;
    const initialItemsToShow = 6;
    
    siteData.portfolio.forEach((item, index) => {
        const portfolioHTML = `
            <div class="portfolio-item" 
                 data-category="${item.category}" 
                 data-index="${index}"
                 data-title="${item.title.toLowerCase()}"
                 data-client="${item.client.toLowerCase()}"
                 data-tags="${item.tags.join(',')}">
                <img src="${item.image}" alt="${item.title}" class="portfolio-img" loading="lazy">
                <div class="portfolio-overlay">
                    <div class="overlay-content">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                        <div class="portfolio-meta">
                            <span><i class="fas fa-user"></i> ${item.client}</span>
                            <span><i class="fas fa-calendar"></i> ${item.date}</span>
                        </div>
                        <a href="#" class="btn btn-view" data-project="${item.title}">
                            <i class="fas fa-expand"></i> عرض المشروع
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        if (index < initialItemsToShow) {
            portfolioContainer.insertAdjacentHTML('beforeend', portfolioHTML);
            shownCount++;
        } else {
            portfolioContainer.insertAdjacentHTML('beforeend', 
                portfolioHTML.replace('class="portfolio-item"', 'class="portfolio-item" style="display:none"'));
        }
    });
    
    shownCountElement.textContent = shownCount;
    initPortfolioFilter();
    initPortfolioSearch();
    initLoadMore();
}

function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterValue = button.dataset.filter;
            filterPortfolioItems(filterValue);
        });
    });
}

function filterPortfolioItems(filterValue = 'all', searchTerm = '') {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const shownCountElement = document.querySelector('.shown-count');
    let shownCount = 0;
    
    portfolioItems.forEach(item => {
        const matchesFilter = filterValue === 'all' || item.dataset.category === filterValue;
        const matchesSearch = searchTerm === '' || 
                             item.dataset.title.includes(searchTerm) || 
                             item.dataset.client.includes(searchTerm) ||
                             item.dataset.tags.includes(searchTerm);
        
        if (matchesFilter && matchesSearch) {
            gsap.to(item, {
                display: 'block',
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => shownCount++
            });
        } else {
            gsap.to(item, {
                display: 'none',
                opacity: 0,
                y: 20,
                duration: 0.3,
                ease: "power2.in"
            });
        }
    });
    
    setTimeout(() => {
        shownCountElement.textContent = document.querySelectorAll('.portfolio-item[style*="display: block"], .portfolio-item:not([style])').length;
    }, 500);
}

function initPortfolioSearch() {
    const searchInput = document.querySelector('.search-input');
    
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        filterPortfolioItems(activeFilter, searchTerm);
    });
}

function initLoadMore() {
    const loadMoreBtn = document.querySelector('.btn-load-more');
    if (!loadMoreBtn) return;
    
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    let itemsPerLoad = 3;
    let visibleItems = document.querySelectorAll('.portfolio-item[style*="display: block"], .portfolio-item:not([style])').length;
    
    loadMoreBtn.addEventListener('click', () => {
        let loadedCount = 0;
        
        portfolioItems.forEach((item, index) => {
            if (loadedCount >= itemsPerLoad) return;
            
            if (item.style.display === 'none') {
                gsap.to(item, {
                    display: 'block',
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    delay: index % itemsPerLoad * 0.1
                });
                loadedCount++;
                visibleItems++;
            }
        });
        
        if (visibleItems >= portfolioItems.length) {
            gsap.to(loadMoreBtn, {
                opacity: 0,
                y: 20,
                duration: 0.3,
                onComplete: () => loadMoreBtn.style.display = 'none'
            });
        }
        
        document.querySelector('.shown-count').textContent = visibleItems;
    });
    
    if (visibleItems >= portfolioItems.length) {
        loadMoreBtn.style.display = 'none';
    }
}

function initPortfolioLightbox() {
    const lightbox = document.createElement('div');
    lightbox.className = 'portfolio-lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="close-lightbox">&times;</span>
            <div class="lightbox-image-container">
                <img src="" alt="" class="lightbox-image">
                <div class="image-nav">
                    <button class="nav-btn prev-btn"><i class="fas fa-chevron-right"></i></button>
                    <button class="nav-btn next-btn"><i class="fas fa-chevron-left"></i></button>
                </div>
            </div>
            <div class="lightbox-info">
                <h3></h3>
                <p class="info-description"></p>
                <div class="info-meta">
                    <p><i class="fas fa-user"></i> <span class="info-client"></span></p>
                    <p><i class="fas fa-calendar"></i> <span class="info-date"></span></p>
                    <p><i class="fas fa-tag"></i> <span class="info-category"></span></p>
                </div>
                <div class="project-tags"></div>
            </div>
        </div>
    `;
    document.body.appendChild(lightbox);
    
    let currentIndex = 0;
    let filteredItems = [];
    
    document.querySelectorAll('.portfolio-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
            const searchTerm = document.querySelector('.search-input').value.trim().toLowerCase();
            
            filteredItems = Array.from(document.querySelectorAll('.portfolio-item')).filter(item => {
                const matchesFilter = activeFilter === 'all' || item.dataset.category === activeFilter;
                const matchesSearch = searchTerm === '' || 
                                     item.dataset.title.includes(searchTerm) || 
                                     item.dataset.client.includes(searchTerm) ||
                                     item.dataset.tags.includes(searchTerm);
                return matchesFilter && matchesSearch && window.getComputedStyle(item).display !== 'none';
            });
            
            currentIndex = filteredItems.findIndex(el => el === this);
            showProjectInLightbox(currentIndex);
            
            lightbox.classList.add('active');
            document.body.classList.add('no-scroll');
            
            gsap.from(lightbox.querySelector('.lightbox-content'), {
                opacity: 0,
                y: 50,
                duration: 0.5,
                ease: "back.out(1.7)"
            });
        });
    });
    
    lightbox.querySelector('.prev-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        navigateProject(-1);
    });
    
    lightbox.querySelector('.next-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        navigateProject(1);
    });
    
    lightbox.querySelector('.close-lightbox').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => e.target === lightbox && closeLightbox());
    
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateProject(-1);
            if (e.key === 'ArrowRight') navigateProject(1);
        }
    });
    
    function navigateProject(direction) {
        currentIndex = (currentIndex + direction + filteredItems.length) % filteredItems.length;
        showProjectInLightbox(currentIndex);
    }
    
    function showProjectInLightbox(index) {
        if (!filteredItems.length) return;
        
        const item = filteredItems[index];
        const projectTitle = item.querySelector('h3').textContent;
        const project = siteData.portfolio.find(p => p.title === projectTitle);
        
        if (!project) return;
        
        const lightboxImg = lightbox.querySelector('.lightbox-image');
        const lightboxTitle = lightbox.querySelector('h3');
        const lightboxDesc = lightbox.querySelector('.info-description');
        const lightboxClient = lightbox.querySelector('.info-client');
        const lightboxDate = lightbox.querySelector('.info-date');
        const lightboxCategory = lightbox.querySelector('.info-category');
        const tagsContainer = lightbox.querySelector('.project-tags');
        
        gsap.to(lightboxImg, { opacity: 0, duration: 0.3 });
        lightboxImg.src = project.image;
        lightboxImg.alt = project.title;
        lightboxImg.onload = () => {
            gsap.to(lightboxImg, { opacity: 1, duration: 0.5 });
        };
        
        lightboxTitle.textContent = project.title;
        lightboxDesc.textContent = project.description;
        lightboxClient.textContent = project.client;
        lightboxDate.textContent = project.date;
        
        const categoryNames = {
            'graphic': 'تصميم جرافيك',
            'motion': 'موشن جرافيك',
            'video': 'مونتاج فيديو',
            'voice': 'تعليق صوتي',
            'web': 'تطوير ويب'
        };
        lightboxCategory.textContent = categoryNames[project.category] || project.category;
        
        tagsContainer.innerHTML = '';
        project.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'tag';
            tagElement.textContent = tag;
            tagsContainer.appendChild(tagElement);
        });
        
        gsap.from([lightboxTitle, lightboxDesc, lightbox.querySelector('.info-meta'), tagsContainer], {
            opacity: 0,
            y: 20,
            duration: 0.3,
            stagger: 0.1,
            delay: 0.3
        });
    }
    
    function closeLightbox() {
        gsap.to(lightbox.querySelector('.lightbox-content'), {
            opacity: 0,
            y: 50,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                lightbox.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    }
}

// ==================== قسم المهارات المتقدم ====================

function loadSkillsSection() {
    const skillsGrid = document.getElementById('skillsGrid');
    
    const enhancedSkills = siteData.skills.map(skill => {
        const projects = siteData.portfolio.filter(p => p.category === 
            (skill.name === 'التصميم الجرافيكي' ? 'graphic' :
             skill.name === 'الموشن جرافيك' ? 'motion' :
             skill.name === 'المونتاج' ? 'video' :
             skill.name === 'التعليق الصوتي' ? 'voice' : 'web'));
        
        return {
            ...skill,
            projects: projects.slice(0, 3),
            allProjects: projects,
            projectsCount: projects.length, // استخدام عدد المشاريع مباشرة من البورتفوليو
            category: getSkillCategory(skill.name)
        };
    });
    
    function getSkillCategory(skillName) {
        const designSkills = ['التصميم الجرافيكي', 'الموشن جرافيك'];
        const mediaSkills = ['المونتاج', 'التعليق الصوتي'];
        
        if (designSkills.includes(skillName)) return 'design';
        if (mediaSkills.includes(skillName)) return 'media';
        if (skillName === 'تطوير الويب') return 'development';
        return 'other';
    }
    
    enhancedSkills.forEach(skill => {
        const skillCard = document.createElement('div');
        skillCard.className = 'skill-card';
        skillCard.dataset.skill = skill.name;
        skillCard.dataset.category = skill.category;
        skillCard.style.setProperty('--skill-percent', skill.level);
        skillCard.style.setProperty('--skill-color', 
            skill.name === 'التصميم الجرافيكي' ? '#FD79A8' :
            skill.name === 'الموشن جرافيك' ? '#6C5CE7' :
            skill.name === 'المونتاج' ? '#00CEFF' :
            skill.name === 'التعليق الصوتي' ? '#00B894' : '#FDCB6E');
        
        skillCard.innerHTML = `
            <div class="skill-card-inner">
                <div class="skill-card-header">
                    <div class="skill-icon-container">
                        <div class="skill-icon-bg"></div>
                        <div class="skill-icon">
                            <i class="${skill.icon}"></i>
                        </div>
                    </div>
                    <div class="skill-title-container">
                        <h3 class="skill-title">${skill.name}</h3>
                    </div>
                </div>
                
                <div class="skill-level-text">
                    <i class="fas fa-chart-line"></i>
                    <span>مستوى الإتقان: <strong>${skill.level}%</strong></span>
                </div>
                
                ${skill.projects.length > 0 ? `
                <div class="skill-projects-container">
                    <h4 class="skill-projects-title">
                        <i class="fas fa-folder-open"></i> مشاريع حديثة (${skill.projectsCount})
                    </h4>
                    <div class="skill-projects-grid">
                        ${skill.projects.map(project => `
                            <div class="skill-project-thumb" 
                                 data-title="${project.title}"
                                 data-description="${project.description}"
                                 data-client="${project.client}"
                                 data-date="${project.date}"
                                 data-category="${project.category}">
                                <img src="${project.image}" alt="${project.title}">
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        `;
        
        skillsGrid.appendChild(skillCard);
    });
    
    initProjectLightbox();
    
    const skillCards = document.querySelectorAll('.skill-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gsap.to(entry.target, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "back.out(1.2)",
                    delay: Array.from(skillCards).indexOf(entry.target) * 0.1
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    skillCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        observer.observe(card);
    });
}

function createParticles(container, count) {
    container.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'skill-particle';
        
        const size = Math.random() * 10 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        const hue = 250;
        const saturation = 70;
        const lightness = Math.random() * 20 + 60;
        particle.style.background = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.2)`;
        
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
        
        container.appendChild(particle);
    }
}

function initProjectLightbox() {
    const lightbox = document.getElementById('projectLightbox');
    const closeBtn = lightbox.querySelector('.close-lightbox');
    const projectThumbs = document.querySelectorAll('.skill-project-thumb');
    
    projectThumbs.forEach(thumb => {
        thumb.addEventListener('click', function() {
            const title = this.dataset.title;
            const description = this.dataset.description;
            const client = this.dataset.client;
            const date = this.dataset.date;
            const category = this.dataset.category;
            const imageSrc = this.querySelector('img').src;
            
            lightbox.querySelector('.lightbox-image').src = imageSrc;
            lightbox.querySelector('h3').textContent = title;
            lightbox.querySelector('p').textContent = description;
            lightbox.querySelector('.lightbox-client').textContent = client;
            lightbox.querySelector('.lightbox-date').textContent = date;
            
            const categoryNames = {
                'graphic': 'تصميم جرافيك',
                'motion': 'موشن جرافيك',
                'video': 'مونتاج فيديو',
                'voice': 'تعليق صوتي',
                'web': 'تطوير ويب'
            };
            lightbox.querySelector('.lightbox-category').textContent = 
                categoryNames[category] || category;
            
            lightbox.classList.add('active');
            document.body.classList.add('no-scroll');
        });
    });
    
    closeBtn.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });
}

// تأثيرات Hero Section المحسنة
function initHeroAnimations() {
    // تأثير الكتابة للعنوان
    const titleLines = document.querySelectorAll('.title-line');
    titleLines.forEach((line, index) => {
        gsap.from(line, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.2,
            ease: "back.out(1.2)"
        });
    });

    // تأثير الصورة
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        heroImage.addEventListener('mouseenter', () => {
            gsap.to(heroImage.querySelector('img'), {
                scale: 1.05,
                duration: 0.5
            });
            gsap.to('.image-frame', {
                borderColor: 'rgba(255, 255, 255, 0.3)',
                duration: 0.5
            });
        });
        
        heroImage.addEventListener('mouseleave', () => {
            gsap.to(heroImage.querySelector('img'), {
                scale: 1,
                duration: 0.5
            });
            gsap.to('.image-frame', {
                borderColor: 'rgba(255, 255, 255, 0.1)',
                duration: 0.5
            });
        });
    }

    // تأثير الأيقونات الاجتماعية
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            gsap.to(icon, {
                y: -5,
                duration: 0.3
            });
        });
        
        icon.addEventListener('mouseleave', () => {
            gsap.to(icon, {
                y: 0,
                duration: 0.3
            });
        });
    });

    // تأثير الأشكال الخلفية
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach(shape => {
        gsap.to(shape, {
            rotation: 360,
            duration: shape.classList.contains('square') ? 20 : 40,
            repeat: -1,
            ease: "none"
        });
    });
}