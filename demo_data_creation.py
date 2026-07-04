import os
import shutil
import json

base_dir = r"d:\06-CHIEN DICH DUNG AI\6.1-Marketting ASPT\Website_ASPT\assets"
proj_dir = os.path.join(base_dir, "projects")
img_dir = os.path.join(base_dir, "images")

projects = [
    {"id": "P001", "slug": "ks-novotel", "title": "Khách sạn Novotel Sông Hàn", "desc": "37 Tầng, sàn chuyển 1.6m", "img_src": "hero_img_0.png"},
    {"id": "P002", "slug": "nha-may-dana-y", "title": "Nhà máy Thép Dana-Ý", "desc": "Công nghiệp cấp 2, Cầu trục 100 tấn", "img_src": "hero_img_1.png"},
    {"id": "P003", "slug": "pa-tower", "title": "Tổ hợp PA Tower", "desc": "30 Tầng, 2 Hầm, BIM LOD300", "img_src": "hero_img_2.png"},
    {"id": "P004", "slug": "ks-regis-bay", "title": "Khách sạn Regis Bay", "desc": "31 Tầng, Sàn chuyển dày 1.7m", "img_src": "hero_img_3.png"}
]

os.makedirs(proj_dir, exist_ok=True)

for p in projects:
    folder_name = f"{p['id']}-{p['slug']}"
    folder_path = os.path.join(proj_dir, folder_name)
    os.makedirs(folder_path, exist_ok=True)
    
    # Copy image
    src_img = os.path.join(img_dir, p['img_src'])
    dst_img = os.path.join(folder_path, "cover.png")
    if os.path.exists(src_img):
        shutil.copy(src_img, dst_img)
        
    # Write info.json
    info_path = os.path.join(folder_path, "info.json")
    with open(info_path, 'w', encoding='utf-8') as f:
        json.dump({"title": p["title"], "description": p["desc"]}, f, ensure_ascii=False, indent=4)

print("Demo data created successfully!")
