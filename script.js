/**
 * ملف JavaScript لموقع سيرة ذاتية إبداعية
 * يحتوي على جميع الوظائف التفاعلية للموقع مع تحسينات معرض الأعمال
 */

// بيانات الموقع
const siteData = {
    // معلومات الشخصية
    info: {
        name: "محمد المطر",
        jobTitle: "مصمم جرافيك وموشن جرافيكر",
        location: "الأحساء، المملكة العربية السعودية",
        email: "mohammad.bin.ismael@gmail.com",
        phone: "+966 55 490 9663",
        workingHours: "الأحد - الخميس: 9ص - 5م",
        socialLinks: {
            behance: "#",
            dribbble: "#",
            linkedin: "#",
            instagram: "#",
            github: "#"
        }
    },

    // المهارات
    skills: [
        { name: "التصميم الجرافيكي", level: 95, icon: "fas fa-paint-brush" },
        { name: "الموشن جرافيك", level: 65, icon: "fas fa-film" },
        { name: "المونتاج", level: 85, icon: "fas fa-video" },
        { name: "التعليق الصوتي", level: 70, icon: "fas fa-microphone" },
        { name: "تطوير الويب", level: 75, icon: "fas fa-code" }
    ],
    
    // الخدمات
    services: [
        { 
            icon: "fas fa-paint-brush", 
            title: "التصميم الجرافيكي", 
            description: "تصميم شعارات، بروشورات، بطاقات عمل، هويات بصرية وغيرها من المواد التسويقية.",
            projects: 42
        },
        { 
            icon: "fas fa-film", 
            title: "الموشن جرافيك", 
            description: "إنشاء فيديوهات إعلانية متحركة، عرض منتجات، شروحات وغيرها من الرسوم المتحركة.",
            projects: 28
        },
        { 
            icon: "fas fa-video", 
            title: "المونتاج", 
            description: "تعديل وتحرير الفيديو، إضافة تأثيرات، تحسين الصوت والصورة وتجهيز الفيديو للنشر.",
            projects: 35
        },
        { 
            icon: "fas fa-microphone", 
            title: "التعليق الصوتي", 
            description: "تسجيل صوت احترافي للإعلانات، الفيديوهات التعليمية، الكتب الصوتية وغيرها.",
            projects: 15
        },
        { 
            icon: "fas fa-code", 
            title: "تطوير الويب", 
            description: "تصميم وتطوير مواقع الويب، واجهات المستخدم، تطبيقات الويب والتكاملات.",
            projects: 19
        }
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

    // المهارات التي تظهر في تأثير الكتابة
    professions: [
        "مصمم جرافيك",
        "موشن جرافيكر",
        "مونتير فيديو",
        "معلق صوتي",
        "مبرمج ويب"
    ]
};

// تنفيذ الكود عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة السنة الحالية
    initCurrentYear();
    
    // تهيئة تأثير الكتابة الآلية
    initTypingEffect();
    
    // تحميل البيانات الديناميكية
    loadDynamicData();
    
    // تهيئة القائمة المتحركة للهواتف
    initMobileMenu();
    
    // تهيئة فلترة معرض الأعمال
    initPortfolioFilter();
    
    // تهيئة نموذج التواصل
    initContactForm();
    
    // تهيئة التمرير السلس
    initSmoothScrolling();
    
    // تهيئة تأثيرات الحركة
    initAnimations();
    
    // تهيئة مشغل الفيديو
    initVideoPlayer();
    
    // تهيئة التحليلات
    initAnalytics();
});

// ==================== الوظائف الأساسية ====================

function initCurrentYear() {
    document.getElementById('year').textContent = new Date().getFullYear();
}

function initTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    const professions = siteData.professions;
    
    let currentProfession = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;
    let timeoutId;

    function type() {
        if (isPaused) return;

        const currentText = professions[currentProfession];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            timeoutId = setTimeout(type, 50);
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            timeoutId = setTimeout(type, 150);
        }

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(type, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            currentProfession = (currentProfession + 1) % professions.length;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(type, 500);
        }
    }

    const heroSection = document.querySelector('.hero');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isPaused = !entry.isIntersecting;
            if (entry.isIntersecting && !timeoutId && charIndex === 0) {
                timeoutId = setTimeout(type, 1000);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(heroSection);

    window.addEventListener('beforeunload', () => {
        clearTimeout(timeoutId);
    });
}

function loadDynamicData() {
    loadSkills();
    loadSkillsSection();
    loadServices();
    loadPortfolio();
    loadContactInfo();
}

