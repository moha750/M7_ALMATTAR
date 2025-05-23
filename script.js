// بيانات المهارات الثابتة
const siteData = {
    skills: [
        { name: "التصميم الجرافيكي", level: 95, icon: "fas fa-paint-brush" },
        { name: "الموشن جرافيك", level: 65, icon: "fas fa-film" },
        { name: "المونتاج المرئي", level: 85, icon: "fas fa-video" },
        { name: "التعليق الصوتي", level: 70, icon: "fas fa-microphone" },
        { name: "تطوير الويب", level: 75, icon: "fas fa-code" }
    ]
};

// تهيئة Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAH2bBHklPLMCZF6ql-ntemsOkgLjk6-1o",
  authDomain: "breast-cancer-93095.firebaseapp.com",
  databaseURL: "https://breast-cancer-93095-default-rtdb.firebaseio.com",
  projectId: "breast-cancer-93095",
  storageBucket: "breast-cancer-93095.appspot.com",
  messagingSenderId: "769036893418",
  appId: "1:769036893418:web:a209b598b8c2356894eb93"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const portfolioCollection = db.collection('portfolio');

// تأثير الكتابة المتحركة
function initTypingEffect() {
    const typingText = document.querySelector('.highlight');
    if (!typingText) return;

    const professions = [
        "مُصمم جرافيك",
        "مونتير فيديو",
        "موشن جرافيكر",
        "مُعلق صوتي",
        "مطور ويب"
    ];
    
    let currentProfessionIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentText = professions[currentProfessionIndex];
        
        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingSpeed = 1500;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            currentProfessionIndex = (currentProfessionIndex + 1) % professions.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    setTimeout(type, 1000);
}

// ==================== قسم معرض الأعمال مع Firebase ====================

