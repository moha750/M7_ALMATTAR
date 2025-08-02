// متغيرات عامة
let cropper = null;
let currentImageFile = null;
let cropModalOpened = false;
const bucket = 'portfolio-images';


// تهيئة Supabase
const {
    createClient
} = supabase;
const supabaseUrl = 'https://txywqmxcynvofslqdlck.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4eXdxbXhjeW52b2ZzbHFkbGNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMzY3MjksImV4cCI6MjA2NTcxMjcyOX0.ONwEYLhtDwZffyNZTiSYy3ZX5lx1tBVpCQoODrqfrK8';
const supabaseClient = createClient(supabaseUrl, supabaseKey);

// تعريف جداول Supabase
const portfolioCollection = supabaseClient.from('portfolio');
const storage = supabaseClient.storage.from('portfolio-images');

// تهيئة Supabase Storage
const supabaseStorage = supabaseClient.storage;



// دالة لإعادة تعيين حقل الصورة
function resetImageField() {
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('imageUpload').value = '';
    document.querySelector('.upload-area').style.display = 'flex';
    currentImageFile = null;
    
    // إعادة تعيين معلومات الملف
    document.getElementById('fileName').textContent = '';
    document.getElementById('fileSize').textContent = '';
    
    if (cropModalOpened && cropper) {
        closeCropModal(false);
    }
}

function setActiveRatio(id) {
    document.querySelectorAll('.crop-ratio-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(id).classList.add('active');
}

// أحداث أدوات التحكم
document.addEventListener('DOMContentLoaded', function () {
    const imageUpload = document.getElementById('imageUpload');
    const applyCrop = document.getElementById('applyCrop');
    const cancelCrop = document.getElementById('cancelCrop');


    if (applyCrop) {
        applyCrop.addEventListener('click', function () {
            if (cropper) {
                const croppedCanvas = cropper.getCroppedCanvas({
                    width: 800,
                    height: 450,
                    fillColor: '#fff'
                });

                croppedCanvas.toBlob(function (blob) {
                    // تحقق من وجود الملف
                    if (!currentImageFile) {
                        console.error('currentImageFile is not defined');
                        return;
                    }

                    const croppedFile = new File([blob], currentImageFile.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });

                    const preview = document.getElementById('previewImage');
                    preview.src = URL.createObjectURL(blob);
                    document.getElementById('imagePreview').style.display = 'block';

                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(croppedFile);
                    imageUpload.files = dataTransfer.files;

                    closeCropModal();
                });
            }
        });
    }

    if (cancelCrop) {
        cancelCrop.addEventListener('click', function () {
            closeCropModal(true);
        });
    }

    // إضافة مستمعي الأحداث لأدوات الاقتصاص
    document.getElementById('cropFree').addEventListener('click', () => {
        if (cropper) cropper.setAspectRatio(NaN);
        setActiveRatio('cropFree');
    });

    document.getElementById('crop1x1').addEventListener('click', () => {
        if (cropper) cropper.setAspectRatio(1);
        setActiveRatio('crop1x1');
    });

    document.getElementById('crop16x9').addEventListener('click', () => {
        if (cropper) cropper.setAspectRatio(16 / 9);
        setActiveRatio('crop16x9');
    });

    document.getElementById('crop9x16').addEventListener('click', () => {
        if (cropper) cropper.setAspectRatio(9 / 16);
        setActiveRatio('crop9x16');
    });

    document.getElementById('rotateLeft').addEventListener('click', () => {
        if (cropper) cropper.rotate(-90);
    });

    document.getElementById('rotateRight').addEventListener('click', () => {
        if (cropper) cropper.rotate(90);
    });

    document.getElementById('removeImageBtn').addEventListener('click', function () {
    e.preventDefault();
    resetImageField();
    });
});
if (cancelCrop) {
    cancelCrop.addEventListener('click', function () {
        closeCropModal(true);
    });
}

document.getElementById('cropFree').addEventListener('click', () => {
    if (cropper) cropper.setAspectRatio(NaN);
    setActiveRatio('cropFree');
});

document.getElementById('crop1x1').addEventListener('click', () => {
    if (cropper) cropper.setAspectRatio(1);
    setActiveRatio('crop1x1');
});

document.getElementById('crop16x9').addEventListener('click', () => {
    if (cropper) cropper.setAspectRatio(16 / 9);
    setActiveRatio('crop16x9');
});

document.getElementById('crop9x16').addEventListener('click', () => {
    if (cropper) cropper.setAspectRatio(9 / 16);
    setActiveRatio('crop9x16');
});

document.getElementById('rotateLeft').addEventListener('click', () => {
    if (cropper) cropper.rotate(-90);
});

document.getElementById('rotateRight').addEventListener('click', () => {
    if (cropper) cropper.rotate(90);
});

document.getElementById('removeImageBtn').addEventListener('click', function () {
    resetImageField();
});

function setActiveRatio(id) {
    document.querySelectorAll('.crop-ratio-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(id).classList.add('active');
}



document.addEventListener('DOMContentLoaded', function () {
    imageUpload = document.getElementById('imageUpload');
    applyCrop = document.getElementById('applyCrop');
    cancelCrop = document.getElementById('cancelCrop');

    if (cancelCrop) {
        cancelCrop.addEventListener('click', function () {
            closeCropModal(true);
        });
    }

    imageUpload.addEventListener('change', function (e) {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // التحقق من نوع الملف
            if (!file.type.match('image.*')) {
                showAlert('error', 'خطأ في نوع الملف', 'الرجاء اختيار ملف صورة فقط (JPG, PNG)');
                resetImageField();
                return;
            }

            // التحقق من حجم الملف
            if (file.size > 10 * 1024 * 1024) {
                showAlert('error', 'حجم الملف كبير', 'الحد الأقصى لحجم الصورة هو 10MB');
                resetImageField();
                return;
            }

            currentImageFile = file;
            updateFileInfo(file);

            // عرض خيارات للمستخدم
            Swal.fire({
                title: 'كيف تريد رفع الصورة؟',
                html: `
                            <div class="crop-alert">
                                <i class="fa-solid fa-crop-simple"></i>
                            </div>
                        `,
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'اقتصاص الصورة',
                denyButtonText: 'رفع بدون اقتصاص',
                cancelButtonText: 'إلغاء الرفع',
                confirmButtonColor: '#dda853',
                denyButtonColor: '#4CAF50',
                cancelButtonColor: '#d33'
            }).then((result) => {
                if (result.isConfirmed) {
                    const reader = new FileReader();
                    reader.onload = function (event) {
                        openCropModal(event.target.result);
                        cropModalOpened = true;
                    };
                    reader.readAsDataURL(file);
                } else if (result.isDenied) {
                    const reader = new FileReader();
                    reader.onload = function (event) {
                        const preview = document.getElementById('previewImage');
                        preview.src = event.target.result;
                        document.getElementById('imagePreview').style.display = 'block';
                        document.querySelector('.upload-area').style.display = 'none';

                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(file);
                        imageUpload.files = dataTransfer.files;
                    };
                    reader.readAsDataURL(file);
                } else {
                    resetImageField();
                }
            });
        }
    });

});

