// تهيئة Supabase
const { createClient } = supabase;
const supabaseUrl = 'https://txywqmxcynvofslqdlck.supabase.co'; // Ensure this URL is correct and accessible
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4eXdxbXhjeW52b2ZzbHFkbGNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMzY3MjksImV4cCI6MjA2NTcxMjcyOX0.ONwEYLhtDwZffyNZTiSYy3ZX5lx1tBVpCQoODrqfrK8';
const supabaseClient = createClient(supabaseUrl, supabaseKey);

// تعريف جداول Supabase
const portfolioCollection = supabaseClient.from('portfolio');
const storage = supabaseClient.storage.from('portfolio-images');

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
            const { data, error } = await portfolioCollection.select().order('date', { ascending: false });
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error getting portfolio data:", error);
            return [];
        }
    }

    async function savePortfolioData(projectData, isEdit = false, docId = null) {
        try {
            if (isEdit && docId) {
                const { error } = await portfolioCollection.update(projectData).eq('id', docId);
                if (error) throw error;
            } else {
                const { error } = await portfolioCollection.insert([projectData]);
                if (error) throw error;
            }
            return true;
        } catch (error) {
            console.error("Error saving portfolio data:", error);
            return false;
        }
    }

    async function deletePortfolioItem(docId) {
        try {
            const { error } = await portfolioCollection.delete().eq('id', docId);
            if (error) throw error;
            return true;
        } catch (error) {
            console.error("Error deleting portfolio item:", error);
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
        <input type="checkbox" class="select-checkbox" data-id="${item.id}" title="تحديد هذا المشروع">
    </td>                <td><img src="${item.image}" alt="${item.title}" class="project-thumb" /></td>
                <td>${item.title}</td>
                <td><span class="category-badge category-${item.category}">${getCategoryName(item.category)}</span></td>
                <td>${item.client}</td>
                <td>${item.date}</td>
                <td class="project-link">
                    ${item.externalLink ?
                    `<a href="${item.externalLink}" target="_blank" class="link-btn" title="فتح الرابط">
                            <i class="fas fa-external-link-alt"></i>
                        </a>` :
                    '<span class="no-link"><i class="fas fa-unlink"></i></span>'}
                </td>
                <td class="actions">
                    <button class="action-btn edit-btn" data-id="${item.id}" title="تعديل">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" data-id="${item.id}" title="حذف">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            projectsTableBody.appendChild(tr);
        });

        toggleEmptyState(portfolio);
        setupSelectionHandlers();
    }

    function getCategoryName(category) {
        const categories = {
            graphic: 'جرافيك',
            motion: 'موشن',
            video: 'فيديو',
            voice: 'صوت',
            web: 'ويب'
        };
        return categories[category] || category;
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
            text: `سيتم حذف ${selectedProjects.length} مشروعاً`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'نعم، احذف',
            cancelButtonText: 'إلغاء',
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
            text: `سيتم حذف جميع المشاريع (${portfolio.length})`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'نعم، احذف الكل',
            cancelButtonText: 'إلغاء',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#27548a'
        });

        if (result.isConfirmed) {
            const deletePromises = portfolio.map(item => deletePortfolioItem(item.id));
            await Promise.all(deletePromises);
            selectedProjects = [];
            await renderProjects();
            showAlert('success', 'تم الحذف', 'تم حذف جميع المشاريع بنجاح');
        }
    }

    // دوال مساعدة
    function resetForm() {
        form.reset();
        editIndexInput.value = -1;
        submitBtn.innerHTML = '<i class="fas fa-plus"></i> إضافة مشروع';
        formTitle.textContent = 'إضافة مشروع جديد';
        formSubtitle.textContent = 'املأ النموذج لإضافة مشروع جديد إلى المعرض';
        document.getElementById('imagePreview').style.display = 'none';
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
            const fileName = `${Date.now()}-${file.name}`;
            const { data, error } = await storage.upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });
            if (error) throw error;

            const { data: urlData } = await storage.getPublicUrl(fileName);
            return urlData.publicUrl;
        } catch (error) {
            console.error("Error uploading image:", error);
            showAlert('error', 'خطأ في الرفع', 'فشل رفع الصورة. تأكد من أن لديك الأذونات الصحيحة على Supabase Storage.');
            return null;
        }
    }

    // مستمعين الأحداث
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const month = document.getElementById('month').value;
        const year = document.getElementById('year').value;
        const imageFile = document.getElementById('imageUpload').files[0];

        if (!imageFile || !document.getElementById('category').value ||
            !document.getElementById('title').value.trim() ||
            !document.getElementById('description').value.trim() ||
            !document.getElementById('client').value.trim() ||
            !month || !year) {
            showAlert('error', 'خطأ', 'الرجاء ملء جميع الحقول المطلوبة');
            return;
        }

        try {
            showAlert('info', 'جاري الرفع', 'جاري رفع صورة المشروع، الرجاء الانتظار...');
            const imageUrl = await uploadImage(imageFile);

            const newProject = {
                category: document.getElementById('category').value,
                image: imageUrl,
                title: document.getElementById('title').value.trim(),
                description: document.getElementById('description').value.trim(),
                client: document.getElementById('client').value.trim(),
                date: `${month} ${year}`,
                tags: document.getElementById('tags').value.trim() ?
                    document.getElementById('tags').value.trim().split(',').map(t => t.trim()) : []
            };

            const editIndex = editIndexInput.value;
            let success = false;

            if (editIndex === "-1") {
                success = await savePortfolioData(newProject);
                if (success) {
                    showAlert('success', 'تمت الإضافة', 'تم إضافة المشروع بنجاح إلى المعرض');
                }
            } else {
                success = await savePortfolioData(newProject, true, editIndex);
                if (success) {
                    showAlert('success', 'تم التعديل', 'تم تحديث بيانات المشروع بنجاح');
                }
            }

            if (success) {
                await renderProjects();
                resetForm();
            }
        } catch (error) {
            console.error("Error in form submission:", error);
            showAlert('error', 'خطأ', 'حدث خطأ أثناء رفع الصورة أو حفظ البيانات');
        }
    });

    resetBtn.addEventListener('click', resetForm);

    projectsTableBody.addEventListener('click', async function (e) {
        const editBtn = e.target.closest('.edit-btn');
        const deleteBtn = e.target.closest('.delete-btn');

        if (editBtn) {
            const docId = editBtn.dataset.id;
            try {
                const { data: project, error } = await portfolioCollection.select().eq('id', docId).single();
                if (error) throw error;

                if (project) {

                    document.getElementById('category').value = project.category;
                    document.getElementById('title').value = project.title;
                    document.getElementById('description').value = project.description;
                    document.getElementById('client').value = project.client;

                    const preview = document.getElementById('previewImage');
                    preview.src = project.image;
                    document.getElementById('imagePreview').style.display = 'block';

                    const dateParts = project.date.split(' ');
                    document.getElementById('month').value = dateParts[0];
                    document.getElementById('year').value = dateParts[1];

                    loadTags(project.tags || []);
                    document.getElementById('externalLink').value = project.externalLink || '';

                    editIndexInput.value = docId;
                    submitBtn.innerHTML = '<i class="fas fa-save"></i> حفظ التعديلات';
                    formTitle.textContent = 'تعديل المشروع';
                    formSubtitle.textContent = 'قم بتعديل بيانات المشروع ثم احفظ التغييرات';

                    document.querySelector('.form-container').scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            } catch (error) {
                console.error("Error getting document:", error);
                showAlert('error', 'خطأ', 'حدث خطأ أثناء تحميل بيانات المشروع');
            }
        }

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

    document.getElementById('imageUpload').addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const preview = document.getElementById('previewImage');
                preview.src = event.target.result;
                document.getElementById('imagePreview').style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

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