async function loadPortfolio() {
    const portfolioContainer = document.querySelector('.portfolio-grid');
    const shownCountElement = document.querySelector('.shown-count');
    const totalCountElement = document.querySelector('.total-count');
    
    portfolioContainer.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> جاري تحميل المشاريع...</div>';
    
    try {
        const snapshot = await portfolioCollection.orderBy('date', 'desc').get();
        const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        portfolioContainer.innerHTML = '';
        totalCountElement.textContent = projects.length;
        
        if (projects.length === 0) {
            portfolioContainer.innerHTML = '<div class="empty-portfolio"><i class="fas fa-folder-open"></i> لا توجد مشاريع حالياً</div>';
            shownCountElement.textContent = '0';
            return;
        }

        const initialItemsToShow = window.innerWidth < 768 ? projects.length : 6;
        let shownCount = 0;

        projects.forEach((project, index) => {
            if (index < initialItemsToShow) {
                const portfolioHTML = `
                    <div class="portfolio-item" 
                         data-category="${project.category}" 
                         data-index="${index}"
                         data-title="${project.title.toLowerCase()}"
                         data-client="${project.client.toLowerCase()}"
                         data-tags="${project.tags ? project.tags.join(',').toLowerCase() : ''}">
                        <img src="${project.image}" alt="${project.title}" class="portfolio-img" loading="lazy">
                        <div class="portfolio-overlay">
                            <div class="overlay-content">
                                <h3>${project.title}</h3>
                                <p>${project.description}</p>
                                <div class="portfolio-meta">
                                    <span><i class="fas fa-user"></i> ${project.client}</span>
                                    <span><i class="fas fa-calendar"></i> ${project.date}</span>
                                </div>
                                <a href="#portfolio-item-${index}" class="btn btn-view" data-project="${index}">
                                    <i class="fas fa-expand"></i> عرض المشروع
                                </a>
                            </div>
                        </div>
                    </div>
                `;
                
                portfolioContainer.insertAdjacentHTML('beforeend', portfolioHTML);
                shownCount++;
            }
        });
        
        shownCountElement.textContent = shownCount;
        initPortfolioFilter();
        initPortfolioSearch();
        
        if (window.innerWidth < 768 || projects.length <= initialItemsToShow) {
            document.querySelector('.btn-load-more').style.display = 'none';
        } else {
            document.querySelector('.btn-load-more').style.display = 'flex';
        }
        
        initPortfolioLightbox(projects);
    } catch (error) {
        console.error('Error loading portfolio:', error);
        portfolioContainer.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-triangle"></i> حدث خطأ أثناء تحميل المشاريع</div>';
    }
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
                             (item.dataset.tags && item.dataset.tags.includes(searchTerm));
        
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

function initPortfolioLightbox(projectsData) {
    const lightbox = document.querySelector('.portfolio-lightbox') || createLightbox();
    let currentIndex = 0;
    let filteredItems = [];
    
    function createLightbox() {
        const lb = document.createElement('div');
        lb.className = 'portfolio-lightbox';
        lb.innerHTML = `
            <div class="lightbox-content">
                <span class="close-lightbox"><i class="fas fa-times"></i></span>
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
                    <a href="#" class="btn-contact" target="_blank">
                        <i class="fas fa-eye"></i> عرض العمل بالكامل
                    </a>
                </div>
            </div>
        `;
        document.body.appendChild(lb);
        return lb;
    }

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
                                     (item.dataset.tags && item.dataset.tags.includes(searchTerm));
                return matchesFilter && matchesSearch && window.getComputedStyle(item).display !== 'none';
            });
            
            currentIndex = filteredItems.findIndex(el => el === this);
            showProjectInLightbox(currentIndex, projectsData);
            
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
    
    function showProjectInLightbox(index, projects) {
        if (!filteredItems.length || !projects) return;
        
        const projectIndex = filteredItems[index].dataset.index;
        const project = projects[projectIndex];
        
        if (!project) return;
        
        const lightboxImg = lightbox.querySelector('.lightbox-image');
        const lightboxTitle = lightbox.querySelector('h3');
        const lightboxDesc = lightbox.querySelector('.info-description');
        const lightboxClient = lightbox.querySelector('.info-client');
        const lightboxDate = lightbox.querySelector('.info-date');
        const lightboxCategory = lightbox.querySelector('.info-category');
        const tagsContainer = lightbox.querySelector('.project-tags');
        const viewProjectBtn = lightbox.querySelector('.btn-contact');
        
        if (project.externalLink) {
            viewProjectBtn.href = project.externalLink;
            viewProjectBtn.target = '_blank';
            viewProjectBtn.style.display = 'inline-flex';
        } else {
            viewProjectBtn.style.display = 'none';
        }
        
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
        if (project.tags && project.tags.length > 0) {
            project.tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'tag';
                tagElement.textContent = tag;
                tagsContainer.appendChild(tagElement);
            });
        }
        
        gsap.from([lightboxTitle, lightboxDesc, lightbox.querySelector('.info-meta'), tagsContainer], {
            opacity: 0,
            y: 20,
            duration: 0.3,
            stagger: 0.1,
            delay: 0.3
        });
    }
    
    lightbox.querySelector('.prev-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
        showProjectInLightbox(currentIndex, projectsData);
    });
    
    lightbox.querySelector('.next-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % filteredItems.length;
        showProjectInLightbox(currentIndex, projectsData);
    });
    
    lightbox.querySelector('.close-lightbox').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => e.target === lightbox && closeLightbox());
    
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
                showProjectInLightbox(currentIndex, projectsData);
            }
            if (e.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % filteredItems.length;
                showProjectInLightbox(currentIndex, projectsData);
            }
        }
    });
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
}

// ==================== قسم المهارات مع Firebase ====================