function closeCropModal(resetImage = false) {
    const cropModal = document.getElementById('cropModal');
    cropModal.classList.remove('active');

    setTimeout(() => {
        cropModal.style.display = 'none';
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }

        // إزالة شرط resetImage لمنع إزالة الصورة عند الإلغاء
        if (resetImage && document.getElementById('imagePreview').style.display === 'none') {
            resetImageField();
        }

        cropModalOpened = false;
    }, 300);
}

document.addEventListener('DOMContentLoaded', function () {
    // إضافة مستمعي الأحداث هنا
    const form = document.getElementById('projectForm');
    const projectsTableBody = document.querySelector('.projects-table tbody');

    if (form) {
form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // جمع التصنيفات المحددة
    const selectedCategories = Array.from(document.querySelectorAll('.category-checkbox:checked'))
        .map(checkbox => checkbox.value);

    if (selectedCategories.length === 0) {
        showAlert('error', 'خطأ', 'الرجاء اختيار تصنيف واحد على الأقل');
        return;
    }

});
    }

    if (projectsTableBody) {
        projectsTableBody.addEventListener('click', async function (e) {
            const editBtn = e.target.closest('.edit-btn');
            const deleteBtn = e.target.closest('.delete-btn');
            // باقي الكود
        });
    }
});

// تحميل SweetAlert2 إذا لم يكن محملاً
if (typeof Swal === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
    script.onload = function () {
        // باقي الكود
    };
    document.head.appendChild(script);
}

// متغيرات عامة
let selectedProjects = [];
let tags = [];

