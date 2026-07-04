import os

base_dir = "d:/06-CHIEN DICH DUNG AI/6.1-Marketting ASPT/Website_ASPT/assets/projects"

# This dictionary holds the translations for the 4 existing projects.
translations = {
    "1-1-ks-novotel": {
        "vi": ["Tên: Khách sạn Novotel", "Vị trí: Đà Nẵng", "Năm thiết kế: 2012", "Quy mô: 37 Tầng, sàn chuyển 1.6m", "Công việc: Thiết kế kết cấu"],
        "en": ["Name: Novotel Hotel", "Location: Da Nang", "Year: 2012", "Scale: 37 Floors, 1.6m transfer slab", "Scope: Structural Design"],
        "ja": ["名前: ノボテルホテル", "場所: ダナン", "年: 2012", "規模: 37階建て、1.6mトランスファースラブ", "担当: 構造設計"],
        "zh": ["名称: 诺富特酒店", "位置: 岘港", "年份: 2012", "规模: 37层，1.6米转换板", "工作: 结构设计"]
    },
    "1-2-pa-tower": {
        "vi": ["Tên: PA Tower", "Vị trí: Đà Nẵng", "Năm thiết kế: Đang cập nhật", "Quy mô: Chưa có mô tả", "Công việc: Đang cập nhật"],
        "en": ["Name: PA Tower", "Location: Da Nang", "Year: Updating", "Scale: No description", "Scope: Updating"],
        "ja": ["名前: PAタワー", "場所: ダナン", "年: 更新中", "規模: 説明なし", "担当: 更新中"],
        "zh": ["名称: PA塔", "位置: 岘港", "年份: 更新中", "规模: 无描述", "工作: 更新中"]
    },
    "1-3-ks-regis-bay": {
        "vi": ["Tên: Khách sạn Regis Bay", "Vị trí: Đà Nẵng", "Năm thiết kế: Đang cập nhật", "Quy mô: Chưa có mô tả", "Công việc: Đang cập nhật"],
        "en": ["Name: Regis Bay Hotel", "Location: Da Nang", "Year: Updating", "Scale: No description", "Scope: Updating"],
        "ja": ["名前: レジスベイホテル", "場所: ダナン", "年: 更新中", "規模: 説明なし", "担当: 更新中"],
        "zh": ["名称: 瑞吉湾酒店", "位置: 岘港", "年份: 更新中", "规模: 无描述", "工作: 更新中"]
    },
    "3-1-nha-may-dana-y": {
        "vi": ["Tên: Nhà máy Dana Y", "Vị trí: Đà Nẵng", "Năm thiết kế: Đang cập nhật", "Quy mô: Chưa có mô tả", "Công việc: Đang cập nhật"],
        "en": ["Name: Dana Y Factory", "Location: Da Nang", "Year: Updating", "Scale: No description", "Scope: Updating"],
        "ja": ["名前: Dana Y 工場", "場所: ダナン", "年: 更新中", "規模: 説明なし", "担当: 更新中"],
        "zh": ["名称: Dana Y 工厂", "位置: 岘港", "年份: 更新中", "规模: 无描述", "工作: 更新中"]
    }
}

for root, dirs, files in os.walk(base_dir):
    for d in dirs:
        if d in translations:
            proj_path = os.path.join(root, d)
            for lang, lines in translations[d].items():
                file_path = os.path.join(proj_path, f"info_{lang}.txt")
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write("\n".join(lines))
            # Remove the generic info.txt if it exists to avoid confusion
            generic_txt = os.path.join(proj_path, "info.txt")
            if os.path.exists(generic_txt):
                os.remove(generic_txt)
            print(f"Created translations for {d}")

