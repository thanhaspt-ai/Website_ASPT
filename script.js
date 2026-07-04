// Language Switcher Logic
window.changeLanguage = function(lang) {
    if (typeof translations !== 'undefined' && translations[lang]) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });
        localStorage.setItem('aspt_lang', lang);
        
        // Cập nhật trạng thái nút bấm
        document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.querySelector(`.lang-btn[onclick="changeLanguage('${lang}')"]`);
        if (activeBtn) activeBtn.classList.add('active');
        
        if (typeof window.reRenderPortfolio === 'function') {
            window.reRenderPortfolio();
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Initialize language
    const savedLang = localStorage.getItem('aspt_lang') || 'vi';
    changeLanguage(savedLang);

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                window.scrollTo({
                    top: targetElement.offsetTop - navHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Counter Animation for stats
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the slower

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    // Use Intersection Observer to trigger counter animation when in view
    const observerOptions = {
        threshold: 0.5
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
    
    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        }
    });

    // Hero Background Slider
    const slides = document.querySelectorAll('.hero-slider .slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        let slideInterval;
        let isPlaying = true;

        const nextSlide = () => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        };

        slideInterval = setInterval(nextSlide, 4000); // Đổi ảnh mỗi 4 giây

        const heroSection = document.querySelector('.hero');
        
        // Thêm biểu tượng trạng thái Pause/Play
        const statusIndicator = document.createElement('div');
        statusIndicator.style.cssText = 'position: absolute; bottom: 30px; left: 30px; color: rgba(255,255,255,0.6); z-index: 10; font-size: 1rem; pointer-events: none; transition: opacity 0.5s; background: rgba(0,0,0,0.3); padding: 5px 15px; border-radius: 20px;';
        statusIndicator.innerHTML = '<i class="fas fa-play"></i> Auto-playing';
        heroSection.appendChild(statusIndicator);
        setTimeout(() => statusIndicator.style.opacity = '0', 3000);

        heroSection.addEventListener('click', (e) => {
            // Không can thiệp nếu người dùng click vào nút bấm hoặc link
            if(e.target.closest('a') || e.target.closest('button')) return;
            
            if (isPlaying) {
                clearInterval(slideInterval);
                statusIndicator.innerHTML = '<i class="fas fa-pause"></i> Paused (Click to resume)';
                statusIndicator.style.opacity = '1';
            } else {
                nextSlide();
                slideInterval = setInterval(nextSlide, 4000);
                statusIndicator.innerHTML = '<i class="fas fa-play"></i> Auto-playing';
                statusIndicator.style.opacity = '1';
                setTimeout(() => statusIndicator.style.opacity = '0', 2000);
            }
            isPlaying = !isPlaying;
        });

        // Hiệu ứng 3D Parallax khi di chuyển chuột trên màn hình Hero
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroSection.addEventListener('mousemove', (e) => {
                const rect = heroSection.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Tính toán góc xoay rất nhẹ (tối đa 3 độ) và di chuyển rất nhẹ (tối đa 5px)
                const rotateX = -(y / rect.height) * 3;
                const rotateY = (x / rect.width) * 3;
                const translateX = (x / rect.width) * 5;
                const translateY = (y / rect.height) * 5;
                
                heroContent.style.transform = `translate3d(${translateX}px, ${translateY}px, 10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                heroContent.style.transition = 'transform 0.1s ease-out';
            });
            
            heroSection.addEventListener('mouseleave', () => {
                // Trả về vị trí cân bằng mượt mà khi chuột rời đi
                heroContent.style.transform = 'translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg)';
                heroContent.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
            });
        }
    }
    // Dynamic Portfolio 3-Level Rendering
    const portfolioGrid = document.getElementById('dynamic-portfolio');
    const navBarProj = document.getElementById('project-navigation');
    const contactForm = document.getElementById('contact-form');
    
    // Mobile menu toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinksMobile = document.getElementById('nav-links');
    if (mobileMenu && navLinksMobile) {
        mobileMenu.addEventListener('click', () => {
            navLinksMobile.classList.toggle('active');
        });
        
        // Close menu when a link is clicked
        navLinksMobile.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinksMobile.classList.remove('active');
            });
        });
    }
    const btnBackProj = document.getElementById('btn-back-projects');
    const currentGroupTitle = document.getElementById('current-group-title');
    
    let currentView = 'groups'; // 'groups', 'projects', 'detail'
    let activeGroupId = null;
    let activeProject = null;

    const getLangText = (obj) => {
        const lang = localStorage.getItem('aspt_lang') || 'vi';
        if (typeof obj === 'string') return obj;
        return obj[lang] || obj['vi'] || '';
    };

    const renderGroups = () => {
        currentView = 'groups';
        if (navBarProj) navBarProj.style.display = 'none';
        if (portfolioGrid) {
            portfolioGrid.className = 'portfolio-grid groups-grid'; // Use grid for groups
            portfolioGrid.innerHTML = '';
        }
        
        if (typeof projectsData === 'undefined' || projectsData.length === 0) {
            if (portfolioGrid) portfolioGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #888;">Admin chưa cập nhật dự án nào.</p>';
            return;
        }

        projectsData.forEach(group => {
            const item = document.createElement('div');
            item.className = 'portfolio-item group-item';
            
            let coverImg = 'https://via.placeholder.com/800x800?text=No+Projects';
            if (group.cover) {
                coverImg = group.cover;
            } else if (group.projects.length > 0 && group.projects[0].cover) {
                coverImg = group.projects[0].cover;
            }
            
            item.innerHTML = `
                <img src="${coverImg}" alt="${getLangText(group.title)}" style="aspect-ratio: 3/4; object-fit: cover;">
                <div class="portfolio-info">
                    <h3>${getLangText(group.title)}</h3>
                    <p>${group.projects.length} dự án</p>
                </div>
            `;
            item.style.cursor = 'pointer';
            item.onclick = () => renderProjects(group.id);
            if (portfolioGrid) portfolioGrid.appendChild(item);
        });
    };

    const renderProjects = (groupId) => {
        currentView = 'projects';
        activeGroupId = groupId;
        const group = projectsData.find(g => g.id === groupId);
        
        if (navBarProj) navBarProj.style.display = 'block';
        if (currentGroupTitle) currentGroupTitle.innerText = getLangText(group.title);
        if (portfolioGrid) {
            portfolioGrid.className = 'portfolio-grid';
            portfolioGrid.innerHTML = '';
        }

        if (!group.projects || group.projects.length === 0) {
            if (portfolioGrid) portfolioGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #888;">Nhóm này chưa có dự án nào.</p>';
            return;
        }

        group.projects.forEach(project => {
            const item = document.createElement('div');
            item.className = 'portfolio-item project-item';
            item.innerHTML = `
                <img src="${project.cover}" alt="${getLangText(project.title)}" style="aspect-ratio: 1/1; object-fit: contain; background: #f9f9f9;">
                <div class="portfolio-info">
                    <h3>${getLangText(project.title)}</h3>
                </div>
            `;
            item.style.cursor = 'pointer';
            item.onclick = () => renderProjectDetail(project, group);
            if (portfolioGrid) portfolioGrid.appendChild(item);
        });
        
        // Cuộn màn hình xuống khu vực danh sách dự án
        if (portfolioGrid) {
            const navHeight = document.querySelector('.navbar') ? document.querySelector('.navbar').offsetHeight : 0;
            const topPos = portfolioGrid.getBoundingClientRect().top + window.scrollY - navHeight - 20;
            window.scrollTo({
                top: topPos,
                behavior: 'smooth'
            });
        }
    };

     const renderProjectDetail = (project, group) => {
        currentView = 'detail';
        activeProject = project;
        if (navBarProj) navBarProj.style.display = 'block';
        if (currentGroupTitle) currentGroupTitle.innerText = `${getLangText(group.title)} / ${getLangText(project.title)}`;
        if (portfolioGrid) {
            portfolioGrid.className = 'project-detail-container';
            portfolioGrid.innerHTML = '';
        }

        const images = project.images || [];
        let activeIndex = 0;

        // Tạo hàm chuyển đổi ảnh toàn cục
        window.changeProjectMainImage = (index) => {
            if (images.length === 0) return;
            if (index < 0) index = images.length - 1;
            if (index >= images.length) index = 0;
            activeIndex = index;

            const mainImg = document.getElementById('project-main-image');
            if (mainImg) {
                mainImg.src = images[activeIndex];
            }

            // Cập nhật trạng thái thumbnails
            const thumbs = document.querySelectorAll('.project-thumbnail');
            thumbs.forEach((thumb, idx) => {
                if (idx === activeIndex) {
                    thumb.classList.add('active');
                    thumb.style.borderColor = 'var(--primary-color)';
                    thumb.style.opacity = '1';
                } else {
                    thumb.classList.remove('active');
                    thumb.style.borderColor = '#eee';
                    thumb.style.opacity = '0.6';
                }
            });
        };

        let mainImageHtml = '';
        let thumbnailsHtml = '';

        if (images.length > 0) {
            mainImageHtml = `
                <div class="project-gallery-viewport" style="position: relative; width: 100%; max-width: 800px; height: 500px; background: #f8f9fa; border-radius: 12px; display: flex; align-items: center; justify-content: center; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.08); margin: 0 auto;">
                    <img id="project-main-image" src="${images[0]}" style="max-width: 100%; max-height: 100%; object-fit: contain; transition: all 0.3s ease;">
                    
                    ${images.length > 1 ? `
                        <button class="gallery-nav-btn prev-btn" onclick="window.changeProjectMainImage(window.currentProjectActiveIndex() - 1)" style="left: 15px;"><i class="fas fa-chevron-left"></i></button>
                        <button class="gallery-nav-btn next-btn" onclick="window.changeProjectMainImage(window.currentProjectActiveIndex() + 1)" style="right: 15px;"><i class="fas fa-chevron-right"></i></button>
                    ` : ''}
                </div>
            `;

            window.currentProjectActiveIndex = () => activeIndex;

            if (images.length > 1) {
                thumbnailsHtml = `
                    <div class="project-thumbnails-list" style="display: flex; gap: 10px; justify-content: center; align-items: center; margin-top: 15px; overflow-x: auto; padding: 5px 0; width: 100%;">
                        ${images.map((img, idx) => `
                            <img src="${img}" class="project-thumbnail ${idx === 0 ? 'active' : ''}" onclick="window.changeProjectMainImage(${idx})" style="width: 80px; height: 60px; object-fit: cover; border-radius: 6px; cursor: pointer; border: 2px solid ${idx === 0 ? 'var(--primary-color)' : '#eee'}; opacity: ${idx === 0 ? '1' : '0.6'}; transition: all 0.2s ease;">
                        `).join('')}
                    </div>
                `;
            }
        } else {
            mainImageHtml = `<img src="https://via.placeholder.com/800x800?text=No+Image" style="max-width: 100%; border-radius: 12px;">`;
        }

        const descriptionText = getLangText(project.description);

        if (portfolioGrid) {
            portfolioGrid.innerHTML = `
                <div class="project-gallery-section" style="margin-bottom: 25px; display: flex; flex-direction: column; align-items: center;">
                    ${mainImageHtml}
                    ${thumbnailsHtml}
                </div>
                <div class="project-text-info" style="margin-bottom: 30px; padding: 25px; background: #fff; border-radius: 12px; box-shadow: 0 5px 25px rgba(0,0,0,0.05); max-width: 800px; margin: 0 auto 30px auto;">
                      <h2 style="color: var(--primary-color); margin-bottom: 15px; font-size: 1.6rem; font-weight: 700;">${getLangText(project.title)}</h2>
                      <p style="font-size: 1.05rem; line-height: 1.8; color: #4a5568; text-align: justify; white-space: pre-line;">${descriptionText}</p>
                </div>
            `;

            // Hỗ trợ phím mũi tên để chuyển ảnh
            const handleKeyDown = (e) => {
                if (currentView !== 'detail') {
                    document.removeEventListener('keydown', handleKeyDown);
                    return;
                }
                if (e.key === 'ArrowLeft') {
                    window.changeProjectMainImage(window.currentProjectActiveIndex() - 1);
                } else if (e.key === 'ArrowRight') {
                    window.changeProjectMainImage(window.currentProjectActiveIndex() + 1);
                }
            };
            document.addEventListener('keydown', handleKeyDown);

            const navHeight = document.querySelector('.navbar') ? document.querySelector('.navbar').offsetHeight : 0;
            const topPos = portfolioGrid.getBoundingClientRect().top + window.scrollY - navHeight - 20;
            window.scrollTo({
                top: topPos,
                behavior: 'smooth'
            });
        }
    };

    if (btnBackProj) {
        btnBackProj.addEventListener('click', () => {
            if (currentView === 'detail') {
                renderProjects(activeGroupId);
            } else if (currentView === 'projects') {
                renderGroups();
            }
            
            // Cuộn về đầu section dự án khi bấm quay lại
            const section = document.getElementById('du-an');
            if (section) {
                const navHeight = document.querySelector('.navbar') ? document.querySelector('.navbar').offsetHeight : 0;
                const topPos = section.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({
                    top: topPos,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Export function to be called from Navbar
    window.resetAndScrollToProjects = () => {
        renderGroups();
        const section = document.getElementById('du-an');
        if (section) {
            const navHeight = document.querySelector('.navbar') ? document.querySelector('.navbar').offsetHeight : 0;
            const topPos = section.getBoundingClientRect().top + window.scrollY - navHeight;
            window.scrollTo({
                top: topPos,
                behavior: 'smooth'
            });
        }
    };

    // Export render functions for re-render on language change
    window.reRenderPortfolio = () => {
        if (currentView === 'groups') {
            renderGroups();
        } else if (currentView === 'projects') {
            renderProjects(activeGroupId);
        } else if (currentView === 'detail') {
            const group = projectsData.find(g => g.id === activeGroupId);
            if (group) renderProjectDetail(activeProject, group);
        }
    };

    // Init
    if (portfolioGrid && typeof projectsData !== 'undefined') {
        renderGroups();
    }

    // --- MODAL & CHAT INTERACTION LOGIC ---
    
    // Mở và đóng modal nói chung
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Khóa cuộn trang chính
        }
    };

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Mở lại cuộn trang chính
            // Dừng video nếu có trong solutions modal
            if (modalId === 'modal-solutions') {
                const mediaContainer = document.getElementById('playlist-media-container');
                if (mediaContainer) mediaContainer.innerHTML = '';
            }
        }
    };

    // Đóng modal khi click ra ngoài vùng content
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('custom-modal')) {
            closeModal(e.target.id);
        }
    });

    // Chuyển Tab trong About Modal
    window.switchAboutTab = function(event, tabId) {
        const modal = document.getElementById('modal-about');
        if (!modal) return;
        
        modal.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        modal.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        event.currentTarget.classList.add('active');
        const activeContent = document.getElementById(tabId);
        if (activeContent) activeContent.classList.add('active');
    };

    // Giải pháp Chuyên ngành - Playlist Logic
    window.openSolutionDetail = function(groupId) {
        if (typeof solutionsData === 'undefined') return;
        const group = solutionsData.find(g => g.id === groupId);
        if (!group) return;

        // Cập nhật tiêu đề modal có tiếp đầu ngữ tương ứng từng ngôn ngữ
        const modalTitle = document.getElementById('solutions-modal-title');
        let cardTitle = "";
        const cardTitleEl = document.querySelector(`[data-i18n="sol-${groupId}-t"]`);
        if (cardTitleEl) {
            cardTitle = cardTitleEl.innerText;
        } else {
            if (groupId === '1') cardTitle = "Chủ đầu tư Dự án Lớn";
            else if (groupId === '2') cardTitle = "Chủ đầu tư Dự án Vừa & Nhỏ";
            else if (groupId === '3') cardTitle = "Đối Tác Thiết Kế (B2B)";
            else if (groupId === '4') cardTitle = "Quy hoạch & Hạ tầng kỹ thuật";
        }

        const activeLang = localStorage.getItem('aspt_lang') || 'vi';
        let fullTitle = cardTitle;
        if (activeLang === 'vi') {
            fullTitle = "Giải pháp cho " + cardTitle;
        } else if (activeLang === 'en') {
            fullTitle = "Solutions for " + cardTitle;
        } else if (activeLang === 'ja') {
            fullTitle = cardTitle + "向けソリューション";
        } else if (activeLang === 'zh') {
            fullTitle = cardTitle + "的解决方案";
        }
        
        if (modalTitle) modalTitle.innerText = fullTitle;

        // Hiển thị list view và ẩn detail view
        const listView = document.getElementById('solutions-list-view');
        const detailView = document.getElementById('solutions-detail-view');
        if (listView) listView.style.display = 'block';
        if (detailView) detailView.style.display = 'none';

        const itemsGrid = document.getElementById('solutions-items-grid');
        if (itemsGrid) {
            itemsGrid.innerHTML = '';
            
            if (group.items.length === 0) {
                itemsGrid.innerHTML = '<p style="color:#888; font-size:13px; text-align:center; padding:20px; grid-column: 1/-1;">Chưa có bài viết nào.</p>';
            } else {
                group.items.forEach((item) => {
                    const itemCard = document.createElement('div');
                    itemCard.className = 'solution-item-row';
                    itemCard.style = 'display: flex; gap: 20px; padding: 15px 0; border-bottom: 1px solid #eee; cursor: pointer; transition: background-color 0.2s; align-items: flex-start;';
                    itemCard.onmouseenter = () => {
                        itemCard.style.backgroundColor = '#f8f9fa';
                    };
                    itemCard.onmouseleave = () => {
                        itemCard.style.backgroundColor = 'transparent';
                    };
                    
                    // Tự động phân loại tài liệu với biểu tượng chính xác
                    let typeIcon = 'fa-file-alt';
                    let typeColor = '#666';
                    let typeText = 'Tài liệu';
                    
                    if (item.video_url) {
                        typeIcon = 'fa-video';
                        typeColor = '#e50914';
                        typeText = getLangText({vi: 'Video', en: 'Video', ja: 'ビデオ', zh: '视频'});
                    } else if (item.media_type === 'letter') {
                        typeIcon = 'fa-envelope-open-text';
                        typeColor = '#28a745';
                        typeText = getLangText({vi: 'Thư ngỏ', en: 'Letter', ja: '紹介状', zh: '介绍信'});
                    } else if (item.media_type === 'pdf') {
                        typeIcon = 'fa-file-pdf';
                        typeColor = '#ff0000';
                        typeText = 'PDF';
                    } else if (item.media_type === 'doc' || (item.file && (item.file.endsWith('.doc') || item.file.endsWith('.docx')))) {
                        typeIcon = 'fa-file-word';
                        typeColor = '#2b579a';
                        typeText = 'Word';
                    } else if (item.images && item.images.length > 0) {
                        typeIcon = 'fa-images';
                        typeColor = '#007bff';
                        typeText = getLangText({vi: 'Album ảnh', en: 'Photo Album', ja: 'アルバム', zh: '相册'});
                    }

                    itemCard.onclick = () => {
                        if (listView) listView.style.display = 'none';
                        if (detailView) detailView.style.display = 'block';
                        selectSolutionPlaylistItem(item);
                    };

                    let thumbHtml = '';
                    if (item.media_type === 'pdf' || item.media_type === 'doc' || (item.file && (item.file.endsWith('.doc') || item.file.endsWith('.docx')))) {
                        thumbHtml = `
                            <div class="solution-thumb" style="width: 180px; aspect-ratio: 16/9; background: #f8f9fa; border: 1px solid #ddd; border-radius: 6px; overflow: hidden; position: relative; flex-shrink: 0; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
                                <i class="fas ${typeIcon} fa-3x" style="color: ${typeColor};"></i>
                                <span style="position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.8); color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; display: flex; align-items: center; gap: 4px;">
                                    ${typeText}
                                </span>
                            </div>
                        `;
                    } else {
                        thumbHtml = `
                            <div class="solution-thumb" style="width: 180px; aspect-ratio: 16/9; background: #ffffff; border: 1px solid #ddd; border-radius: 6px; overflow: hidden; position: relative; flex-shrink: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
                                <img src="${item.cover}" style="width:100%; height:100%; object-fit:contain;">
                                <span style="position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.8); color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; display: flex; align-items: center; gap: 4px;">
                                    <i class="fas ${typeIcon}" style="color: ${typeColor};"></i> ${typeText}
                                </span>
                            </div>
                        `;
                    }

                    itemCard.innerHTML = `
                        ${thumbHtml}
                        <div class="solution-info" style="flex: 1; display: flex; flex-direction: column;">
                            <h4 style="margin: 0 0 6px; font-size: 16px; font-weight: bold; color: var(--text-color); line-height: 1.4;">${getLangText(item.title)}</h4>
                            <span style="font-size: 13px; color: #777; margin-bottom: 5px;">ASPT ENGINEERING &bull; Chuyên đề kỹ thuật</span>
                            <span style="font-size: 12px; color: #999;">Đăng ngày: ${item.date}</span>
                            <p style="font-size: 13px; color: #555; margin-top: 8px; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;">${getLangText(item.description)}</p>
                        </div>
                    `;
                    itemsGrid.appendChild(itemCard);
                });
            }
        }

        const btnBackToList = document.getElementById('btn-back-to-solutions-list');
        if (btnBackToList) {
            btnBackToList.onclick = () => {
                if (listView) listView.style.display = 'block';
                if (detailView) detailView.style.display = 'none';
                const mediaContainer = document.getElementById('playlist-media-container');
                if (mediaContainer) mediaContainer.innerHTML = '';
            };
        }

        openModal('modal-solutions');
    };

    window.selectSolutionPlaylistItem = function(item) {
        const activeTitle = document.getElementById('playlist-active-title');
        const activeDate = document.getElementById('playlist-active-date');
        const activeDesc = document.getElementById('playlist-active-description');
        const mediaContainer = document.getElementById('playlist-media-container');
        const galleryContainer = document.getElementById('playlist-active-gallery');

        if (activeTitle) activeTitle.innerText = getLangText(item.title);
        if (activeDate) activeDate.innerText = item.date;
        if (activeDesc) activeDesc.innerText = getLangText(item.description);

        window.currentSolutionAlbumImages = item.images || [];
        window.currentSolutionAlbumIndex = 0;

        if (mediaContainer) {
            // Khôi phục lại style mặc định của playlist-media
            mediaContainer.removeAttribute('style');
            mediaContainer.className = 'playlist-media';
        }

        window.updateSolutionMainImage = function(index) {
            if (!window.currentSolutionAlbumImages || window.currentSolutionAlbumImages.length === 0) return;
            
            const total = window.currentSolutionAlbumImages.length;
            index = (index % total + total) % total; // tuần hoàn index
            
            window.currentSolutionAlbumIndex = index;
            const imgUrl = window.currentSolutionAlbumImages[index];
            if (mediaContainer) {
                let arrowsHtml = '';
                if (total > 1) {
                    arrowsHtml = `
                        <button class="gallery-nav-btn prev-btn" onclick="event.stopPropagation(); window.updateSolutionMainImage(window.currentSolutionAlbumIndex - 1)"><i class="fas fa-chevron-left"></i></button>
                        <button class="gallery-nav-btn next-btn" onclick="event.stopPropagation(); window.updateSolutionMainImage(window.currentSolutionAlbumIndex + 1)"><i class="fas fa-chevron-right"></i></button>
                    `;
                }
                mediaContainer.innerHTML = `
                    <img src="${imgUrl}" style="width:100%; height:100%; object-fit:contain; border-radius: 8px; background-color: #ffffff;">
                    ${arrowsHtml}
                `;
            }
            
            // Highlight thumbnail
            if (galleryContainer) {
                const thumbs = galleryContainer.querySelectorAll('img');
                thumbs.forEach((thumb, idx) => {
                    if (idx === index) {
                        thumb.style.outline = '3px solid var(--primary-color)';
                        thumb.style.outlineOffset = '2px';
                        thumb.style.opacity = '1';
                    } else {
                        thumb.style.outline = 'none';
                        thumb.style.opacity = '0.6';
                    }
                });
            }
        };

        // Load media (YouTube video or PDF or Letter or images)
        if (mediaContainer) {
            mediaContainer.innerHTML = '';
            
            // 0. Nhúng Thư ngỏ (đơn giản, tĩnh, định dạng trang trọng)
            if (item.media_type === 'letter') {
                // Tùy chỉnh CSS của mediaContainer để hiển thị như trang giấy A4 tĩnh
                mediaContainer.style.aspectRatio = 'auto';
                mediaContainer.style.height = 'auto';
                mediaContainer.style.background = 'transparent';
                mediaContainer.style.boxShadow = 'none';
                mediaContainer.style.overflow = 'visible';

                const letterContent = getLangText(item.letter_content) || '';
                const lines = letterContent.split('\n');
                let formattedHtml = '';
                lines.forEach(line => {
                    const trimmed = line.strip ? line.strip() : line.trim();
                    if (!trimmed) {
                        formattedHtml += '<div style="height: 14px;"></div>';
                    } else if (trimmed.startsWith('-') || trimmed.startsWith('+') || trimmed.startsWith('*') || /^\d+\./.test(trimmed) || trimmed.startsWith('•')) {
                        // Xoá ký tự đầu dòng thô để thay bằng icon chuyên nghiệp
                        let cleanText = trimmed;
                        if (trimmed.startsWith('-') || trimmed.startsWith('+') || trimmed.startsWith('*') || trimmed.startsWith('•')) {
                            cleanText = trimmed.substring(1).trim();
                        }
                        formattedHtml += `<p style="margin: 10px 0; padding-left: 60px; text-indent: -20px; line-height: 1.8; font-size: 15.5px; color: #2d3748; text-align: justify;"><i class="fas fa-chevron-right" style="color: var(--primary-color); font-size: 11px; margin-right: 9px;"></i>${cleanText}</p>`;
                    } else {
                        formattedHtml += `<p style="margin: 12px 0; text-indent: 2em; line-height: 1.8; font-size: 16px; color: #2d3748; text-align: justify;">${trimmed}</p>`;
                    }
                });

                mediaContainer.innerHTML = `
                    <div class="letter-paper" style="background: #ffffff; padding: 50px 60px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.06); font-family: 'Outfit', 'Inter', sans-serif; color: #2d3748; max-width: 800px; margin: 0 auto; position: relative;">
                        <!-- Logo Watermark or Small Header -->
                        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--primary-color); padding-bottom: 15px; margin-bottom: 30px;">
                            <div>
                                <h4 style="margin: 0; color: var(--primary-color); font-size: 18px; font-weight: 800; letter-spacing: 1.5px;">A.S.P.T Co., Ltd</h4>
                                <span style="font-size: 10px; color: #718096; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">Class 1 Construction Design & Consulting</span>
                            </div>
                            <div style="text-align: right;">
                                <span style="font-size: 12px; color: #4a5568; font-weight: 600;">Hotline: 098.214.5011</span>
                                <br>
                                <a href="http://www.aspt.vn" target="_blank" style="font-size: 12px; color: var(--primary-color); text-decoration: none; font-weight: 600;">www.aspt.vn</a>
                            </div>
                        </div>
                        
                        <!-- Letter Body -->
                        <div class="letter-body" style="font-size: 16px; color: #2d3748;">
                            ${formattedHtml}
                        </div>
                        
                        <!-- Signature Section -->
                        <div style="margin-top: 50px; display: flex; justify-content: flex-end;">
                            <div style="text-align: center; width: 240px;">
                                <p style="margin: 0; font-size: 12px; color: #718096; font-style: italic;">Đà Nẵng, Việt Nam</p>
                                <h5 style="margin: 8px 0 0; font-size: 14px; color: var(--primary-color); font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Ban Giám đốc ASPT</h5>
                                <div style="height: 65px;"></div> <!-- Sign space -->
                                <p style="margin: 0; font-size: 15px; font-weight: 700; color: #2d3748;">Lê Viết Thành (CEO)</p>
                            </div>
                        </div>
                    </div>
                `;
                
            // 1. Nhúng Video
            } else if (item.video_url) {
                let embedUrl = item.video_url;
                if (embedUrl.includes('youtube.com/watch?v=')) {
                    const videoId = embedUrl.split('v=')[1].split('&')[0];
                    embedUrl = `https://www.youtube.com/embed/${videoId}`;
                } else if (embedUrl.includes('youtu.be/')) {
                    const videoId = embedUrl.split('youtu.be/')[1].split('?')[0];
                    embedUrl = `https://www.youtube.com/embed/${videoId}`;
                }
                mediaContainer.innerHTML = `<iframe src="${embedUrl}" allowfullscreen></iframe>`;
                
            // 2. Nhúng PDF (Xem trực tiếp)
            } else if (item.media_type === 'pdf' || item.media_type === 'pdf_download') {
                let fileUrl = item.file;
                if (fileUrl && fileUrl !== '#') {
                    if (fileUrl.includes('drive.google.com')) {
                        if (fileUrl.includes('/view')) {
                            fileUrl = fileUrl.replace('/view', '/preview');
                        } else if (!fileUrl.includes('/preview')) {
                            const fileIdMatch = fileUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
                            if (fileIdMatch && fileIdMatch[1]) {
                                fileUrl = `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
                            }
                        }
                    }
                    mediaContainer.innerHTML = `<iframe src="${fileUrl}" style="width: 100%; height: 100%; border: none; border-radius: 8px; background-color: #f8f9fa;" allow="autoplay"></iframe>`;
                } else {
                    mediaContainer.innerHTML = `<div style="background: #f8f9fa; border: 1px solid #ddd; border-radius: 8px; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column; padding: 20px;">
                        <i class="fas fa-exclamation-triangle fa-4x" style="color: #ffc107; margin-bottom: 15px;"></i>
                        <p style="font-weight: bold; text-align: center; color: #666;">Không tìm thấy tệp tài liệu.</p>
                    </div>`;
                }
                
            // 3. Hiển thị Album ảnh
            } else {
                if (window.currentSolutionAlbumImages.length > 0) {
                    setTimeout(() => window.updateSolutionMainImage(0), 50);
                } else {
                    mediaContainer.innerHTML = `<img src="${item.cover}" alt="${getLangText(item.title)}">`;
                }
            }
        }

        // Load gallery images
        if (galleryContainer) {
            galleryContainer.innerHTML = '';
            if (item.media_type === 'letter') {
                galleryContainer.style.display = 'none';
            } else {
                galleryContainer.style.display = 'flex';
                if (window.currentSolutionAlbumImages.length > 0) {
                    window.currentSolutionAlbumImages.forEach((img, idx) => {
                        const imgEl = document.createElement('img');
                        imgEl.src = img;
                        imgEl.style.width = '100px';
                        imgEl.style.height = '75px';
                        imgEl.style.objectFit = 'cover';
                        imgEl.style.borderRadius = '4px';
                        imgEl.style.cursor = 'pointer';
                        imgEl.style.transition = 'all 0.2s';
                        imgEl.style.opacity = '0.6';
                        imgEl.onclick = () => {
                            window.updateSolutionMainImage(idx);
                        };
                        galleryContainer.appendChild(imgEl);
                    });
                }
            }
        }
    };

    // --- AI CHATBOT WIDGET LOGIC ---
    const btnChatAi = document.getElementById('btn-chat-ai');
    const chatWidget = document.getElementById('ai-chat-widget');
    const btnCloseChat = document.getElementById('btn-close-chat');
    const btnSendChat = document.getElementById('btn-send-chat');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    if (btnChatAi && chatWidget) {
        btnChatAi.addEventListener('click', () => {
            chatWidget.classList.add('active');
        });
    }

    if (btnCloseChat && chatWidget) {
        btnCloseChat.addEventListener('click', () => {
            chatWidget.classList.remove('active');
        });
    }

    // Nút "Xem thêm về chúng tôi" dưới phần Giới thiệu
    const btnMoreAbout = document.getElementById('btn-more-about');
    if (btnMoreAbout) {
        btnMoreAbout.addEventListener('click', () => {
            renderAboutModal();
            openModal('modal-about');
        });
    }

    // --- DỮ LIỆU ABOUT: PHÁP LÝ & VĂN HÓA DOANH NGHIỆP ---
    // --- DỮ LIỆU ABOUT MẶC ĐỊNH (FALLBACK NẾU THƯ MỤC TRỐNG) ---
    const defaultAboutLegalData = [
        {
            id: "legal-1",
            title: { vi: "Chứng chỉ Năng lực Hạng 1 (Thiết kế & Thẩm tra Dân dụng)", en: "Class 1 Design Certificate (Civil)" },
            desc: { vi: "Số BXD-00000650 do Bộ Xây dựng cấp.", en: "No. BXD-00000650 issued by Ministry of Construction." },
            type: "PDF",
            media_type: "pdf",
            file: "assets/legal/scan-cert1.jpg"
        },
        {
            id: "legal-2",
            title: { vi: "Chứng chỉ Năng lực Hạng 2 (Thiết kế & Thẩm tra Nhà Công nghiệp)", en: "Class 2 Design Certificate (Industrial)" },
            desc: { vi: "Số DNA-00000650 do Sở Xây dựng cấp.", en: "No. DNA-00000650 issued by Department of Construction." },
            type: "PDF",
            media_type: "pdf",
            file: "assets/legal/scan-cert2.jpg"
        },
        {
            id: "legal-3",
            title: { vi: "Chứng chỉ Năng lực Hạng 3 (Quy hoạch xây dựng)", en: "Class 3 Planning Certificate" },
            desc: { vi: "Số HCM-00000650 do Sở Xây dựng cấp.", en: "No. HCM-00000650 issued by Department of Construction." },
            type: "PDF",
            media_type: "pdf",
            file: "assets/legal/scan-cert3.jpg"
        },
        {
            id: "legal-4",
            title: { vi: "Chứng nhận Hệ thống Quản lý Chất lượng ISO 9001:2015", en: "ISO 9001:2015 Quality Management System" },
            desc: { vi: "Hệ thống quản lý chất lượng đạt chuẩn quốc tế.", en: "Quality management system meets international standards." },
            type: "PDF",
            media_type: "pdf",
            file: "assets/legal/scan-iso.jpg"
        },
        {
            id: "legal-5",
            title: { vi: "Bản quyền phần mềm ETABS Ultimate v23", en: "ETABS Ultimate v23 Software License" },
            desc: { vi: "Phần mềm tính toán kết cấu cao tầng bản quyền.", en: "High-rise structural analysis software license." },
            type: "License",
            media_type: "license",
            file: "assets/legal/license-etabs.jpg"
        },
        {
            id: "legal-6",
            title: { vi: "Bản quyền phần mềm Adapt Builder 2020", en: "Adapt Builder 2020 Software License" },
            desc: { vi: "Phần mềm tính sàn phẳng ứng lực trước bản quyền.", en: "Post-tensioned slab analysis software license." },
            type: "License",
            media_type: "license",
            file: "assets/legal/license-adapt.jpg"
        },
        {
            id: "legal-7",
            title: { vi: "Bản quyền Autodesk AEC (Revit, AutoCAD...)", en: "Autodesk AEC Software License Suite" },
            desc: { vi: "Phục vụ triển khai mô hình BIM (LOD 300 - 400).", en: "Serves BIM modeling implementation (LOD 300 - 400)." },
            type: "License",
            media_type: "license",
            file: "assets/legal/license-autodesk.jpg"
        },
        {
            id: "legal-8",
            title: { vi: "Hồ sơ năng lực Công ty A.S.P.T (Tiếng Việt)", en: "ASPT Company Capacity Profile (Vietnamese)" },
            desc: { vi: "Tải về bản PDF đầy đủ thông tin dự án.", en: "Download full project details PDF." },
            type: "PDF",
            media_type: "pdf_download",
            file: "#"
        },
        {
            id: "legal-9",
            title: { vi: "Company Profile A.S.P.T (English Version)", en: "ASPT Company Profile (English Version)" },
            desc: { vi: "Download full profile in English.", en: "Download full profile in English." },
            type: "PDF",
            media_type: "pdf_download",
            file: "#"
        }
    ];

    const defaultAboutCultureData = [
        {
            id: "cult-1",
            title: { vi: "Hội thảo ứng dụng BIM và kết cấu tối ưu", en: "BIM Application & Optimized Structure Seminar" },
            desc: { vi: "Buổi hội thảo nội bộ chia sẻ kinh nghiệm thiết kế Revit BIM.", en: "Internal seminar sharing Revit BIM design experience." },
            cover: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80",
            type: "Album ảnh",
            media_type: "album",
            images: [
                "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80"
            ]
        },
        {
            id: "cult-2",
            title: { vi: "Teambuilding hè & Hoạt động văn hóa thường niên", en: "Summer Teambuilding & Annual Cultural Activities" },
            desc: { vi: "Các hoạt động giao lưu, nâng cao tinh thần đồng đội.", en: "Interactions and team spirit building activities." },
            cover: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=400&q=80",
            type: "Album ảnh",
            media_type: "album",
            images: [
                "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80"
            ]
        }
    ];

    window.renderAboutModal = function() {
        const legalContainer = document.getElementById('about-legal-items');
        const cultureContainer = document.getElementById('about-culture-items');
        
        const listView = document.getElementById('about-list-view');
        const detailView = document.getElementById('about-detail-view');
        if (listView) listView.style.display = 'block';
        if (detailView) detailView.style.display = 'none';

        // Lấy dữ liệu động từ data.js, nếu trống sẽ fallback về dữ liệu mặc định
        const legalData = (typeof aboutLegalData !== 'undefined' && aboutLegalData.length > 0) ? aboutLegalData : defaultAboutLegalData;
        const cultureData = (typeof aboutCultureData !== 'undefined' && aboutCultureData.length > 0) ? aboutCultureData : defaultAboutCultureData;
        
        // Render Legal Tab
        if (legalContainer) {
            legalContainer.innerHTML = '';
            legalData.forEach(item => {
                const itemRow = document.createElement('div');
                itemRow.className = 'about-item-row';
                itemRow.style = 'display: flex; gap: 20px; padding: 15px 0; border-bottom: 1px solid #eee; cursor: pointer; transition: background-color 0.2s; align-items: flex-start;';
                itemRow.onmouseenter = () => { itemRow.style.backgroundColor = '#f8f9fa'; };
                itemRow.onmouseleave = () => { itemRow.style.backgroundColor = 'transparent'; };
                
                let typeIcon = 'fa-file-pdf';
                let typeColor = '#ff0000';
                let typeText = 'PDF';
                if (item.media_type === 'license') {
                    typeIcon = 'fa-key';
                    typeColor = '#ffc107';
                    typeText = 'License';
                }
                
                itemRow.onclick = () => {
                    if (listView) listView.style.display = 'none';
                    if (detailView) detailView.style.display = 'block';
                    selectAboutDetailItem(item);
                };
                
                itemRow.innerHTML = `
                    <div style="width: 120px; aspect-ratio: 16/9; background: #eee; border-radius: 6px; overflow: hidden; position: relative; flex-shrink: 0; display: flex; align-items: center; justify-content: center; border: 1px solid #ddd; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
                        <i class="fas ${typeIcon} fa-2x" style="color: ${typeColor};"></i>
                        <span style="position: absolute; bottom: 5px; right: 5px; background: rgba(0,0,0,0.8); color: white; padding: 1px 4px; border-radius: 3px; font-size: 8px; font-weight: bold;">${typeText}</span>
                    </div>
                    <div style="flex: 1;">
                        <h4 style="margin: 0 0 6px; font-size: 15px; font-weight: bold; color: var(--text-color);">${getLangText(item.title)}</h4>
                        <p style="font-size: 13px; color: #666; margin: 0;">${getLangText(item.desc)}</p>
                    </div>
                `;
                legalContainer.appendChild(itemRow);
            });
        }
        
        // Render Culture Tab
        if (cultureContainer) {
            cultureContainer.innerHTML = '';
            cultureData.forEach(item => {
                const itemRow = document.createElement('div');
                itemRow.className = 'about-item-row';
                itemRow.style = 'display: flex; gap: 20px; padding: 15px 0; border-bottom: 1px solid #eee; cursor: pointer; transition: background-color 0.2s; align-items: flex-start;';
                itemRow.onmouseenter = () => { itemRow.style.backgroundColor = '#f8f9fa'; };
                itemRow.onmouseleave = () => { itemRow.style.backgroundColor = 'transparent'; };
                
                itemRow.onclick = () => {
                    if (listView) listView.style.display = 'none';
                    if (detailView) detailView.style.display = 'block';
                    selectAboutDetailItem(item);
                };
                
                itemRow.innerHTML = `
                    <div style="width: 120px; aspect-ratio: 16/9; background: #ffffff; border: 1px solid #ddd; border-radius: 6px; overflow: hidden; position: relative; flex-shrink: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
                        <img src="${item.cover}" style="width:100%; height:100%; object-fit:contain;">
                        <span style="position: absolute; bottom: 5px; right: 5px; background: rgba(0,0,0,0.8); color: white; padding: 2px 4px; border-radius: 3px; font-size: 9px; font-weight: bold;"><i class="fas fa-images"></i> Album</span>
                    </div>
                    <div style="flex: 1;">
                        <h4 style="margin: 0 0 6px; font-size: 15px; font-weight: bold; color: var(--text-color);">${getLangText(item.title)}</h4>
                        <p style="font-size: 13px; color: #666; margin: 0;">${getLangText(item.desc)}</p>
                    </div>
                `;
                cultureContainer.appendChild(itemRow);
            });
        }
        
        // Back Button
        const btnBackAbout = document.getElementById('btn-back-to-about-list');
        if (btnBackAbout) {
            btnBackAbout.onclick = () => {
                if (listView) listView.style.display = 'block';
                if (detailView) detailView.style.display = 'none';
                const mediaContainer = document.getElementById('about-media-container');
                if (mediaContainer) mediaContainer.innerHTML = '';
            };
        }
    };

    window.selectAboutDetailItem = function(item) {
        const activeTitle = document.getElementById('about-active-title');
        const activeDesc = document.getElementById('about-active-description');
        const mediaContainer = document.getElementById('about-media-container');
        const galleryContainer = document.getElementById('about-active-gallery');
        
        if (activeTitle) activeTitle.innerText = getLangText(item.title);
        if (activeDesc) activeDesc.innerText = getLangText(item.desc || item.description || "");
        
        // Lưu trữ thông tin album phục vụ phím mũi tên chuyển ảnh
        window.currentAboutAlbumImages = item.images || [];
        window.currentAboutAlbumIndex = 0;

        window.updateAboutMainImage = function(index) {
            if (!window.currentAboutAlbumImages || window.currentAboutAlbumImages.length === 0) return;
            
            const total = window.currentAboutAlbumImages.length;
            index = (index % total + total) % total; // Đảm bảo chỉ số tuần hoàn hợp lệ
            
            window.currentAboutAlbumIndex = index;
            const imgUrl = window.currentAboutAlbumImages[index];
            if (mediaContainer) {
                let arrowsHtml = '';
                if (total > 1) {
                    arrowsHtml = `
                        <button class="gallery-nav-btn prev-btn" onclick="event.stopPropagation(); window.updateAboutMainImage(window.currentAboutAlbumIndex - 1)"><i class="fas fa-chevron-left"></i></button>
                        <button class="gallery-nav-btn next-btn" onclick="event.stopPropagation(); window.updateAboutMainImage(window.currentAboutAlbumIndex + 1)"><i class="fas fa-chevron-right"></i></button>
                    `;
                }
                mediaContainer.innerHTML = `
                    <img src="${imgUrl}" style="width:100%; height:100%; object-fit:contain; border-radius: 8px; background-color: #ffffff;">
                    ${arrowsHtml}
                `;
            }
            
            // Highlight thumbnail tương ứng
            if (galleryContainer) {
                const thumbs = galleryContainer.querySelectorAll('img');
                thumbs.forEach((thumb, idx) => {
                    if (idx === index) {
                        thumb.style.outline = '3px solid var(--primary-color)';
                        thumb.style.outlineOffset = '2px';
                        thumb.style.opacity = '1';
                    } else {
                        thumb.style.outline = 'none';
                        thumb.style.opacity = '0.6';
                    }
                });
            }
        };

        if (mediaContainer) {
            mediaContainer.innerHTML = '';
            
            // 1. Nếu là Video (Ưu tiên nhúng Video YouTube)
            if (item.video_url) {
                let embedUrl = item.video_url;
                if (embedUrl.includes('youtube.com/watch?v=')) {
                    const videoId = embedUrl.split('v=')[1].split('&')[0];
                    embedUrl = `https://www.youtube.com/embed/${videoId}`;
                } else if (embedUrl.includes('youtu.be/')) {
                    const videoId = embedUrl.split('youtu.be/')[1].split('?')[0];
                    embedUrl = `https://www.youtube.com/embed/${videoId}`;
                }
                mediaContainer.innerHTML = `<iframe src="${embedUrl}" style="width: 100%; height: 100%; border: none; border-radius: 8px;" allowfullscreen allow="autoplay"></iframe>`;
            
            // 2. Nếu là PDF hoặc License (Nhúng iframe trực tiếp)
            } else if (item.media_type === 'pdf' || item.media_type === 'license' || item.media_type === 'pdf_download') {
                let fileUrl = item.file;
                if (fileUrl && fileUrl !== '#') {
                    // Xử lý tự động link Google Drive thành định dạng nhúng preview
                    if (fileUrl.includes('drive.google.com')) {
                        if (fileUrl.includes('/view')) {
                            fileUrl = fileUrl.replace('/view', '/preview');
                        } else if (!fileUrl.includes('/preview')) {
                            // Cố gắng thay thế hoặc thêm /preview vào link drive chia sẻ
                            const fileIdMatch = fileUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
                            if (fileIdMatch && fileIdMatch[1]) {
                                fileUrl = `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
                            }
                        }
                    }
                    mediaContainer.innerHTML = `<iframe src="${fileUrl}" style="width: 100%; height: 100%; border: none; border-radius: 8px; background-color: #f8f9fa;" allow="autoplay"></iframe>`;
                } else {
                    mediaContainer.innerHTML = `<div style="background: #f8f9fa; border: 1px solid #ddd; border-radius: 8px; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column; padding: 20px;">
                        <i class="fas fa-exclamation-triangle fa-4x" style="color: #ffc107; margin-bottom: 15px;"></i>
                        <p style="font-weight: bold; text-align: center; color: #666;">Không tìm thấy tệp tài liệu để hiển thị.</p>
                    </div>`;
                }
            
            // 3. Nếu là Album ảnh
            } else {
                if (window.currentAboutAlbumImages.length > 0) {
                    // Dùng hàm update để hiển thị ảnh đầu tiên và highlight thumbnail đầu tiên
                    setTimeout(() => window.updateAboutMainImage(0), 50);
                } else {
                    mediaContainer.innerHTML = `<img src="${item.cover}" style="width:100%; height:100%; object-fit:cover; border-radius: 8px;">`;
                }
            }
        }
        
        if (galleryContainer) {
            galleryContainer.innerHTML = '';
            if (window.currentAboutAlbumImages.length > 0) {
                window.currentAboutAlbumImages.forEach((img, idx) => {
                    const imgEl = document.createElement('img');
                    imgEl.src = img;
                    imgEl.style.width = '100px';
                    imgEl.style.height = '75px';
                    imgEl.style.objectFit = 'cover';
                    imgEl.style.borderRadius = '4px';
                    imgEl.style.cursor = 'pointer';
                    imgEl.style.transition = 'all 0.2s';
                    imgEl.style.opacity = '0.6';
                    imgEl.onclick = () => {
                        window.updateAboutMainImage(idx);
                    };
                    galleryContainer.appendChild(imgEl);
                });
            }
        }
    };

    // Toggle hiển thị phần giới thiệu chi tiết (Google Search style: click để hiện và ẩn nút)
    const btnToggleAbout = document.getElementById('btn-toggle-about-text');
    const aboutExpandedArea = document.getElementById('about-expanded-area');
    const aboutToggleWrapper = document.getElementById('about-toggle-wrapper');
    if (btnToggleAbout && aboutExpandedArea) {
        btnToggleAbout.addEventListener('click', () => {
            aboutExpandedArea.style.display = 'block';
            if (aboutToggleWrapper) {
                aboutToggleWrapper.style.display = 'none'; // Ẩn hoàn toàn nút sau khi hiển thị nội dung
            }
        });
    }

    // Tự động thu gọn phần Giới thiệu khi cuộn khỏi tầm nhìn (IntersectionObserver)
    if ('IntersectionObserver' in window && btnToggleAbout && aboutExpandedArea && aboutToggleWrapper) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Khi phần giới thiệu hoàn toàn không còn nằm trong khung nhìn nữa
                if (!entry.isIntersecting && aboutExpandedArea.style.display === 'block') {
                    aboutExpandedArea.style.display = 'none';
                    aboutToggleWrapper.style.display = 'flex';
                }
            });
        }, {
            threshold: 0 // Kích hoạt ngay khi 100% phần tử ra ngoài màn hình
        });

        const aboutSection = document.getElementById('ve-chung-toi');
        if (aboutSection) {
            observer.observe(aboutSection);
        }
    }

    // Nút "Liên hệ tuyển dụng" ở Footer
    const btnRecruitment = document.getElementById('btn-recruitment');
    if (btnRecruitment) {
        btnRecruitment.addEventListener('click', () => {
            renderRecruitment();
            openModal('modal-recruitment');
        });
    }

    // Render thông tin tuyển dụng động
    window.renderRecruitment = function() {
        const jobListContainer = document.getElementById('recruitment-job-list');
        if (!jobListContainer) return;
        
        jobListContainer.innerHTML = '';
        if (typeof recruitmentData === 'undefined' || recruitmentData.length === 0) {
            jobListContainer.innerHTML = '<p style="color:#888; font-size:13px; text-align:center; padding:20px;">Hiện tại công ty chưa có đợt tuyển dụng mới. Xin vui lòng quay lại sau.</p>';
            return;
        }
        
        recruitmentData.forEach(job => {
            const jobCard = document.createElement('div');
            jobCard.className = 'job-card';
            jobCard.style = 'border: 1px solid #ddd; padding: 15px; border-radius: 8px;';
            jobCard.innerHTML = `
                <h4 style="color: var(--primary-color); margin-bottom: 5px;">${getLangText(job.title)}</h4>
                <p style="font-size: 13px; color: #666; margin-bottom: 10px; white-space: pre-line; line-height: 1.5;">${getLangText(job.requirement)}</p>
                <span style="background: #e8f0fe; color: var(--primary-color); padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">${getLangText(job.type)}</span>
            `;
            jobListContainer.appendChild(jobCard);
        });
    };

    // Gửi tin nhắn chatbot
    const sendUserMessage = () => {
        if (!chatInput || !chatMessages) return;
        const text = chatInput.value.strip ? chatInput.value.strip() : chatInput.value.trim();
        if (!text) return;

        // Tạo bubble tin nhắn của user
        const userBubble = document.createElement('div');
        userBubble.className = 'chat-bubble user-msg';
        userBubble.innerText = text;
        chatMessages.appendChild(userBubble);
        chatInput.value = '';

        // Tự động cuộn xuống cuối
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Hiển thị trạng thái "đang soạn tin..." giả lập trong lúc chờ
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'chat-bubble bot-msg';
        typingIndicator.style.opacity = '0.7';
        typingIndicator.innerHTML = `<i class="fas fa-ellipsis-h fa-spin"></i> ` + getLangText({
            vi: "Đang trả lời...",
            en: "Typing...",
            ja: "入力中...",
            zh: "正在输入..."
        });
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Trả lời giả lập của Bot sau 3 giây (đang bảo trì nâng cấp)
        setTimeout(() => {
            // Xóa chỉ báo đang soạn tin
            if (typingIndicator.parentNode) {
                typingIndicator.parentNode.removeChild(typingIndicator);
            }

            const botBubble = document.createElement('div');
            botBubble.className = 'chat-bubble bot-msg';
            
            botBubble.innerText = getLangText({
                vi: "Xin lỗi bạn, hôm nay AI-Agent của ASPT đang tạm dừng hoạt động để cập nhật lên phiên bản mới, bạn vui lòng liên hệ bằng điện thoại, hoặc Zalo, hoặc gửi mail tới công ty để chúng tôi hỗ trợ bạn.",
                en: "We apologize, ASPT's AI-Agent is temporarily offline today for updating to a new version. Please contact us via phone, Zalo, or email for assistance.",
                ja: "申し訳ありません。本日、ASPTのAIエージェントは新バージョンへのアップデートのため一時的にオフラインになっています。お電話、Zalo、またはメールにてお問い合わせください。",
                zh: "抱歉，ASPT的AI助手今天因升级新版本暂停服务。请通过电话、Zalo或电子邮件与我们联系以获得支持。"
            });

            chatMessages.appendChild(botBubble);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 3000);
    };

    if (btnSendChat) {
        btnSendChat.addEventListener('click', sendUserMessage);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendUserMessage();
            }
        });
    }

    // Hỗ trợ phím mũi tên Qua trái / Qua phải để duyệt ảnh trong Album giới thiệu
    document.addEventListener('keydown', (e) => {
        const detailView = document.getElementById('about-detail-view');
        if (detailView && detailView.style.display === 'block') {
            if (window.currentAboutAlbumImages && window.currentAboutAlbumImages.length > 0) {
                if (e.key === 'ArrowRight' || e.key === 'Right') {
                    const nextIdx = (window.currentAboutAlbumIndex + 1) % window.currentAboutAlbumImages.length;
                    window.updateAboutMainImage(nextIdx);
                } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
                    const prevIdx = (window.currentAboutAlbumIndex - 1 + window.currentAboutAlbumImages.length) % window.currentAboutAlbumImages.length;
                    window.updateAboutMainImage(prevIdx);
                }
            }
        }
    });
});
