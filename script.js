// بيانات المهارات الثابتة
// عدد المشاريع المطلوب لكل حجم شاشة
const projectsToShow = {
    mobile: 4,    // عدد المشاريع للشاشات الصغيرة (أقل من 768px)
    desktop: 6    // عدد المشاريع للشاشات الكبيرة (768px وأكبر)
};

// تعريف العناصر المستخدمة
const loadMoreBtn = document.querySelector('.btn-load-more');

const siteData = {
    skills: [{
            name: "التصميم الجرافيكي",
            level: 95,
            icon: "fas fa-paint-brush"
        },
        {
            name: "الموشن جرافيك",
            level: 65,
            icon: "fas fa-film"
        },
        {
            name: "المونتاج المرئي",
            level: 85,
            icon: "fas fa-video"
        },
        {
            name: "التعليق الصوتي",
            level: 70,
            icon: "fas fa-microphone"
        },
        {
            name: "تطوير الويب",
            level: 75,
            icon: "fas fa-code"
        },
        {
            name: "كتابة المحتوى",
            level: 60,
            icon: "fa-solid fa-pencil"
        }
    ]
};

// تهيئة Supabase
const {
    createClient
} = supabase;
const supabaseUrl = 'https://txywqmxcynvofslqdlck.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4eXdxbXhjeW52b2ZzbHFkbGNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMzY3MjksImV4cCI6MjA2NTcxMjcyOX0.ONwEYLhtDwZffyNZTiSYy3ZX5lx1tBVpCQoODrqfrK8';
const supabaseClient = createClient(supabaseUrl, supabaseKey);

// تعريف جداول Supabase
const portfolioCollection = supabaseClient.from('portfolio');

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

    portfolioContainer.innerHTML = `
        <div class="portfolio-loading">
            <div class="loading-content">
                <div class="loading-spinner">
                    <div class="spinner-circle"></div>
                    <div class="spinner-circle"></div>
                    <div class="spinner-circle"></div>
                </div>
                <div class="loading-text">
                    <h3>جاري تحميل المشاريع</h3>
                    <p>يرجى الانتظار بينما نقوم بجمع أعمالي الإبداعية</p>
                </div>
            </div>
        </div>
    `;

    try {
        const { data: projects, error } = await portfolioCollection.select('*').order('date', { ascending: false });

        if (error) {
            throw error;
        }

        portfolioContainer.innerHTML = '';
        totalCountElement.textContent = projects.length;

        if (projects.length === 0) {
            portfolioContainer.innerHTML = '<div class="empty-portfolio"><i class="fas fa-folder-open"></i> لا توجد مشاريع حالياً</div>';
            shownCountElement.textContent = '0';
            return;
        }

        const initialItemsToShow = Math.min(projects.length, window.innerWidth < 768 ? 4 : 6);
        let shownCount = 0;

        projects.forEach((project, index) => {
            // تحويل التصنيفات إلى سلسلة نصية مفصولة بفواصل
            const categories = Array.isArray(project.category) ? 
                project.category.join(',') : 
                project.category || '';

            if (index < initialItemsToShow) {
                const portfolioHTML = `
                    <div class="portfolio-item" 
                         data-category="${categories}" 
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
            } else {
                const portfolioHTML = `
                    <div class="portfolio-item" 
                         data-category="${categories}" 
                         data-index="${index}"
                         data-title="${project.title.toLowerCase()}"
                         data-client="${project.client.toLowerCase()}"
                         data-tags="${project.tags ? project.tags.join(',').toLowerCase() : ''}"
                         style="display: none;">
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
            }
        });

        shownCountElement.textContent = shownCount;
        initPortfolioFilter();
        initPortfolioSearch();

        if (projects.length <= initialItemsToShow) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'flex';
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
            // إزالة الفئة النشطة من جميع الأزرار
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // إضافة الفئة النشطة للزر المحدد
            button.classList.add('active');
            
            const filterValue = button.dataset.filter;
            filterPortfolioItems(filterValue);
        });
    });
}