document.addEventListener('DOMContentLoaded', function () {
    // عناصر DOM
    const form = document.getElementById('projectForm');
    const editIndexInput = document.getElementById('editIndex');
    const formTitle = document.getElementById('formTitle');
    const formSubtitle = document.getElementById('formSubtitle');
    const submitBtn = document.getElementById('submitBtn');
    const resetBtn = document.getElementById('resetBtn');
    const projectsTableBody = document.getElementById('projectsTableBody');
    const emptyState = document.getElementById('emptyState');
    const yearSelect = document.getElementById('year');
    const tagsInput = document.getElementById('tagsInput');
    const tagsDisplay = document.getElementById('tagsDisplay');
    const addTagBtn = document.getElementById('addTagBtn');
    const tagsHiddenInput = document.getElementById('tags');

    // تعبئة سنوات الاختيار
    const currentYear = new Date().getFullYear();
    for (let year = currentYear + 5; year >= 2000; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }

    // دوال Supabase
    async function getPortfolioData() {
        try {
            const {
                data,
                error
            } = await supabaseClient
                .from('portfolio')
                .select('id, category, image, title, description, client, date, tags, external_link') // تم إضافة id هنا
                .order('date', {
                    ascending: false
                });
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error getting portfolio data:", error);
            return [];
        }
    }

    async function savePortfolioData(projectData, isEdit = false, docId = null) {
        try {
            // معالجة تنسيق البيانات قبل الإرسال
            const processedData = {
                ...projectData,
                tags: Array.isArray(projectData.tags) ? projectData.tags : [projectData.tags],
                category: Array.isArray(projectData.category) ? projectData.category : [projectData.category]
            };

            if (isEdit && docId) {
                const {
                    error
                } = await portfolioCollection.update(processedData).eq('id', docId);
                if (error) throw error;
            } else {
                const {
                    error
                } = await portfolioCollection.insert([processedData]);
                if (error) throw error;
            }
            return true;
        } catch (error) {
            console.error("خطأ في حفظ بيانات المعرض:", error);
            showAlert('error', 'خطأ في الحفظ', `فشل حفظ بيانات المشروع. تأكد من:\n1. صحة البيانات المدخلة\n2. وجود الاتصال بالإنترنت\n3. أن المفتاح Supabase صحيح\n4. أن الـ bucket ${bucket} موجود`);
            return null;
        }
    }

    async function deletePortfolioItem(docId) {
        if (!docId) {
            console.error("Invalid ID for deletion:", docId);
            showAlert('error', 'خطأ في الحذف', 'معرّف المشروع غير صالح');
            return false;
        }

        try {
            // حذف المشروع من قاعدة البيانات
            const {
                error: dbError
            } = await supabaseClient
                .from('portfolio')
                .delete()
                .eq('id', docId);

            if (dbError) throw dbError;

            // حذف الصورة المرتبطة بالمشروع من التخزين
            const {
                data: storageData,
                error: storageError
            } = await supabaseClient
                .storage
                .from('portfolio-images')
                .list(`${docId}/`);

            if (storageError) {
                console.error("Error listing storage files:", storageError);
            } else if (storageData && storageData.length > 0) {
                await supabaseClient
                    .storage
                    .from('portfolio-images')
                    .remove(storageData.map(file => `${docId}/${file.name}`));
            }

            return true;
        } catch (error) {
            console.error("Error deleting portfolio item:", error);
            showAlert('error', 'خطأ في الحذف', `حدث خطأ أثناء محاولة حذف المشروع: ${error.message}`);
            return false;
        }
    }
    // دوال العرض
    function toggleEmptyState(portfolio) {
        if (portfolio.length === 0) {
            emptyState.style.display = 'block';
            document.querySelector('table').style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            document.querySelector('table').style.display = 'table';
        }
    }

async function renderProjects() {
    const portfolio = await getPortfolioData();
    projectsTableBody.innerHTML = '';

    portfolio.forEach((item) => {
        const tr = document.createElement('tr');
        tr.dataset.id = item.id;
        tr.innerHTML = `
            <td>
                <input type="checkbox" class="select-checkbox" data-id="${item.id}">
            </td>
            <td><img src="${item.image}" alt="${item.title}" class="project-thumb"></td>
            <td>${item.title}</td>
            <td><div class="category-badges">${getCategoryName(item.category)}</div></td>
            <td>${item.client}</td>
            <td>${item.date}</td>
            <td class="project-link">
                ${item.external_link ? 
                    `<a href="${item.external_link}" target="_blank" class="link-btn">
                        <i class="fas fa-external-link-alt"></i>
                    </a>` : 
                    '<span class="no-link"><i class="fas fa-unlink"></i></span>'}
            </td>
            <td class="actions">
                <button class="action-btn edit-btn" data-id="${item.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        projectsTableBody.appendChild(tr);
    });

    toggleEmptyState(portfolio);
    setupSelectionHandlers();
}

function getCategoryName(categories) {
    if (!categories) return '';
    if (typeof categories === 'string') categories = [categories];
    
    const categoryNames = {
        graphic: { name: 'جرافيك', icon: 'fas fa-paint-brush' },
        motion: { name: 'موشن', icon: 'fas fa-film' },
        video: { name: 'فيديو', icon: 'fas fa-video' },
        voice: { name: 'صوت', icon: 'fas fa-microphone' },
        web: { name: 'ويب', icon: 'fas fa-globe' }
    };
    
    return categories.map(cat => {
        const category = categoryNames[cat] || { name: cat, icon: 'fas fa-tag' };
        return `<span class="category-badge category-${cat}">
            <i class="${category.icon}"></i> ${category.name}
        </span>`;
    }).join('');
}

    // دوال التحكم بالتحديد
    function setupSelectionHandlers() {
        const checkboxes = document.querySelectorAll('.select-checkbox');
        const selectAllBtn = document.getElementById('selectAllBtn');
        const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');

        // تحسينات جديدة
        checkboxes.forEach(checkbox => {
            // إضافة تأثير عند التحديد
            checkbox.addEventListener('change', function () {
                const projectId = this.dataset.id;
                const row = this.closest('tr');

                if (this.checked) {
                    selectedProjects.push(projectId);
                    row.style.backgroundColor = 'rgba(221, 168, 83, 0.1)';
                } else {
                    selectedProjects = selectedProjects.filter(id => id !== projectId);
                    row.style.backgroundColor = '';
                }

                updateDeleteButtonState();
            });

            // إضافة تأثير hover
            checkbox.addEventListener('mouseenter', function () {
                this.style.transform = 'scale(1.1)';
            });

            checkbox.addEventListener('mouseleave', function () {
                if (!this.checked) {
                    this.style.transform = 'scale(1)';
                }
            });
        });

        selectAllBtn.addEventListener('click', function () {
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);

            checkboxes.forEach(checkbox => {
                checkbox.checked = !allChecked;
                const event = new Event('change');
                checkbox.dispatchEvent(event);
            });

            this.innerHTML = allChecked ?
                '<i class="fas fa-check-square"></i> تحديد الكل' :
                '<i class="fas fa-times-circle"></i> إلغاء الكل';
        });

        deleteSelectedBtn.addEventListener('click', deleteSelectedProjects);
        document.getElementById('deleteAllBtn').addEventListener('click', deleteAllProjects);
    }

    function updateDeleteButtonState() {
        const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
        deleteSelectedBtn.disabled = selectedProjects.length === 0;
    }

    async function deleteSelectedProjects() {
        if (selectedProjects.length === 0) return;

        const result = await Swal.fire({
            title: 'هل أنت متأكد؟',
            html: `
                <div class="choos-alert">
                    <i class="fa-solid fa-trash-can"></i>
                    <p>حددت  ${selectedProjects.length} مشروعًا للحذف </p>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: ' نعم، احذف كلووووووو',
            cancelButtonText: 'لا كنسلت',
            confirmButtonColor: '#dda853',
            cancelButtonColor: '#27548a'
        });

        if (result.isConfirmed) {
            const deletePromises = selectedProjects.map(id => deletePortfolioItem(id));
            await Promise.all(deletePromises);
            selectedProjects = [];
            await renderProjects();
            showAlert('success', 'تم الحذف', 'تم حذف المشاريع المحددة بنجاح');
        }
    }

    async function deleteAllProjects() {
        const portfolio = await getPortfolioData();
        if (portfolio.length === 0) return;

        const result = await Swal.fire({
            title: 'هل أنت متأكد؟',
            showCancelButton: true,
            confirmButtonText: 'نعم، احذف كلوووو',
            cancelButtonText: 'لا كنسل خلاص',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#27548a',
            html: `
                <div class="choos-alert">
                    <i class="fa-solid fa-trash-can"></i>
                    <p>سيتم حذف جميع المشاريع والتي يبلغ عددها (${portfolio.length}) مشاريع </p>
                </div>
            `,
        });

        if (result.isConfirmed) {
            try {
                // حذف جميع السجلات باستخدام شرط صحيح للUUID
                const {
                    error
                } = await portfolioCollection.delete().not('id', 'is', null);

                if (error) throw error;

                selectedProjects = [];
                await renderProjects();
                showAlert('success', 'تم الحذف', 'تم حذف جميع المشاريع بنجاح');
            } catch (error) {
                console.error("خطأ في حذف جميع المشاريع:", error);
                showAlert('error', 'خطأ في الحذف', 'حدث خطأ أثناء محاولة حذف جميع المشاريع');
            }
        }
    }

    // دوال مساعدة
function resetForm() {
    form.reset();
    editIndexInput.value = -1;
    submitBtn.innerHTML = '<i class="fas fa-plus"></i> إضافة مشروع';
    formTitle.textContent = 'إضافة مشروع جديد';
    formSubtitle.textContent = 'املأ النموذج لإضافة مشروع جديد إلى المعرض';
    
    // إعادة تعيين الصورة مع الحفاظ على منطقة الرفع
    document.getElementById('imagePreview').style.display = 'none';
    document.querySelector('.upload-area').style.display = 'flex';
    document.getElementById('imageUpload').value = '';
    currentImageFile = null;
    
    // إعادة تعيين معلومات الملف
    document.getElementById('fileName').textContent = '';
    document.getElementById('fileSize').textContent = '';
    
    tags = [];
    renderTags();
}

    function showAlert(icon, title, text) {
        Swal.fire({
            icon: icon,
            title: title,
            text: text,
            confirmButtonText: 'حسناً',
            confirmButtonColor: '#dda853',
            background: '#f5eedc',
            color: '#27548a',
            timer: 3000
        });
    }

    // إدارة الكلمات المفتاحية
    function loadTags(tagsArray) {
        tags = tagsArray || [];
        renderTags();
    }

    function renderTags() {
        tagsDisplay.innerHTML = '';
        tagsHiddenInput.value = tags.join(',');

        tags.forEach((tag, index) => {
            const tagElement = document.createElement('div');
            tagElement.className = 'tag-item';
            tagElement.innerHTML = `
                ${tag}
                <span class="remove-tag" data-index="${index}">
                    <i class="fas fa-times"></i>
                </span>
            `;
            tagsDisplay.appendChild(tagElement);
        });

        document.querySelectorAll('.remove-tag').forEach(btn => {
            btn.addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'));
                tags.splice(index, 1);
                renderTags();
            });
        });
    }

    function addTag() {
        const tag = tagsInput.value.trim();
        if (tag && !tags.includes(tag)) {
            tags.push(tag);
            renderTags();
            tagsInput.value = '';
        }
    }

    // رفع الصورة
    async function uploadImage(file) {
        try {
            // تهيئة متغيرات الثابتة
            const BUCKET_NAME = 'portfolio-images';
            const DATE_PREFIX = Date.now();

            // تنظيف اسم الملف وإزالة المسافات والأحرف الخاصة
            const cleanName = file.name
                .replace(/[^a-zA-Z0-9._-]/g, '-')
                .replace(/\s+/g, '-');

            const fileName = `${DATE_PREFIX}-${cleanName}`;

            // رفع الملف
            const {
                data: uploadData,
                error: uploadError
            } = await supabaseClient.storage
                .from(BUCKET_NAME)
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            // الحصول على رابط الصورة
            const {
                data: urlData,
                error: urlError
            } = await supabaseClient.storage
                .from(BUCKET_NAME)
                .getPublicUrl(fileName);

            if (urlError) throw urlError;

            return urlData.publicUrl;
        } catch (error) {
            console.error("خطأ في رفع الصورة:", error);
            showAlert('error', 'خطأ في الرفع', `فشل رفع الصورة. تأكد من:\n1. وجود bucket باسم ${BUCKET_NAME}\n2. أن المفتاح Supabase صحيح\n3. أن لديك الأذونات المناسبة على Supabase\n4. تأكد من أن اسم الملف صحيح`);
            return null;
        }
    }

    // تهيئة أزرار معاينة الصورة
    const cropBtn = document.getElementById('cropBtn');
    const removeImageBtn = document.getElementById('removeImageBtn');
    const previewImage = document.getElementById('previewImage');

    // تهيئة مستمعي الأحداث للأزرار
    cropBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (cropper) {
            const canvas = cropper.getCroppedCanvas();
            previewImage.src = canvas.toDataURL();
            currentImageFile = dataURLtoFile(canvas.toDataURL(), 'cropped-image.jpg');
            document.querySelector('.upload-area').style.display = 'none';
            document.getElementById('imagePreview').style.display = 'flex';
        }
    });

    removeImageBtn.addEventListener('click', function(e) {
        e.preventDefault();
        resetImageField();
        document.querySelector('.upload-area').style.display = 'flex';
        document.getElementById('imagePreview').style.display = 'none';
    });

    // دالة مساعدة لتحويل dataURL إلى ملف
    function dataURLtoFile(dataurl, filename) {
        const arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
    }

    // مستمعين الأحداث
    // في دالة معالجة إرسال النموذج
