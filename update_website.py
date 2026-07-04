import os
import json

def update_data():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    projects_dir = os.path.join(base_dir, 'assets', 'projects')
    data_file = os.path.join(base_dir, 'assets', 'data.js')

    if not os.path.exists(projects_dir):
        print(f"Directory {projects_dir} does not exist.")
        return

    # Define groups translation
    group_titles = {
        "1": {
            "vi": "Dự án dân dụng cao tầng",
            "en": "High-rise Civil Projects",
            "ja": "高層民間プロジェクト",
            "zh": "高层民用项目"
        },
        "2": {
            "vi": "Dự án dân dụng thấp tầng",
            "en": "Low-rise Civil Projects",
            "ja": "低層民間プロジェクト",
            "zh": "低层民用项目"
        },
        "3": {
            "vi": "Dự án công nghiệp",
            "en": "Industrial Projects",
            "ja": "産業プロジェクト",
            "zh": "工业项目"
        },
        "4": {
            "vi": "Công trình có kết cấu đặc biệt",
            "en": "Special Structure Projects",
            "ja": "特殊構造物",
            "zh": "特殊结构工程"
        }
    }

    groups_data = []

    for group_folder in os.listdir(projects_dir):
        group_path = os.path.join(projects_dir, group_folder)
        if not os.path.isdir(group_path):
            continue
            
        group_id = group_folder.split('-')[0]
        title_dict = group_titles.get(group_id, {"vi": group_folder, "en": group_folder, "ja": group_folder, "zh": group_folder})
        
        group_cover = ""
        for file in os.listdir(group_path):
            if os.path.isfile(os.path.join(group_path, file)) and file.lower().startswith("cover_"):
                group_cover = f"assets/projects/{group_folder}/{file}"
                break
                
        group_obj = {
            "id": group_id,
            "folder": group_folder,
            "title": title_dict,
            "cover": group_cover,
            "projects": []
        }
        
        for proj_folder in os.listdir(group_path):
            proj_path = os.path.join(group_path, proj_folder)
            if not os.path.isdir(proj_path):
                continue
                
            project_data = {
                "id": proj_folder,
                "title": {"vi": proj_folder, "en": proj_folder, "ja": proj_folder, "zh": proj_folder},
                "location": {"vi": "", "en": "", "ja": "", "zh": ""},
                "year": {"vi": "", "en": "", "ja": "", "zh": ""},
                "scale": {"vi": "", "en": "", "ja": "", "zh": ""},
                "scope": {"vi": "", "en": "", "ja": "", "zh": ""},
                "cover": "https://via.placeholder.com/800x800?text=No+Image",
                "images": []
            }
            
            # Read info files for 4 languages
            langs = ['vi', 'en', 'ja', 'zh']
            for lang in langs:
                info_txt_path = os.path.join(proj_path, f'info_{lang}.txt')
                # Fallback to info.txt if info_vi.txt doesn't exist
                if lang == 'vi' and not os.path.exists(info_txt_path):
                    info_txt_path = os.path.join(proj_path, 'info.txt')
                    
                if os.path.exists(info_txt_path):
                    try:
                        with open(info_txt_path, 'r', encoding='utf-8') as f:
                            lines = f.readlines()
                            for line in lines:
                                line = line.strip()
                                # Split by first colon
                                if ':' in line:
                                    key, val = line.split(':', 1)
                                    key = key.strip().lower()
                                    val = val.strip()
                                    if 'tên' in key or 'name' in key or '名前' in key or '名称' in key:
                                        project_data['title'][lang] = val
                                    elif 'vị trí' in key or 'location' in key or '場所' in key or '位置' in key:
                                        project_data['location'][lang] = val
                                    elif 'năm' in key or 'year' in key or '年' in key:
                                        project_data['year'][lang] = val
                                    elif 'quy mô' in key or 'scale' in key or '規模' in key:
                                        project_data['scale'][lang] = val
                                    elif 'công việc' in key or 'scope' in key or 'work' in key or '担当' in key or '工作' in key:
                                        project_data['scope'][lang] = val
                    except Exception as e:
                        print(f"Error reading {info_txt_path}: {e}")
                    
            # Gather images
            images = []
            for file in os.listdir(proj_path):
                if file.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                    rel_path = f"assets/projects/{group_folder}/{proj_folder}/{file}"
                    if 'cover' in file.lower():
                        project_data['cover'] = rel_path
                    images.append(rel_path)
            
            # If no cover was set, use first image
            if project_data['cover'].startswith('https://via') and images:
                project_data['cover'] = images[0]
                
            project_data['images'] = images
            group_obj['projects'].append(project_data)
            
        group_obj['projects'].sort(key=lambda x: x['id'])
        groups_data.append(group_obj)

    groups_data.sort(key=lambda x: x['id'])

    js_content = f"const projectsData = {json.dumps(groups_data, ensure_ascii=False, indent=4)};"
    with open(data_file, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"Successfully updated data.js with {len(groups_data)} groups!")

if __name__ == "__main__":
    update_data()
