import os
import json
import shutil

base_dir = "d:/06-CHIEN DICH DUNG AI/6.1-Marketting ASPT/Website_ASPT/assets/projects"

groups = {
    "1": "1-Dan-Dung-Cao-Tang",
    "2": "2-Dan-Dung-Thap-Tang",
    "3": "3-Cong-Nghiep",
    "4": "4-Ket-Cau-Dac-Biet"
}

# Create groups
for gid, gname in groups.items():
    path = os.path.join(base_dir, gname)
    os.makedirs(path, exist_ok=True)

moves = {
    "P001-ks-novotel": ("1", "1-1-ks-novotel"),
    "P002-nha-may-dana-y": ("3", "3-1-nha-may-dana-y"),
    "P003-pa-tower": ("1", "1-2-pa-tower"),
    "P004-ks-regis-bay": ("1", "1-3-ks-regis-bay")
}

for old_name, (gid, new_name) in moves.items():
    old_path = os.path.join(base_dir, old_name)
    if os.path.exists(old_path):
        new_path = os.path.join(base_dir, groups[gid], new_name)
        shutil.move(old_path, new_path)
        print(f"Moved {old_name} to {groups[gid]}/{new_name}")
        
        # Convert info.json to info.txt
        json_path = os.path.join(new_path, "info.json")
        txt_path = os.path.join(new_path, "info.txt")
        if os.path.exists(json_path):
            try:
                with open(json_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                with open(txt_path, 'w', encoding='utf-8') as f:
                    f.write(f"Tên: {data.get('title', new_name)}\n")
                    f.write(f"Vị trí: Đang cập nhật\n")
                    f.write(f"Năm thiết kế: Đang cập nhật\n")
                    f.write(f"Quy mô: {data.get('description', 'Đang cập nhật')}\n")
                    f.write(f"Công việc: Đang cập nhật\n")
                os.remove(json_path)
            except Exception as e:
                print(f"Error processing {json_path}: {e}")