form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const month = document.getElementById('month').value;
    const year = document.getElementById('year').value;
    const imageFile = document.getElementById('imageUpload').files[0];
    const categories = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);

    // التحقق من الحقول المطلوبة مع استثناء الصورة عند التعديل
    const editIndex = editIndexInput.value;
    const isEditMode = editIndex !== "-1";
    
    if (categories.length === 0 ||
        !document.getElementById('title').value.trim() ||
        !document.getElementById('description').value.trim() ||
        !document.getElementById('client').value.trim() ||
        !month || !year || (!imageFile && !isEditMode)) { // لا تشترط الصورة في وضع التعديل
        showAlert('error', 'خطأ', 'الرجاء ملء جميع الحقول المطلوبة' + (isEditMode ? '' : '، بما في ذلك رفع صورة المشروع'));
        return;
    }

    try {
        Swal.fire({
            title: isEditMode ? 'جاري تحديث المشروع' : 'جاري رفع المشروع للموقع',
            html: `
                <div class="progress-container" style="margin-top: 20px; background: #f1f1f1; border-radius: 10px; height: 20px;">
                    <div id="uploadProgressBar" style="width: 0%; height: 100%; background: #dda853; border-radius: 10px; transition: width 0.3s;"></div>
                </div>
                <p id="progressText" style="margin-top: 10px; font-size: 1.1rem; color: #27548a;">0% مكتمل</p>
            `,
            showConfirmButton: false,
            allowOutsideClick: false,
            willOpen: () => {
                let progress = 0;
                const progressBar = document.getElementById('uploadProgressBar');
                const progressText = document.getElementById('progressText');

                const progressInterval = setInterval(() => {
                    progress += Math.random() * 10;
                    if (progress > 100) progress = 100;

                    progressBar.style.width = `${progress}%`;
                    progressText.textContent = `${Math.round(progress)}% مكتمل`;

                    if (progress === 100) {
                        clearInterval(progressInterval);
                    }
                }, 300);
            }
        });

        const externalLink = document.getElementById('externalLink').value.trim();
        if (externalLink && !isValidUrl(externalLink)) {
            showAlert('error', 'رابط غير صالح', 'الرجاء إدخال رابط صحيح يبدأ بـ http:// أو https://');
            return;
        }

        let imageUrl = document.getElementById('previewImage').src;

        // إذا كان في وضع التعديل ولم يتم رفع صورة جديدة، نستخدم الصورة الحالية
        if (isEditMode && !imageFile) {
            const { data: existingProject, error } = await portfolioCollection
                .select('image')
                .eq('id', editIndex)
                .single();
            
            if (error) throw error;
            imageUrl = existingProject.image;
        } else if (imageFile) {
            // رفع الصورة الجديدة إذا تم توفيرها
            imageUrl = await uploadImage(imageFile);
            if (!imageUrl) throw new Error('Failed to upload image');
        }

        const newProject = {
            category: categories,
            image: imageUrl,
            title: document.getElementById('title').value.trim(),
            description: document.getElementById('description').value.trim(),
            client: document.getElementById('client').value.trim(),
            date: `${month} ${year}`,
            tags: document.getElementById('tags').value.trim() ?
                document.getElementById('tags').value.trim().split(',').map(t => t.trim()) : [],
            external_link: document.getElementById('externalLink').value.trim() || null
        };

        const success = await savePortfolioData(newProject, isEditMode, isEditMode ? editIndex : null);

        if (success) {
            await renderProjects();
            resetForm();
            
            if (isEditMode) {
                showAlert('success', 'تم التعديل', 'تم تحديث بيانات المشروع بنجاح');
            } else {
                Swal.fire({
                    title: 'تمّ رفع المشروع',
                    html: `
                        <div class="success-alert">
                            <i class="fas fa-check-circle"></i>
                        </div>
                    `,
                    showDenyButton: true,
                    confirmButtonText: 'شُكرًا',
                    denyButtonText: 'رؤية المشروع',
                    confirmButtonColor: '#4caf50',
                    denyButtonColor: '#dda853',
                }).then((result) => {
                    if (result.isDenied) {
                        window.location.href = 'index.html#stats';
                    }
                });
            }
        }
    } catch (error) {
        console.error("Error in form submission:", error);
        showAlert('error', 'خطأ', 'حدث خطأ أثناء حفظ بيانات المشروع');
    }
});

    resetBtn.addEventListener('click', resetForm);