function loadSkills() {
    const skillsContainer = document.querySelector('.skills');
    skillsContainer.innerHTML = '';
    
    siteData.skills.forEach(skill => {
        const skillHTML = `
            <div class="skill">
                <div class="skill-name">
                    <span>${skill.name}</span>
                    <span>${skill.level}%</span>
                </div>
                <div class="skill-bar">
                    <div class="skill-level" style="width: ${skill.level}%"></div>
                </div>
            </div>
        `;
        skillsContainer.insertAdjacentHTML('beforeend', skillHTML);
    });
}

function loadServices() {
    const servicesContainer = document.querySelector('.services-grid');
    servicesContainer.innerHTML = '';
    
    siteData.services.forEach(service => {
        const serviceHTML = `
            <div class="service-card">
                <div class="service-icon">
                    <i class="${service.icon}"></i>
                </div>
                <h3>${service.title}</h3>
                <p>${service.description}</p>
                <a href="#contact" class="service-link">اطلب الخدمة <i class="fas fa-arrow-left"></i></a>
            </div>
        `;
        servicesContainer.insertAdjacentHTML('beforeend', serviceHTML);
    });
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
    
    // تحديث العداد بعد انتهاء الانتقالات
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
        
        // إخفاء الزر إذا تم عرض كل العناصر
        if (visibleItems >= portfolioItems.length) {
            gsap.to(loadMoreBtn, {
                opacity: 0,
                y: 20,
                duration: 0.3,
                onComplete: () => loadMoreBtn.style.display = 'none'
            });
        }
        
        // تحديث العداد
        document.querySelector('.shown-count').textContent = visibleItems;
    });
    
    // إخفاء الزر إذا كانت كل العناصر معروضة
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
    
    // أحداث التنقل والإغلاق
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
        
        // تأثير تحميل الصورة
        gsap.to(lightboxImg, { opacity: 0, duration: 0.3 });
        lightboxImg.src = project.image;
        lightboxImg.alt = project.title;
        lightboxImg.onload = () => {
            gsap.to(lightboxImg, { opacity: 1, duration: 0.5 });
        };
        
        // تعبئة المعلومات
        lightboxTitle.textContent = project.title;
        lightboxDesc.textContent = project.description;
        lightboxClient.textContent = project.client;
        lightboxDate.textContent = project.date;
        
        // تحويل الفئة إلى نص
        const categoryNames = {
            'graphic': 'تصميم جرافيك',
            'motion': 'موشن جرافيك',
            'video': 'مونتاج فيديو',
            'voice': 'تعليق صوتي',
            'web': 'تطوير ويب'
        };
        lightboxCategory.textContent = categoryNames[project.category] || project.category;
        
        // إضافة الوسوم
        tagsContainer.innerHTML = '';
        project.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'tag';
            tagElement.textContent = tag;
            tagsContainer.appendChild(tagElement);
        });
        
        // تأثيرات للعناصر النصية
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

// ==================== الوظائف التفاعلية الأخرى ====================

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });
    
    document.querySelectorAll('.nav-links li').forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });
    
    window.addEventListener('scroll', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });
}

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('success', 'شكراً لتواصلك! سأرد عليك في أقرب وقت ممكن.');
        contactForm.reset();
    });
}

function showNotification(type, message) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    location.hash = targetId;
                }
            }
        });
    });
}

function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });
}

function initVideoPlayer() {
    const video = document.getElementById('heroVideo');
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            video.poster = 'assets/images/hero-backup.jpg';
        });
    }
    
    const muteButton = document.createElement('div');
    muteButton.className = 'mute-button';
    muteButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    muteButton.title = 'كتم/إلغاء كتم الصوت';
    muteButton.style.position = 'absolute';
    muteButton.style.bottom = '80px';
    muteButton.style.left = '50%';
    muteButton.style.transform = 'translateX(-50%)';
    muteButton.style.color = 'var(--white)';
    muteButton.style.fontSize = '1.5rem';
    muteButton.style.cursor = 'pointer';
    muteButton.style.zIndex = '10';
    muteButton.style.transition = 'all 0.3s ease';
    
    muteButton.addEventListener('click', () => {
        video.muted = !video.muted;
        muteButton.innerHTML = video.muted ? 
            '<i class="fas fa-volume-mute"></i>' : 
            '<i class="fas fa-volume-up"></i>';
    });
    
    document.querySelector('.hero').appendChild(muteButton);
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const heroHeight = document.querySelector('.hero').offsetHeight;
        
        if (scrollPosition < heroHeight) {
            const opacity = 1 - (scrollPosition / heroHeight);
            document.querySelector('.video-overlay').style.opacity = opacity;
        }
    });
}

function initAnalytics() {
    // يمكن إضافة كود التحليلات هنا
}

// أحداث إضافية
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        const navLinks = document.querySelector('.nav-links');
        const hamburger = document.querySelector('.hamburger');
        
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    }
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registration successful');
        }).catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

