# Windows Görev Zamanlayicisi icin ornek: proje kokunu guncelleyin.
$ErrorActionPreference = "Stop"
Set-Location "C:\path\to\hukukportali"

python -m pip install -r automation\requirements.txt
python automation\content_manager.py --daily