projectsTableBody.addEventListener('click', async function (e) {
    const editBtn = e.target.closest('.edit-btn');
    if (editBtn) {
        const docId = editBtn.dataset.id;
        try {
            const { data: project, error } = await portfolioCollection.select().eq('id', docId).single();
            if (error) throw error;

            if (project) {
                // مسح جميع التحديدات أولاً
                document.querySelectorAll('.category-checkbox').forEach(checkbox => {
                    checkbox.checked = false;
                });

                // تحديد التصنيفات المختارة
                if (project.category) {
                    const categories = Array.isArray(project.category) ? project.category : [project.category];
                    categories.forEach(cat => {
                        const checkbox = document.querySelector(`.category-checkbox[value="${cat}"]`);
                        if (checkbox) checkbox.checked = true;
                    });
                }

                // تعبئة حقول النموذج
                document.getElementById('title').value = project.title;
                document.getElementById('description').value = project.description;
                document.getElementById('client').value = project.client;

                // عرض الصورة الحالية
                const preview = document.getElementById('previewImage');
                preview.src = project.image;
                document.getElementById('imagePreview').style.display = 'block';
                document.querySelector('.upload-area').style.display = 'none';
                
                // تعبئة معلومات الملف (إذا كانت متوفرة)
    if (project.image) {
        try {
            const response = await fetch(project.image);
            const blob = await response.blob();
            currentImageFile = new File([blob], 'current-image.jpg', { type: blob.type });
            
            preview.src = project.image;
            document.getElementById('imagePreview').style.display = 'block';
            document.querySelector('.upload-area').style.display = 'none';
            
            // تحديث معلومات الملف
            document.getElementById('fileName').textContent = 'الصورة الحالية';
            document.getElementById('fileSize').textContent = formatFileSize(blob.size);
        } catch (error) {
            console.error("Error loading current image:", error);
            currentImageFile = null;
        }
    }

                // تعبئة التاريخ
                const dateParts = project.date.split(' ');
                document.getElementById('month').value = dateParts[0];
                document.getElementById('year').value = dateParts[1];

                // تعبئة الكلمات المفتاحية والرابط
                loadTags(project.tags || []);
                document.getElementById('externalLink').value = project.external_link || '';

                // تعيين معرف المشروع للتحرير
                editIndexInput.value = docId;
                submitBtn.innerHTML = '<i class="fas fa-save"></i> حفظ التعديلات';
                formTitle.textContent = 'تعديل المشروع';
                formSubtitle.textContent = 'قم بتعديل بيانات المشروع ثم احفظ التغييرات';

                document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
            }
        } catch (error) {
            console.error("Error getting document:", error);
            showAlert('error', 'خطأ', 'حدث خطأ أثناء تحميل بيانات المشروع');
        }
    }

        const deleteBtn = e.target.closest('.delete-btn');
        if (deleteBtn) {
            const docId = deleteBtn.dataset.id;
            Swal.fire({
                title: 'هل أنت متأكد؟',
                text: "لن تتمكن من استعادة هذا المشروع بعد الحذف!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dda853',
                cancelButtonColor: '#27548a',
                confirmButtonText: 'نعم، احذفه',
                cancelButtonText: 'إلغاء'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const success = await deletePortfolioItem(docId);
                    if (success) {
                        await renderProjects();
                        showAlert('success', 'تم الحذف', 'تم حذف المشروع بنجاح');
                    }
                }
            });
        }
    });

    tagsInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    });

    addTagBtn.addEventListener('click', addTag);

    // تحميل SweetAlert2 إذا لم يكن محملاً
    if (typeof Swal === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
        script.onload = renderProjects;
        document.head.appendChild(script);
    } else {
        renderProjects();
    }

    // زر العودة للصفحة الرئيسية - تحسينات إضافية
    document.getElementById('homeButton').addEventListener('click', function () {
        // إضافة تأثير عند النقر
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = 'scale(1.1)';
            window.location.href = 'index.html'; // تغيير الرابط حسب احتياجك
        }, 200);

        // يمكنك إضافة تحليلات أو متابعة هنا إذا لزم الأمر
        console.log('تم الانتقال إلى الصفحة الرئيسية');
    });
});

// أحداث قلب الصورة
if (document.getElementById('flipHorizontal')) {
    document.getElementById('flipHorizontal').addEventListener('click', () => {
        if (cropper) {
            const scaleX = cropper.getData().scaleX || 1;
            cropper.scaleX(-scaleX);
        }
    });
}

if (document.getElementById('flipVertical')) {
    document.getElementById('flipVertical').addEventListener('click', () => {
        if (cropper) {
            const scaleY = cropper.getData().scaleY || 1;
            cropper.scaleY(-scaleY);
        }
    });
}

// تحديث دالة openCropModal لإضافة تحديث الحجم
function openCropModal(imageSrc) {

    const cropModal = document.getElementById('cropModal');
    if (!cropModal) return;
    if (!imageSrc || !currentImageFile) {
        console.error('Cannot open crop modal: no image source or file');
        showAlert('error', 'خطأ', 'لا توجد صورة متاحة للاقتصاص');
        return;
    }
    cropModal.style.display = 'flex';

    setTimeout(() => {
        cropModal.classList.add('active');
    }, 50);

    const image = document.createElement('img');
    image.id = 'cropImage';
    image.src = imageSrc;
    image.style.maxWidth = '100%';

    const cropPreview = document.getElementById('cropPreview');
    if (cropPreview) {
        cropPreview.innerHTML = '';
        cropPreview.appendChild(image);
    }

    if (!currentImageFile) {
        console.error('Cannot open crop modal: currentImageFile is not defined');
        return;
    }

    if (cropper) cropper.destroy();

    cropper = new Cropper(image, {
        viewMode: 1,
        autoCropArea: 0.8,
        responsive: true,
        restore: false,
        guides: true,
        center: true,
        highlight: true,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false,
        aspectRatio: NaN,
        crop: function (event) {
            updateSizeIndicator(event.detail.width, event.detail.height);
        }
    });
    cropper.imageFile = currentImageFile;
}


function updateSizeIndicator(width, height) {
    const sizeIndicator = document.getElementById('cropSize');
    // تقريب الأرقام إلى أقرب عدد صحيح باستخدام Math.round
    const roundedWidth = Math.round(width);
    const roundedHeight = Math.round(height);

    sizeIndicator.textContent = `${roundedWidth} × ${roundedHeight} بكسل`;
}

// أضف هذه الدوال في قسم المتغيرات العامة
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function updateFileInfo(file) {
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = formatFileSize(file.size);
}

// في دالة معالجة الصورة بعد الرفع أو الاقتصاص:
function handleImageAfterProcessing(blob, file) {
    const preview = document.getElementById('previewImage');
    preview.src = URL.createObjectURL(blob);

    document.getElementById('imagePreview').style.display = 'block';
    document.querySelector('.upload-area').style.display = 'none';

    updateFileInfo(file); // تحديث معلومات الملف

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    imageUpload.files = dataTransfer.files;
}