async function loadSkillsSection() {
    const skillsGrid = document.getElementById('skillsGrid');
    skillsGrid.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> جاري تحميل المهارات...</div>';
    
    try {
        const snapshot = await portfolioCollection.get();
        const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const enhancedSkills = siteData.skills.map(skill => {
            const skillCategory = 
                skill.name === 'التصميم الجرافيكي' ? 'graphic' :
                skill.name === 'الموشن جرافيك' ? 'motion' :
                skill.name === 'المونتاج المرئي' ? 'video' :
                skill.name === 'التعليق الصوتي' ? 'voice' : 'web';
            
            const skillProjects = projects.filter(p => p.category === skillCategory);
            
            return {
                ...skill,
                projects: skillProjects.slice(0, 3),
                allProjects: skillProjects,
                projectsCount: skillProjects.length,
                category: getSkillCategory(skill.name)
            };
        });
        
        skillsGrid.innerHTML = '';
        
        enhancedSkills.forEach(skill => {
            const skillCard = document.createElement('div');
            skillCard.className = 'skill-card';
            skillCard.dataset.skill = skill.name;
            skillCard.dataset.category = skill.category;
            skillCard.style.setProperty('--skill-percent', skill.level);
            
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
                    
                    ${skill.projectsCount > 0 ? `
                    <div class="skill-projects-container">
                        <h4 class="skill-projects-title">
                            <i class="fas fa-folder-open"></i> عدد مشاريعي (${skill.projectsCount})
                        </h4>
                            <div class="skill-projects-grid">
                                ${skill.projects.map(project => `
                                    <div class="skill-project-thumb" 
                                        data-title="${project.title}"
                                        data-description="${project.description}"
                                        data-client="${project.client}"
                                        data-date="${project.date}"
                                        data-category="${project.category}"
                                        data-link="${project.externalLink || '#'}">
                                        <img src="${project.image}" alt="${project.title}">
                                        <div class="project-view-icon">
                                            <i class="fas fa-eye"></i>
                                        </div>
                                    </div>
                                `).join('')}
                        </div>
                    </div>
                    ` : '<p class="no-projects">لا توجد مشاريع لهذه المهارة بعد</p>'}
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
    } catch (error) {
        console.error('Error loading skills:', error);
        skillsGrid.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-triangle"></i> حدث خطأ أثناء تحميل المهارات</div>';
    }
}

function getSkillCategory(skillName) {
    const designSkills = ['التصميم الجرافيكي', 'الموشن جرافيك'];
    const mediaSkills = ['المونتاج المرئي', 'التعليق الصوتي'];
    
    if (designSkills.includes(skillName)) return 'design';
    if (mediaSkills.includes(skillName)) return 'media';
    if (skillName === 'تطوير الويب') return 'development';
    return 'other';
}

function initProjectLightbox() {
    const lightbox = document.getElementById('projectLightbox') || createProjectLightbox();
    const closeBtn = lightbox.querySelector('.close-lightbox');
    
    function createProjectLightbox() {
        const lb = document.createElement('div');
        lb.className = 'skill-project-lightbox';
        lb.id = 'projectLightbox';
        lb.innerHTML = `
            <div class="lightbox-content">
                <span class="close-lightbox"><i class="fas fa-times"></i></span>
                <img src="" alt="" class="lightbox-image">
                <div class="lightbox-info">
                    <h3></h3>
                    <p></p>
                    <div class="lightbox-meta">
                        <p><i class="fas fa-user"></i> <span class="lightbox-client"></span></p>
                        <p><i class="fas fa-calendar"></i> <span class="lightbox-date"></span></p>
                        <p><i class="fas fa-tag"></i> <span class="lightbox-category"></span></p>
                    </div>
                    <a href="#" class="btn-view-project" target="_blank">
                        <i class="fas fa-external-link-alt"></i> عرض المشروع
                    </a>
                </div>
            </div>
        `;
        document.body.appendChild(lb);
        return lb;
    }

    document.addEventListener('click', function(e) {
        const thumb = e.target.closest('.skill-project-thumb');
        if (thumb) {
            e.preventDefault();
            
            const title = thumb.dataset.title;
            const description = thumb.dataset.description;
            const client = thumb.dataset.client;
            const date = thumb.dataset.date;
            const category = thumb.dataset.category;
            const link = thumb.dataset.link;
            const imageSrc = thumb.querySelector('img').src;
            
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
            lightbox.querySelector('.lightbox-category').textContent = categoryNames[category] || category;
            
            const viewBtn = lightbox.querySelector('.btn-view-project');
            if (link && link !== '#') {
                viewBtn.href = link;
                viewBtn.style.display = 'inline-flex';
            } else {
                viewBtn.style.display = 'none';
            }
            
            lightbox.classList.add('active');
            document.body.classList.add('no-scroll');
        }
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

// ==================== تأثيرات Hero Section ====================

function initHeroAnimations() {
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
}

// ==================== قسم التواصل ====================

function initContactForm() {
    const contactForm = document.getElementById('enhancedContactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!validateName() || !validateEmail() || !validateMessage()) {
                return;
            }
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const submitLoader = submitBtn.querySelector('.submit-loader');
            const submitText = submitBtn.querySelector('span');
            
            submitText.textContent = 'جاري الإرسال...';
            submitLoader.style.display = 'block';
            submitBtn.disabled = true;
            
            const formData = {
                "الاسم": document.getElementById('contactName').value.trim(),
                "البريد الإلكتروني": document.getElementById('contactEmail').value.trim(),
                "رقم الهاتف": document.getElementById('contactPhone').value.trim() || '',
                "الموضوع": document.getElementById('contactSubject').value.trim() || '',
                "الرسالة": document.getElementById('contactMessage').value.trim(),
                "التاريخ": new Date().toLocaleString('ar-SA')
            };
            
            try {
                const sheetDbUrl = 'https://sheetdb.io/api/v1/dnr96icde5zgz';
                
                const response = await fetch(sheetDbUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ data: [formData] })
                });
                
                const result = await response.json();
                
                if (result.created > 0) {
                    const successMessage = document.getElementById('formSuccess');
                    successMessage.textContent = 'شكراً لك! تم إرسال رسالتك بنجاح.';
                    successMessage.style.display = 'block';
                    contactForm.reset();
                } else {
                    throw new Error('فشل في حفظ البيانات');
                }
                
            } catch (error) {
                console.error('Error:', error);
                const successMessage = document.getElementById('formSuccess');
                successMessage.textContent = '⚠ حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.';
                successMessage.style.color = '#e74c3c';
                successMessage.style.display = 'block';
            } finally {
                submitLoader.style.display = 'none';
                submitText.textContent = 'إرسال الرسالة';
                submitBtn.disabled = false;
                
                setTimeout(() => {
                    const successMessage = document.getElementById('formSuccess');
                    successMessage.style.display = 'none';
                }, 5000);
            }
        });

        const nameInput = document.getElementById('contactName');
        const emailInput = document.getElementById('contactEmail');
        const messageInput = document.getElementById('contactMessage');
        
        nameInput.addEventListener('input', validateName);
        emailInput.addEventListener('input', validateEmail);
        messageInput.addEventListener('input', validateMessage);
    }
}