// في ملف script.js
function filterPortfolioItems(filterValue = 'all', searchTerm = '') {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const shownCountElement = document.querySelector('.shown-count');
    const totalCountElement = document.querySelector('.total-count');
    let shownCount = 0;
    let matchingItems = 0;

    // تحسين عملية البحث باستخدام تعبيرات منتظمة
    const searchRegex = new RegExp(searchTerm, 'i');
    
    portfolioItems.forEach(item => {
        const categories = item.dataset.category.split(','); // تقسيم التصنيفات إلى مصفوفة
        const title = item.dataset.title;
        const client = item.dataset.client;
        const tags = item.dataset.tags;

        // تطبيق الفلتر مع دعم تعدد التصنيفات
        const matchesFilter = filterValue === 'all' || categories.includes(filterValue);
        const matchesSearch = searchRegex.test(title) || searchRegex.test(client) || searchRegex.test(tags);
        
        if (matchesFilter && matchesSearch) {
            // تحديد عدد المشاريع المعروضة حسب حجم الشاشة
            const itemsToShow = window.innerWidth < 768 ? projectsToShow.mobile : projectsToShow.desktop;
            
            if (shownCount < itemsToShow) {
                item.style.display = 'block';
                shownCount++;
            } else {
                item.style.display = 'none';
            }
            matchingItems++;
        } else {
            item.style.display = 'none';
        }
    });

    // تحديث العدادات
    if (shownCountElement) {
        shownCountElement.textContent = shownCount;
    }
    if (totalCountElement) {
        totalCountElement.textContent = matchingItems;
    }

    // إظهار رسالة إذا لم توجد مشاريع مطابقة
    if (matchingItems === 0) {
        const noResultsHTML = `
            <div class="empty-portfolio">
                <i class="fas fa-search"></i>
                <p>لا توجد مشاريع تطابق بحثك</p>
            </div>
        `;
        portfolioContainer.innerHTML = noResultsHTML;
        shownCountElement.textContent = '0';
    }

    // التحكم في ظهور زر تحميل المزيد
    const itemsToShow = window.innerWidth < 768 ? projectsToShow.mobile : projectsToShow.desktop;
    if (matchingItems > itemsToShow) {
        loadMoreBtn.style.display = 'flex';
        loadMoreBtn.textContent = 'تحميل المزيد';
        loadMoreBtn.classList.remove('show-less');
    } else {
        loadMoreBtn.style.display = 'none';
    }
}

function initPortfolioSearch() {
    const searchInput = document.querySelector('.portfolio-search');
    if (!searchInput) return;

    // إضافة تأخير في البحث لتحسين الأداء
    let searchTimeout;
    const searchDelay = 300; // 300 مللي ثانية

    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const searchTerm = this.value.trim().toLowerCase();
        
        searchTimeout = setTimeout(() => {
            filterPortfolioItems('all', searchTerm);
        }, searchDelay);
    });

    // إضافة دعم للبحث باستخدام مفتاح Enter
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = this.value.trim().toLowerCase();
            filterPortfolioItems('all', searchTerm);
        }
    });

    // إضافة دعم للبحث باستخدام مفتاح Esc
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            filterPortfolioItems('all', '');
            this.blur();
        }
    });

    // تحسين تجربة المستخدم
    searchInput.addEventListener('focus', function() {
        this.placeholder = 'ابحث عن مشاريع...';
    });

    searchInput.addEventListener('blur', function() {
        if (!this.value) {
            this.placeholder = 'البحث...';
        } else {
            // تطبيق الفلتر والبحث
            filterPortfolioItems(activeFilter, searchTerm);
        }
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
    item.addEventListener('click', function (e) {
        e.preventDefault();

        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        const searchTerm = document.querySelector('.search-input').value.trim().toLowerCase();

        // تصفية العناصر المعروضة حالياً
        filteredItems = Array.from(document.querySelectorAll('.portfolio-item')).filter(item => {
            const isVisible = window.getComputedStyle(item).display !== 'none';
            const matchesFilter = activeFilter === 'all' || item.dataset.category.split(',').includes(activeFilter);
            const matchesSearch = searchTerm === '' ||
                item.dataset.title.includes(searchTerm) ||
                item.dataset.client.includes(searchTerm) ||
                (item.dataset.tags && item.dataset.tags.includes(searchTerm));
            return isVisible && matchesFilter && matchesSearch;
        });

        currentIndex = filteredItems.findIndex(el => el === this);
        if (currentIndex === -1) {
            console.error('Could not find clicked item in filtered items');
            return;
        }

        showProjectInLightbox(currentIndex, projectsData);

            lightbox.classList.add('active');
            document.body.classList.add('no-scroll');

            gsap.from(lightbox.querySelector('.lightbox-content'), {
                opacity: 0,
                y: 50,
                duration: 0.5,
                ease: "back.out(1.7)"
            });
            lightbox.classList.add('active');
            document.body.classList.add('no-scroll'); // منع التمرير
        });
    });