// استبدال الكود الحالي لهذا الجزء بهذا الكود:
document.getElementById('cropBtn').addEventListener('click', function (e) {
    e.preventDefault();
    
    if (!currentImageFile) {
        showAlert('error', 'لا توجد صورة', 'لا توجد صورة متاحة للاقتصاص');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(event) {
        openCropModal(event.target.result);
        cropModalOpened = true;
    };
    reader.readAsDataURL(currentImageFile);
});

// دالة لمعالجة سحب وإفلات الصور
function setupDragAndDrop() {
    const uploadArea = document.querySelector('.upload-area');
    const imageUpload = document.getElementById('imageUpload');

    // منع السلوك الافتراضي لسحب الملفات
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // إضافة تأثيرات عند السحب
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        uploadArea.classList.add('drag-over');
    }

    function unhighlight() {
        uploadArea.classList.remove('drag-over');
    }

    // معالجة الملفات المنسدلة
    uploadArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;

        if (files.length > 0) {
            const file = files[0];

            // التحقق من نوع الملف
            if (!file.type.match('image.*')) {
                showAlert('error', 'خطأ في نوع الملف', 'الرجاء اختيار ملف صورة فقط (JPG, PNG)');
                return;
            }

            // التحقق من حجم الملف
            if (file.size > 10 * 1024 * 1024) {
                showAlert('error', 'حجم الملف كبير', 'الحد الأقصى لحجم الصورة هو 10MB');
                return;
            }

            // تحديث حقل الرفع اليدوي
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            imageUpload.files = dataTransfer.files;

            // تشغيل حدث التغيير يدويًا
            const event = new Event('change');
            imageUpload.dispatchEvent(event);
        }
    }
}

// استدعاء الدالة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function () {
    setupDragAndDrop();
});

// أضف هذه الدوال في قسم المتغيرات العامة
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

function formatUrl(url) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return `https://${url}`;
    }
    return url;
}

// أضف هذا المستمع في قسم مستمعين الأحداث
document.getElementById('testLinkBtn').addEventListener('click', function() {
    const urlInput = document.getElementById('externalLink');
    let url = urlInput.value.trim();
    
    if (!url) {
        showAlert('error', 'حقل فارغ', 'الرجاء إدخال رابط أولاً');
        return;
    }
    
    // تنسيق الرابط إذا لم يكن يحتوي على http/https
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
        urlInput.value = url;
    }
    
    // التحقق من صحة الرابط
    if (!isValidUrl(url)) {
        showAlert('error', 'رابط غير صالح', 'الرجاء إدخال رابط صحيح يبدأ بـ http:// أو https://');
        return;
    }
    
    // فتح الرابط في نافذة جديدة بعد التأكيد
    Swal.fire({
        title: 'فتح الرابط',
        html: `هل تريد فتح الرابط التالي في نافذة جديدة؟<br><br><a href="${url}" target="_blank" style="color: #27548a; word-break: break-all;">${url}</a>`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'نعم، افتح الرابط',
        cancelButtonText: 'إلغاء',
        confirmButtonColor: '#00b894',
        cancelButtonColor: '#27548a'
    }).then((result) => {
        if (result.isConfirmed) {
            window.open(url, '_blank');
        }
    });
});



// أضف هذا المستمع للتحقق أثناء الكتابة
document.getElementById('externalLink').addEventListener('input', function() {
    const url = this.value.trim();
    const testBtn = document.getElementById('testLinkBtn');
    
    if (url && isValidUrl(url)) {
        this.setCustomValidity('');
        testBtn.disabled = false;
    } else {
        testBtn.disabled = !url;
    }
});

// دالة لجلب بيانات الزوار من Supabase
async function fetchVisitorsData(filter = {}) {
    try {
        let query = supabaseClient
            .from('visitors')
            .select('*')
            .order('session_start', { ascending: false });

        // تطبيق الفلاتر
        if (filter.dateRange) {
            const date = new Date();
            switch (filter.dateRange) {
                case 'today':
                    date.setDate(date.getDate() - 1);
                    break;
                case 'week':
                    date.setDate(date.getDate() - 7);
                    break;
                case 'month':
                    date.setMonth(date.getMonth() - 1);
                    break;
                default:
                    // لا يوجد فلتر زمني
            }
            
            if (filter.dateRange !== 'all') {
                query = query.gte('session_start', date.toISOString());
            }
        }

        if (filter.visitorType === 'new') {
            query = query.eq('first_visit', true);
        } else if (filter.visitorType === 'returning') {
            query = query.eq('returning_visitor', true);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching visitors data:', error);
        showAlert('error', 'خطأ', 'حدث خطأ أثناء جلب بيانات الزوار');
        return [];
    }
}

// دالة لعرض بيانات الزوار في الجدول
async function renderVisitorsTable() {
    const dateFilter = document.getElementById('visitorDateFilter').value;
    const typeFilter = document.getElementById('visitorTypeFilter').value;
    
    const visitors = await fetchVisitorsData({
        dateRange: dateFilter,
        visitorType: typeFilter
    });

    // تجميع الزوار وحساب عدد الجلسات لكل زائر
    const visitorSessions = {};
    visitors.forEach(visitor => {
        if (!visitorSessions[visitor.visitor_id]) {
            visitorSessions[visitor.visitor_id] = {
                sessions: [],
                count: 0
            };
        }
        visitorSessions[visitor.visitor_id].sessions.push(visitor);
        visitorSessions[visitor.visitor_id].count++;
    });

    // تحضير البيانات للعرض (آخر جلسة لكل زائر مع عدد الجلسات)
    const latestSessions = Object.keys(visitorSessions).map(visitorId => {
        const sessions = visitorSessions[visitorId].sessions;
        const lastSession = sessions.reduce((latest, current) => {
            return new Date(current.session_start) > new Date(latest.session_start) ? current : latest;
        }, sessions[0]);
        
        return {
            ...lastSession,
            session_count: visitorSessions[visitorId].count
        };
    });

    // تحديث الإحصائيات (نستخدم جميع الزيارات)
    updateVisitorStats(visitors);

    const tableBody = document.getElementById('visitorsTableBody');
    tableBody.innerHTML = '';

    if (latestSessions.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="no-visitors">
                    <i class="fas fa-users-slash"></i>
                    لا توجد بيانات للزوار في الفترة المحددة
                </td>
            </tr>
        `;
        return;
    }

    latestSessions.forEach(visitor => {
        const row = document.createElement('tr');
        row.dataset.visitorId = visitor.visitor_id;
        
        const lastVisit = new Date(visitor.session_start);
        const formattedDate = lastVisit.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        row.innerHTML = `
            <td>${visitor.visitor_id.substring(0, 5)}...</td>
            <td>
                <span class="country-flag" data-country="${visitor.country}">
                    ${visitor.country_name || visitor.country || 'غير معروف'}
                </span>
            </td>
            <td>${getDeviceIcon(visitor.device_type)} ${visitor.device_type}</td>
            <td>${visitor.session_count}</td>
            <td class="session-duration-cell">${visitor.session_duration ? formatDuration(visitor.session_duration) : 'غير معروف'}</td>
            <td>
                <button class="view-details-btn" data-visitor-id="${visitor.visitor_id}">
                    <i class="fas fa-eye"></i> عرض التفاصيل
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });

    // إضافة مستمعات الأحداث لأزرار التفاصيل
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const visitorId = btn.dataset.visitorId;
            showVisitorDetails(visitorId);
        });
    });
}