function loadSkillsSection() {
    const skillsGrid = document.getElementById('skillsGrid');
    const skillsParticles = document.getElementById('skillsParticles');
    
    // إنشاء جسيمات خلفية ديناميكية
    createParticles(skillsParticles, 30);
    
    // بيانات المهارات المحسنة
    const enhancedSkills = siteData.skills.map(skill => {
        const service = siteData.services.find(s => s.icon === skill.icon);
        const projects = siteData.portfolio.filter(p => p.category === 
            (skill.name === 'التصميم الجرافيكي' ? 'graphic' :
             skill.name === 'الموشن جرافيك' ? 'motion' :
             skill.name === 'المونتاج' ? 'video' :
             skill.name === 'التعليق الصوتي' ? 'voice' : 'web'));
        
        return {
            ...skill,
            projects: projects.slice(0, 3), // عرض 3 مشاريع فقط في البطاقة
            allProjects: projects,
            projectsCount: service ? service.projects : 0,
            category: getSkillCategory(skill.name)
        };
    });
    
    // تصنيفات المهارات
    function getSkillCategory(skillName) {
        const designSkills = ['التصميم الجرافيكي', 'الموشن جرافيك'];
        const mediaSkills = ['المونتاج', 'التعليق الصوتي'];
        
        if (designSkills.includes(skillName)) return 'design';
        if (mediaSkills.includes(skillName)) return 'media';
        if (skillName === 'تطوير الويب') return 'development';
        return 'other';
    }
    
    // إنشاء بطاقات المهارات
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
                        <i class="fas fa-folder-open"></i> مشاريع حديثة
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
    
    // فلترة المهارات حسب التصنيف
    const categoryButtons = document.querySelectorAll('.skill-category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const category = button.dataset.category;
            const skillCards = document.querySelectorAll('.skill-card');
            
            skillCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    gsap.to(card, {
                        display: 'block',
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                } else {
                    gsap.to(card, {
                        display: 'none',
                        opacity: 0,
                        y: 20,
                        duration: 0.3,
                        ease: "power2.in"
                    });
                }
            });
        });
    });
    
    // تهيئة Lightbox للمشاريع
    initProjectLightbox();
    
    // إنشاء جسيمات الخلفية
    function createParticles(container, count) {
        container.innerHTML = '';
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'skill-particle';
            
            // أحجام عشوائية بين 5px و 15px
            const size = Math.random() * 10 + 5;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // مواقع عشوائية
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // ألوان عشوائية من اللون الأساسي
            const hue = 250; // اللون الأساسي أرجواني
            const saturation = 70;
            const lightness = Math.random() * 20 + 60;
            particle.style.background = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.2)`;
            
            // تأخيرات وتكرارات عشوائية
            particle.style.animationDelay = `${Math.random() * 15}s`;
            particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
            
            container.appendChild(particle);
        }
    }
    
    // Lightbox للمشاريع
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
                
                // تحويل الفئة إلى نص
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
    
    // تأثيرات الحركة عند التمرير
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






















function loadContactInfo() {
    const info = siteData.info;
    
    // تحديث معلومات التواصل
    document.getElementById('contact-location').textContent = info.location;
    document.getElementById('contact-email').textContent = info.email;
    document.getElementById('contact-phone').textContent = info.phone;
    
    // تحديث روابط التواصل الاجتماعي في الكارد الجديد
    const socialLinks = document.querySelectorAll('.social-mini');
    socialLinks[0].href = info.socialLinks.x-twitter;
    socialLinks[1].href = info.socialLinks.instagram;
    socialLinks[2].href = info.socialLinks.youtube;
    socialLinks[3].href = info.socialLinks.tiktok;
    socialLinks[4].href = info.socialLinks.LinkedIn;
    
    // إضافة وظيفة نسخ النص
    document.querySelectorAll('.btn-copy').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const textToCopy = document.getElementById(targetId).textContent;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> تم النسخ';
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
            });
        });
    });
    
    // تحسين نموذج التواصل
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // إظهار حالة التحميل
        formStatus.textContent = 'جاري إرسال الرسالة...';
        formStatus.className = 'form-status';
        formStatus.style.opacity = '1';
        
        // محاكاة إرسال النموذج (في الواقع سيكون هناك اتصال بخادم)
        setTimeout(() => {
            formStatus.textContent = 'تم إرسال الرسالة بنجاح! سأرد عليك قريباً.';
            formStatus.className = 'form-status success';
            contactForm.reset();
            
            // إخفاء الرسالة بعد 5 ثواني
            setTimeout(() => {
                formStatus.style.opacity = '0';
                setTimeout(() => {
                    formStatus.textContent = '';
                }, 300);
            }, 5000);
        }, 1500);
    });
}