function showProjectInLightbox(index, projects) {
    // التحقق من وجود العناصر والبيانات الأساسية
    if (!filteredItems || !filteredItems.length || !projects || !Array.isArray(projects)) {
        console.error('Invalid data: filteredItems or projects array is missing or empty');
        return;
    }

    if (index < 0 || index >= filteredItems.length) {
        console.error('Invalid index:', index);
        return;
    }

    const projectItem = filteredItems[index];
    if (!projectItem || !projectItem.dataset || !projectItem.dataset.index) {
        console.error('Invalid project item:', projectItem);
        return;
    }

    const projectIndex = parseInt(projectItem.dataset.index);
    if (isNaN(projectIndex) || projectIndex < 0 || projectIndex >= projects.length) {
        console.error('Invalid project index:', projectIndex);
        return;
    }

    const project = projects[projectIndex];
    if (!project) {
        console.error('Project not found at index:', projectIndex);
        return;
    }

    // التحقق من وجود عناصر lightbox
    const lightbox = document.querySelector('.portfolio-lightbox');
    if (!lightbox) {
        console.error('Lightbox element not found');
        return;
    }

    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const lightboxTitle = lightbox.querySelector('h3');
    const lightboxDesc = lightbox.querySelector('.info-description');
    const lightboxClient = lightbox.querySelector('.info-client');
    const lightboxDate = lightbox.querySelector('.info-date');
    const lightboxCategory = lightbox.querySelector('.info-category');
    const tagsContainer = lightbox.querySelector('.project-tags');
    const viewProjectBtn = lightbox.querySelector('.btn-contact');

    if (!lightboxImg || !lightboxTitle || !lightboxDesc || !lightboxClient || 
        !lightboxDate || !lightboxCategory || !tagsContainer || !viewProjectBtn) {
        console.error('One or more lightbox elements not found');
        return;
    }

    // تعبئة بيانات المشروع
    if (project.external_link) {
        viewProjectBtn.href = project.external_link;
        viewProjectBtn.target = '_blank';
        viewProjectBtn.style.display = 'inline-flex';
    } else {
        viewProjectBtn.style.display = 'none';
    }

    // تحميل الصورة مع التحقق من وجودها
    if (project.image) {
        gsap.to(lightboxImg, {
            opacity: 0,
            duration: 0.3
        });
        lightboxImg.src = project.image;
        lightboxImg.alt = project.title || '';
        lightboxImg.onload = () => {
            gsap.to(lightboxImg, {
                opacity: 1,
                duration: 0.5
            });
        };
    }

    // تعبئة النصوص مع قيم افتراضية في حالة عدم وجود البيانات
    lightboxTitle.textContent = project.title || 'لا يوجد عنوان';
    lightboxDesc.textContent = project.description || 'لا يوجد وصف';
    lightboxClient.textContent = project.client || 'غير معروف';
    lightboxDate.textContent = project.date || 'غير محدد';

    // معالجة التصنيفات المتعددة
    const categoryNames = {
        'graphic': 'تصميم جرافيك',
        'motion': 'موشن جرافيك',
        'video': 'مونتاج فيديو',
        'voice': 'تعليق صوتي',
        'web': 'تطوير ويب'
    };

    const projectCategories = Array.isArray(project.category) ? 
        project.category : 
        (project.category ? [project.category] : []);
    
    lightboxCategory.textContent = projectCategories.length > 0 ?
        projectCategories.map(cat => categoryNames[cat] || cat).join('، ') :
        'غير مصنف';

    // معالجة الكلمات المفتاحية
    tagsContainer.innerHTML = '';
    if (project.tags && project.tags.length > 0) {
        project.tags.forEach(tag => {
            if (tag) { // التحقق من وجود قيمة للكلمة المفتاحية
                const tagElement = document.createElement('span');
                tagElement.className = 'tag';
                tagElement.textContent = tag;
                tagsContainer.appendChild(tagElement);
            }
        });
    }

    // تأثيرات الحركة
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
        const { data: projects, error } = await portfolioCollection.select('*');

        if (error) {
            throw error;
        }

        const enhancedSkills = siteData.skills.map(skill => {
            // تحديد الفئة الصحيحة لكل مهارة
            let skillCategory;
            switch (skill.name) {
                case "التصميم الجرافيكي":
                    skillCategory = ['graphic'];
                    break;
                case "الموشن جرافيك":
                    skillCategory = ['motion'];
                    break;
                case "المونتاج المرئي":
                    skillCategory = ['video'];
                    break;
                case "التعليق الصوتي":
                    skillCategory = ['voice'];
                    break;
                case "تطوير الويب":
                    skillCategory = ['web'];
                    break;
                case "كتابة المحتوى":
                    skillCategory = ['content'];
                    break;
                default:
                    skillCategory = ['other'];
            }

            // حساب المشاريع المتعلقة بهذه المهارة
            const skillProjects = projects.filter(project => {
                const projectCategories = Array.isArray(project.category) ? 
                    project.category : 
                    [project.category];
                
                return projectCategories.some(cat => skillCategory.includes(cat));
            });

            return {
                ...skill,
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
                    
                    <div class="skill-projects-container">
                        <h4 class="skill-projects-title">
                            <i class="fas fa-folder-open"></i> عدد مشاريعي: <strong>${skill.projectsCount}</strong>
                        </h4>
                    </div>
                </div>
            `;

            skillsGrid.appendChild(skillCard);
        });

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
        }, {
            threshold: 0.1
        });

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
    if (skillName === "كتابة المحتوى") return 'content';
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

    document.addEventListener('click', function (e) {
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
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // التحقق من جميع الحقول باستثناء nameError
            const isEmailValid = validateEmail();
            const isMessageValid = validateMessage();
            const isPhoneValid = validatePhone();

            if (!isEmailValid || !isMessageValid || !isPhoneValid) {
                return;
            }

            const submitBtn = contactForm.querySelector('.submit-btn');
            const submitText = submitBtn.querySelector('span');

            submitText.textContent = 'جاري الإرسال...';
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
                    body: JSON.stringify({
                        data: [formData]
                    })
                });

                const result = await response.json();

                if (result.created > 0) {
                    // استخدام SweetAlert2 مع تصميم مخصص
                    Swal.fire({
                        title: 'تم الإرسال بنجاح!',
                        html: `
                            <div class="success-alert">
                                <i class="fas fa-check-circle"></i>
                                <p>شكراً لك على رسالتك! سأتواصل معك قريباً</p>
                            </div>
                        `,
                        showConfirmButton: true,
                        confirmButtonText: 'حسناً',
                        customClass: {
                            popup: 'custom-swal-popup',
                            title: 'custom-swal-title',
                            content: 'custom-swal-content',
                            actions: 'custom-swal-actions',
                            confirmButton: 'custom-swal-confirm'
                        },
                        buttonsStyling: false
                    });
                    contactForm.reset();
                } else {
                    throw new Error('فشل في حفظ البيانات');
                }

            } catch (error) {
                console.error('Error:', error);
                // استخدام SweetAlert2 مع تصميم مخصص للخطأ
                Swal.fire({
                    title: 'حدث خطأ!',
                    html: `
                        <div class="error-alert">
                            <i class="fas fa-exclamation-triangle"></i>
                            <p>حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى</p>
                        </div>
                    `,
                    showConfirmButton: true,
                    confirmButtonText: 'حاول مجدداً',
                    customClass: {
                        popup: 'custom-swal-popup',
                        title: 'custom-swal-title',
                        content: 'custom-swal-content',
                        actions: 'custom-swal-actions',
                        confirmButton: 'custom-swal-error'
                    },
                    buttonsStyling: false
                });
            } finally {
                submitText.textContent = 'إرسال الرسالة';
                submitBtn.disabled = false;
            }
        });

        const emailInput = document.getElementById('contactEmail');
        const messageInput = document.getElementById('contactMessage');
        const phoneInput = document.getElementById('contactPhone');

        emailInput.addEventListener('input', validateEmail);
        messageInput.addEventListener('input', validateMessage);
        phoneInput.addEventListener('input', validatePhone);
    }
}

function validateEmail() {
    const email = document.getElementById('contactEmail').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errorElement = document.getElementById('emailError');

    if (!emailRegex.test(email)) {
        errorElement.textContent = 'صيغة البريد الإلكتروني غير صحيحة';
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

function validatePhone() {
    const phone = document.getElementById('contactPhone').value.trim();
    const errorElement = document.getElementById('phoneError');

    if (phone && phone.length !== 10) {
        errorElement.textContent = ' يجب أن يتكون رقم الهاتف من 10 أرقام ';
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
    
    // إزالة المراقبين السابقين إذا وجدوا
    if (window.statsObserver) {
        statCards.forEach(card => {
            if (window.statsObserver) {
                window.statsObserver.unobserve(card);
            }
        });
        window.statsObserver.disconnect();
    }
    
    // إنشاء مراقب جديد
    window.statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                
                // إعادة تعيين حالة التحريك
                card.dataset.animated = 'false';
                
                // إعادة تعيين العداد إلى 0
                const numberElement = card.querySelector('.stat-number');
                numberElement.textContent = '0';
                
                // إضافة فئة التحريك
                card.classList.add('stat-card-animate');
                // تشغيل العداد بعد التحريك
                setTimeout(() => startCounter(card), 500);
            }
        });
    }, {
        threshold: 0.3
    });

    // إضافة المراقب لكل بطاقة
    statCards.forEach(card => {
        window.statsObserver.observe(card);
    });
}

function startCounter(card) {
    // التأكد من عدم تشغيل العداد بالفعل
    if (card.dataset.animated === 'true') return;
    
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
            card.dataset.animated = 'true';
            
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
    const contactSection = document.getElementById('contact');

    // مراقبة قسم التواصل
    const contactObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && Swal.isVisible()) {
                Swal.close(); // إغلاق النافذة المنبثقة إذا كانت مفتوحة
            }
        });
    }, { threshold: 0.1 });

    if (contactSection) {
        contactObserver.observe(contactSection);
    }

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

// في دالة initHeaderScroll، تحديث جزء زر تحميل السيرة الذاتية
    if (downloadCVBtn) {
        downloadCVBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const downloadEvent = {
                action: 'download_cv_clicked',
                timestamp: new Date().toISOString(),
                status: 'unavailable'
            };
            
            Swal.fire({
                title: 'جاري تجهيز السيرة الذاتية',
                html: `
                    <div class="cv-notification">
                        <div class="cv-progress-container">
                            <div class="cv-progress-bar" style="width: 75%"></div>
                            <div class="cv-progress-text">75% جاهزة</div>
                        </div>
                        <div class="cv-notification-content">
                            <div class="cv-icon">
                                <i class="fas fa-file-pdf"></i>
                                <div class="cv-pulse"></div>
                            </div>
                            <div class="cv-details">
                                <h3>سيرتي الذاتية قيد التطوير</h3>
                                <p>نعمل حالياً على إنشاء نسخة متكاملة تحتوي على جميع تفاصيل خبراتي ومهاراتي</p>
                                <div class="cv-features">
                                    <span><i class="fas fa-check-circle"></i> تصميم تفاعلي</span>
                                    <span><i class="fas fa-check-circle"></i> تحديثات مستمرة</span>
                                    <span><i class="fas fa-check-circle"></i> متوافقة مع ATS</span>
                                </div>
                            </div>
                        </div>
                        <div class="cv-notification-footer">
                            <p>يمكنك <a href="#contact">الاتصال بي</a> للحصول على نسخة مبدئية</p>
                        </div>
                    </div>
                `,
                showConfirmButton: true,
                confirmButtonText: 'إشعاري عند توفرها',
                showCancelButton: true,
                cancelButtonText: 'سأنتظرها لاحقاً',
                customClass: {
                    popup: 'cv-swal-popup',
                    title: 'cv-swal-title',
                    htmlContainer: 'cv-swal-html',
                    confirmButton: 'cv-swal-confirm',
                    cancelButton: 'cv-swal-cancel',
                    actions: 'cv-swal-actions'
                },
                didOpen: () => {
                    gsap.from('.cv-progress-bar', {
                        width: '0%',
                        duration: 1.5,
                        ease: "power2.out"
                    });
                    
                    gsap.from('.cv-icon', {
                        scale: 0,
                        rotation: -45,
                        duration: 0.8,
                        delay: 0.3,
                        ease: "back.out(1.2)"
                    });
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        icon: 'success',
                        title: 'تم تسجيل طلبك',
                        text: 'سنقوم بإرسال السيرة الذاتية لبريدك الإلكتروني عند توفرها',
                        confirmButtonText: 'تم'
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
        }, {
            rootMargin: '-100px 0px -50% 0px'
        }
    );

    sections.forEach(section => {
        observer.observe(section);
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
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

    // إضافة صنف no-scroll إلى body لمنع التمرير
    document.body.classList.add('no-scroll');

    setTimeout(function () {
        loader.classList.add('fade-out');

        setTimeout(function () {
            loader.style.display = 'none';
            // إزالة صنف no-scroll من body للسماح بالتمرير
            document.body.classList.remove('no-scroll');
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

// دالة تحميل المزيد من المشاريع مع مراعاة الفلتر الحالي
async function loadMoreProjects() {
    const portfolioContainer = document.querySelector('.portfolio-grid');
    const shownCountElement = document.querySelector('.shown-count');
    const totalCountElement = document.querySelector('.total-count');
    const loadMoreBtn = document.querySelector('.btn-load-more');

    try {
        const { data: projects, error } = await portfolioCollection.select('*').order('date', { ascending: false });

        if (error) {
            throw error;
        }

        // الحصول على الفلتر الحالي
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        const searchTerm = document.querySelector('.search-input').value.trim().toLowerCase();

        // تصفية المشاريع حسب الفلتر والبحث
        const filteredProjects = projects.filter(project => {
            const matchesFilter = activeFilter === 'all' || project.category === activeFilter;
            const matchesSearch = searchTerm === '' ||
                project.title.toLowerCase().includes(searchTerm) ||
                project.client.toLowerCase().includes(searchTerm) ||
                (project.tags && project.tags.join(',').toLowerCase().includes(searchTerm));
            
            return matchesFilter && matchesSearch;
        });

        // حساب المشاريع المعروضة حالياً
        const currentlyShown = portfolioContainer.querySelectorAll('.portfolio-item[style*="display: block"], .portfolio-item:not([style])').length;
        
        // حساب عدد المشاريع الجديدة التي سيتم عرضها
        const itemsToShow = Math.min(filteredProjects.length - currentlyShown, window.innerWidth < 768 ? 2 : 6);

        // عرض المشاريع الجديدة
        for (let i = currentlyShown; i < currentlyShown + itemsToShow; i++) {
            const project = filteredProjects[i];
            const portfolioItem = portfolioContainer.querySelector(`[data-index="${projects.indexOf(project)}"]`);
            if (portfolioItem) {
                portfolioItem.style.display = 'block';
            }
        }

        // تحديث العداد
        shownCountElement.textContent = currentlyShown + itemsToShow;
        totalCountElement.textContent = filteredProjects.length;

        // التحكم في ظهور زر تحميل المزيد
        if (parseInt(shownCountElement.textContent) >= filteredProjects.length) {
            loadMoreBtn.textContent = 'عرض أقل';
            loadMoreBtn.classList.add('show-less');
        } else {
            loadMoreBtn.textContent = 'تحميل المزيد';
            loadMoreBtn.classList.remove('show-less');
        }

        // إظهار الزر إذا كان هناك مشاريع إضافية
        loadMoreBtn.style.display = (parseInt(shownCountElement.textContent) < filteredProjects.length || 
                                   loadMoreBtn.classList.contains('show-less') ? 'flex' : 'none');

    } catch (error) {
        console.error('Error loading more projects:', error);
    }
}

// دالة عرض أقل المشاريع مع مراعاة الفلتر الحالي
// دالة عرض أقل المشاريع مع مراعاة حجم الشاشة
async function showLessProjects() {
    const portfolioContainer = document.querySelector('.portfolio-grid');
    const shownCountElement = document.querySelector('.shown-count');
    const totalCountElement = document.querySelector('.total-count');
    const loadMoreBtn = document.querySelector('.btn-load-more');

    try {
        const { data: projects, error } = await portfolioCollection.select('*').order('date', { ascending: false });

        if (error) {
            throw error;
        }

        // الحصول على الفلتر الحالي
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        const searchTerm = document.querySelector('.search-input').value.trim().toLowerCase();

        // تصفية المشاريع حسب الفلتر والبحث
        const filteredProjects = projects.filter(project => {
            const matchesFilter = activeFilter === 'all' || project.category === activeFilter;
            const matchesSearch = searchTerm === '' ||
                project.title.toLowerCase().includes(searchTerm) ||
                project.client.toLowerCase().includes(searchTerm) ||
                (project.tags && project.tags.join(',').toLowerCase().includes(searchTerm));
            
            return matchesFilter && matchesSearch;
        });

        // تحديد عدد المشاريع الأولية المعروضة حسب حجم الشاشة
        const initialItemsToShow = window.innerWidth < 768 ? 4 : 6; // 4 للشاشات الصغيرة، 6 للشاشات الكبيرة
        
        // إخفاء المشاريع الزائدة
        filteredProjects.forEach((project, index) => {
            const portfolioItem = portfolioContainer.querySelector(`[data-index="${projects.indexOf(project)}"]`);
            if (portfolioItem) {
                portfolioItem.style.display = index < initialItemsToShow ? 'block' : 'none';
            }
        });

        // تحديث العداد
        shownCountElement.textContent = Math.min(initialItemsToShow, filteredProjects.length);
        totalCountElement.textContent = filteredProjects.length;

        // تحديث حالة الزر
        loadMoreBtn.textContent = 'تحميل المزيد';
        loadMoreBtn.classList.remove('show-less');
        loadMoreBtn.style.display = filteredProjects.length > initialItemsToShow ? 'flex' : 'none';

    } catch (error) {
        console.error('Error showing less projects:', error);
    }
}

// إضافة مستمع حدث للزر "تحميل المزيد"
document.querySelector('.btn-load-more').addEventListener('click', function() {
    const btn = this;
    if (btn.classList.contains('show-less')) {
        showLessProjects();
    } else {
        loadMoreProjects();
    }
});


// تحديث عرض المشاريع عند تغيير حجم الشاشة
window.addEventListener('resize', function() {
    const portfolioContainer = document.querySelector('.portfolio-grid');
    const loadMoreBtn = document.querySelector('.btn-load-more');
    
    if (!portfolioContainer || !loadMoreBtn) return;

    const allItems = portfolioContainer.querySelectorAll('.portfolio-item');
    const visibleItems = Array.from(allItems).filter(item => 
        window.getComputedStyle(item).display !== 'none'
    );

    if (window.innerWidth < 768) {
        // في الجوال، نعرض كل العناصر ونخفي الزر إذا لم يكن هناك عناصر مخفية
        allItems.forEach(item => item.style.display = 'block');
        loadMoreBtn.style.display = 'none';
    } else {
        // في الشاشات الكبيرة، نتحقق إذا كان هناك عناصر مخفية لنظهر الزر
        const hiddenItems = Array.from(allItems).filter(item => 
            item.style.display === 'none'
        );
        loadMoreBtn.style.display = hiddenItems.length > 0 ? 'flex' : 'none';
    }

        if (document.querySelector('.btn-load-more').classList.contains('show-less')) {
        showLessProjects();
    }


    // تحديث العداد
    const shownCountElement = document.querySelector('.shown-count');
    if (shownCountElement) {
        shownCountElement.textContent = 
            portfolioContainer.querySelectorAll('.portfolio-item[style*="display: block"], .portfolio-item:not([style])').length;
    }

    
});


































