// دالة لتحديث الإحصائيات
function updateVisitorStats(visitors) {
    const totalVisitors = visitors.length;
    const newVisitors = visitors.filter(v => v.first_visit).length;
    const returningVisitors = visitors.filter(v => v.returning_visitor).length;
    const projectInteractions = visitors.reduce((sum, v) => sum + (v.project_interactions || 0), 0);
    const cvDownloads = visitors.reduce((sum, v) => sum + (v.downloaded_cv || 0), 0);
    const contactSubmissions = visitors.reduce((sum, v) => sum + (v.contact_form_submitted || 0), 0);
    
    // حساب عدد الدول المختلفة
    const uniqueCountries = new Set();
    visitors.forEach(visitor => {
        if (visitor.country) {
            uniqueCountries.add(visitor.country);
        }
    });
    const countriesCount = uniqueCountries.size;

    const validSessions = visitors.filter(v => v.session_duration > 0);
    const avgSessionDuration = validSessions.length > 0 
        ? validSessions.reduce((sum, v) => sum + v.session_duration, 0) / validSessions.length 
        : 0;

    document.getElementById('totalVisitors').textContent = totalVisitors;
    document.getElementById('newVisitors').textContent = newVisitors;
    document.getElementById('returningVisitors').textContent = returningVisitors;
    document.getElementById('projectInteractions').textContent = projectInteractions;
    document.getElementById('cvDownloads').textContent = cvDownloads;
    document.getElementById('contactSubmissions').textContent = contactSubmissions;
    document.getElementById('avgSessionDuration').textContent = formatDuration(avgSessionDuration);
    document.getElementById('countriesCount').textContent = countriesCount; // تحديث عدد الدول
}

// دالة لعرض تفاصيل الزائر
// دالة لعرض تفاصيل الزائر
async function showVisitorDetails(visitorId) {
    try {
        // جلب جميع جلسات هذا الزائر
        const { data: visitorSessions, error } = await supabaseClient
            .from('visitors')
            .select('*')
            .eq('visitor_id', visitorId)
            .order('session_start', { ascending: false });

        if (error) throw error;

        if (!visitorSessions || visitorSessions.length === 0) {
            showAlert('error', 'خطأ', 'لا توجد بيانات لهذا الزائر');
            return;
        }

        // جلب بيانات المشاريع من قاعدة البيانات لربطها مع المشاريع التي رآها الزائر
        const { data: allProjects, error: projectsError } = await supabaseClient
            .from('portfolio')
            .select('id, title');
        
        if (projectsError) throw projectsError;

        const projectsMap = {};
        allProjects.forEach(project => {
            projectsMap[project.id] = project.title;
        });

        const latestSession = visitorSessions[0];
        const modal = document.getElementById('visitorDetailsModal');
        
        // تعبئة البيانات الأساسية (كما كانت)
        document.getElementById('detailVisitorId').textContent = visitorId;
        document.getElementById('detailVisitorType').textContent = 
            latestSession.first_visit ? 'زائر جديد' : 'زائر عائد';
        document.getElementById('detailFirstVisit').textContent = 
            new Date(visitorSessions[visitorSessions.length - 1].session_start).toLocaleString('ar-SA');
        document.getElementById('detailLastVisit').textContent = 
            new Date(latestSession.session_start).toLocaleString('ar-SA');
        document.getElementById('detailVisitCount').textContent = visitorSessions.length;

        // معلومات الموقع
        document.getElementById('detailCountry').textContent = 
            latestSession.country_name || latestSession.country || 'غير معروف';
        document.getElementById('detailCity').textContent = latestSession.city || 'غير معروف';
        document.getElementById('detailTimezone').textContent = latestSession.timezone || 'غير معروف';
        document.getElementById('detailIp').textContent = latestSession.ip_address || 'غير معروف';
        document.getElementById('detailRegion').textContent = latestSession.region || 'غير معروف';

        // معلومات الجهاز
        document.getElementById('detailDevice').textContent = 
            getDeviceName(latestSession.device_type) || 'غير معروف';
        document.getElementById('detailOs').textContent = latestSession.os || 'غير معروف';
        document.getElementById('detailBrowser').textContent = latestSession.browser || 'غير معروف';
        document.getElementById('detailResolution').textContent = latestSession.screen_resolution || 'غير معروف';
document.getElementById('detailDeviceModel').textContent = 
    latestSession.device_model || 'غير معروف';
        
        // الإحصائيات
        document.getElementById('detailScrollDepth').textContent = 
            latestSession.scroll_depth ? `${latestSession.scroll_depth}%` : 'لم يتحرك';
            // داخل دالة showVisitorDetails بعد تعبئة البيانات الأساسية
document.getElementById('detailReferralSource').textContent = 
    latestSession.referral_source || 'مباشر';

                    const cvDownloads = visitorSessions.reduce((sum, v) => sum + (v.downloaded_cv || 0), 0);
        const contactSubmissions = visitorSessions.reduce((sum, v) => sum + (v.contact_form_submitted || 0), 0);
        
        const cvElement = document.getElementById('detailCvDownloads');
        const contactElement = document.getElementById('detailContactSubmissions');
        
        if (cvElement) cvElement.textContent = cvDownloads;
        if (contactElement) contactElement.textContent = contactSubmissions;
        
const projectsCount = latestSession.project_interactions || 0;
const projectsText = projectsCount > 1 ? 'مشاريع' : 'مشروع';

document.getElementById('detailProjectInteractions').textContent = 
    projectsCount + " " + projectsText;

        // عرض المشاريع التي رآها الزائر بدلاً من العدد فقط
        const viewedProjects = latestSession.viewed_projects || [];
        const projectsList = viewedProjects.map(projectId => {
            return projectsMap[projectId] || projectId;
        }).join(', ');


// داخل قسم الإحصائيات في المودال
document.getElementById('detailCvDownloads').textContent = cvDownloads;
document.getElementById('detailContactSubmissions').textContent = contactSubmissions;
        
        document.getElementById('detailProjectsViewed').textContent = 
            viewedProjects.length > 0 ? projectsList : 'لا يوجد';

        document.getElementById('detailLanguage').textContent = 
            latestSession.preferred_language === 'ar' ? 'العربية' : 'الإنجليزية';
        document.getElementById('detailSessionDuration').textContent = 
            latestSession.session_duration ? formatDuration(latestSession.session_duration) : 'غير معروف';
        
        // تعبئة جدول الجلسات مع عرض المشاريع التي تمت مشاهدتها
        const sessionsBody = document.getElementById('visitorSessionsBody');
        sessionsBody.innerHTML = '';

        visitorSessions.forEach(session => {
            const row = document.createElement('tr');
            
            const viewedPages = session.viewed_pages ? session.viewed_pages.length : 0;
            const viewedProjects = session.viewed_projects || [];
            
            // إنشاء قائمة بالمشاريع التي تمت مشاهدتها في هذه الجلسة
            const projectsList = viewedProjects.map(projectId => {
                return projectsMap[projectId] || projectId;
            }).join(', ');
            
row.innerHTML = `
    <td>${new Date(session.session_start).toLocaleString('ar-SA')}</td>
    <td>${session.session_duration ? formatDuration(session.session_duration) : 'غير معروف'}</td>
    <td>${session.scroll_depth ? `${session.scroll_depth}%` : 'غير معروف'}</td>
    <td>${viewedProjects.length > 0 ? projectsList : 'لا يوجد'}</td>
    <td>${viewedProjects.length}</td>
    <td>${session.viewed_sections ? session.viewed_sections.join(', ') : 'لا يوجد'}</td>
    <td>${session.downloaded_cv || 0}</td>
    <td>${session.contact_form_submitted || 0}</td>
    <td>${session.referral_source || 'مباشر'}</td>
`;
            
            sessionsBody.appendChild(row);
        });

        // عرض المودال
        modal.style.display = 'block';
        
        // إضافة مستمعات الأحداث للأزرار
        document.querySelector('.close-modal').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        document.getElementById('exportVisitorData').addEventListener('click', () => {
            // تصدير جميع جلسات الزائر وليس فقط الأخيرة
            exportVisitorData(visitorSessions, projectsMap);
        });

        // إغلاق المودال عند النقر خارج المحتوى
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        const viewedSections = latestSession.viewed_sections || [];
        
        document.getElementById('detailViewedSections').textContent = 
            viewedSections.length > 0 ? viewedSections.join(', ') : 'لا يوجد';
    } catch (error) {
        console.error('Error fetching visitor details:', error);
        showAlert('error', 'خطأ', 'حدث خطأ أثناء جلب تفاصيل الزائر');
    }
}