function validateName() {
    const name = document.getElementById('contactName').value.trim();
    const errorElement = document.getElementById('nameError');
    
    if (name.length < 3) {
        errorElement.textContent = 'الاسم يجب أن يكون على الأقل 3 أحرف';
        errorElement.style.display = 'block';
        return false;
    } else {
        errorElement.style.display = 'none';
        return true;
    }
}

function validateEmail() {
    const email = document.getElementById('contactEmail').value.trim();
    const errorElement = document.getElementById('emailError');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        errorElement.textContent = 'البريد الإلكتروني غير صالح';
        errorElement.style.display = 'block';
        return false;
    } else {
        errorElement.style.display = 'none';
        return true;
    }
}

function validateMessage() {
    const message = document.getElementById('contactMessage').value.trim();
    const errorElement = document.getElementById('messageError');
    
    if (message.length < 10) {
        errorElement.textContent = 'الرسالة يجب أن تكون على الأقل 10 أحرف';
        errorElement.style.display = 'block';
        return false;
    } else {
        errorElement.style.display = 'none';
        return true;
    }
}

// ==================== قسم الأرقام والإحصائيات ====================

function initStatsCounter() {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach((card, index) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    gsap.from(card, {
                        opacity: 0,
                        y: 50,
                        scale: 0.9,
                        duration: 0.8,
                        ease: "back.out(1.7)",
                        delay: index * 0.1
                    });
                    
                    startCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(card);
    });
}

