# Iniciar SSH para MySql

Ejecutar uno de estos dos comandos cuando se abre el proyecto.

cd "C:\Programacion\Lidr\Lidr-AI4Devs2025-ProyectoFinal"
.\scripts\ssh-tunnel-mysql.ps1
ó
ssh -i "C:\Users\Pabloq\pablo-notebook" -o StrictHostKeyChecking=no -L 3306:127.0.0.1:3306 -N forge@18.218.140.170