// تعديل دالة التصدير لتشمل أسماء المشاريع
function exportVisitorData(sessions, projectsMap = {}) {
    const data = sessions.map(session => {
        const viewedProjects = session.viewed_projects || [];
        const projectsList = viewedProjects.map(projectId => {
            return projectsMap[projectId] || projectId;
        }).join(', ');
        
        return {
            'معرف الجلسة': session.session_id,
            'تاريخ الجلسة': new Date(session.session_start).toLocaleString('ar-SA'),
            'مدة الجلسة': session.session_duration ? formatDuration(session.session_duration) : 'غير معروف',
            'البلد': session.country_name || session.country || 'غير معروف',
            'المدينة': session.city || 'غير معروف',
            'نوع الجهاز': getDeviceName(session.device_type),
            'طراز الجهاز': session.device_model || 'غير معروف',
            'المتصفح': session.browser,
            'نظام التشغيل': session.os,
            'دقة الشاشة': session.screen_resolution,
            'معدل التمرير': session.scroll_depth ? `${session.scroll_depth}%` : 'غير معروف',
            'المشاريع المطالعة': viewedProjects.length > 0 ? projectsList : 'لا يوجد',
            'عدد المشاريع المطالعة': viewedProjects.length,
            'عدد التفاعلات': session.project_interactions || 0,
            'اللغة المفضلة': session.preferred_language === 'ar' ? 'العربية' : 'الإنجليزية',
            'تحميلات السيرة الذاتية': session.downloaded_cv || 0,
            'إرسالات نموذج الاتصال': session.contact_form_submitted || 0,
            'مصدر الزيارة': session.referral_source || 'مباشر',
        };
    });

    const csv = Papa.unparse(data);
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `visitor_data_${sessions[0].visitor_id.substring(0, 8)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// دالة مساعدة للحصول على أيقونة الجهاز
function getDeviceIcon(deviceType) {
    switch (deviceType) {
        case 'mobile': return '<i class="fas fa-mobile-alt"></i>';
        case 'tablet': return '<i class="fas fa-tablet-alt"></i>';
        default: return '<i class="fas fa-desktop"></i>';
    }
}

// دالة مساعدة للحصول على اسم الجهاز
function getDeviceName(deviceType) {
    switch (deviceType) {
        case 'mobile': return 'هاتف محمول';
        case 'tablet': return 'جهاز لوحي';
        default: return 'كمبيوتر';
    }
}

// دالة لتصدير بيانات الزائر
function exportVisitorData(sessions) {
    const data = sessions.map(session => ({
        'معرف الجلسة': session.session_id,
        'تاريخ الجلسة': new Date(session.session_start).toLocaleString('ar-SA'),
        'مدة الجلسة (ثانية)': session.session_duration || 'غير معروف',
        'البلد': session.country_name || session.country || 'غير معروف',
        'المنطقة': session.region || 'غير معروف',
        'المدينة': session.city || 'غير معروف',
        'نوع الجهاز': getDeviceName(session.device_type),
        'المتصفح': session.browser,
        'نظام التشغيل': session.os,
                'مدة الجلسة': session.session_duration ? formatDuration(session.session_duration) : 'غير معروف',
        'متوسط مدة الزيارة': calculateAvgDuration(sessions),
        'دقة الشاشة': session.screen_resolution,
        'معدل التمرير': session.scroll_depth ? `${session.scroll_depth}%` : 'غير معروف',
        'المشاريع المطالعة': session.viewed_projects ? session.viewed_projects.join(', ') : 'لا يوجد',
        'عدد التفاعلات': session.project_interactions || 0,
        'اللغة المفضلة': session.preferred_language === 'ar' ? 'العربية' : 'الإنجليزية'
    }));

    const csv = Papa.unparse(data);
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `visitor_data_${sessions[0].visitor_id.substring(0, 8)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function calculateAvgDuration(sessions) {
    const validSessions = sessions.filter(s => s.session_duration > 0);
    if (validSessions.length === 0) return '0 ثانية';
    
    const total = validSessions.reduce((sum, s) => sum + s.session_duration, 0);
    const avg = total / validSessions.length;
    return formatDuration(avg);
}

// تهيئة قسم الزوار عند تحميل الصفحة
function initVisitorsSection() {
    // إضافة مستمعات الأحداث للفلاتر
    document.getElementById('visitorDateFilter').addEventListener('change', renderVisitorsTable);
    document.getElementById('visitorTypeFilter').addEventListener('change', renderVisitorsTable);
    document.getElementById('refreshVisitors').addEventListener('click', renderVisitorsTable);
    
    // جلب البيانات الأولية
    renderVisitorsTable();
}

// استدعاء الدالة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initVisitorsSection();
    
    // تأكد من أن مكتبة Papa Parse موجودة لتصدير CSV
    if (typeof Papa === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js';
        script.onload = initVisitorsSection;
        document.head.appendChild(script);
    }
});

// دالة لتنسيق المدة من الثواني إلى صيغة مقروءة (دقائق:ثواني)
function formatDuration(seconds) {
    if (!seconds || seconds <= 0) return '0 ثانية';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    
    if (mins > 0) {
        return `${mins} دقيقة و ${secs} ثانية`;
    } else {
        return `${secs} ثانية`;
    }
}

function formatViewedData(viewedPages = [], viewedSections = []) {
    const pagesCount = viewedPages?.length || 0;
    const sectionsCount = viewedSections?.length || 0;
    
    return `${pagesCount} صفحة، ${sectionsCount} قسم`;
}