function startCounter(card) {
    const numberElement = card.querySelector('.stat-number');
    const targetNumber = parseInt(numberElement.dataset.count);
    const duration = 2000;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const currentNumber = Math.floor(progress * targetNumber);
        
        numberElement.textContent = currentNumber.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            numberElement.textContent = targetNumber.toLocaleString();
            
            gsap.to(numberElement, {
                scale: 1.1,
                duration: 0.3,
                yoyo: true,
                repeat: 1
            });
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// ==================== تحسينات الهيدر ====================

function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');
    const scrollProgressBar = document.querySelector('.scroll-progress-bar');
    const downloadCVBtn = document.getElementById('downloadCV');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        if (scrollProgressBar) {
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const progress = (scrollTop / (docHeight - windowHeight)) * 100;
            scrollProgressBar.style.width = progress + '%';
        }
    });
    
    if (downloadCVBtn) {
        downloadCVBtn.addEventListener('click', (e) => {
            e.preventDefault();
            Swal.fire({
                title: 'تحميل السيرة الذاتية',
                text: 'سيتم تحميل ملف السيرة الذاتية بصيغة PDF',
                icon: 'info',
                confirmButtonText: 'تحميل',
                cancelButtonText: 'إلغاء',
                showCancelButton: true,
                customClass: {
                    confirmButton: 'btn btn-primary',
                    cancelButton: 'btn btn-outline'
                },
                buttonsStyling: false
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'جاري التحميل',
                        html: 'يتم تجهيز ملف السيرة الذاتية...',
                        timer: 2000,
                        timerProgressBar: true,
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    }).then(() => {
                        Swal.fire(
                            'تم التحميل!',
                            'تم تحميل السيرة الذاتية بنجاح',
                            'success'
                        );
                    });
                }
            });
        });
    }
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navList.classList.toggle('active');
        
        if (navList.classList.contains('active')) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navList.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                navList.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(link, {
                scale: 1.05,
                duration: 0.3
            });
        });
        
        link.addEventListener('mouseleave', () => {
            gsap.to(link, {
                scale: 1,
                duration: 0.3
            });
        });
    });
}

// ==================== تحسينات التنقل ====================

function initNavLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        },
        { rootMargin: '-100px 0px -50% 0px' }
    );
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== Loader ====================

function initLoader() {
    const loader = document.querySelector('.page-loader');
    
    setTimeout(function() {
        loader.classList.add('fade-out');
        
        setTimeout(function() {
            loader.style.display = 'none';
        }, 500);
    }, 2000);
}

// ==================== تحميل البيانات عند بدء التشغيل ====================

function loadDynamicData() {
    initLoader();
    initHeaderScroll();
    initNavLinks();
    initTypingEffect();
    initHeroAnimations();
    loadSkillsSection();
    loadPortfolio();
    initContactForm();
    initStatsCounter();
    document.getElementById('year').textContent = new Date().getFullYear();
}

// تنفيذ الكود عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', loadDynamicData);

// تحديث عرض المشاريع عند تغيير حجم الشاشة
window.addEventListener('resize', function() {
    if (window.innerWidth < 768) {
        document.querySelectorAll('.portfolio-item').forEach(item => {
            item.style.display = 'block';
        });
        document.querySelector('.btn-load-more').style.display = 'none';
        document.querySelector('.shown-count').textContent = document.querySelectorAll('.portfolio-item').length;
    } else {
        let visibleCount = 0;
        document.querySelectorAll('.portfolio-item').forEach((item, index) => {
            if (index < 6) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
        document.querySelector('.btn-load-more').style.display = 'flex';
        document.querySelector('.shown-count').textContent = visibleCount;
    }
});