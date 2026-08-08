@echo off
chcp 65001 >nul
color 0F
title Assistente do Rangel Moveis

:MENU
cls
echo ===================================================
echo     SISTEMA RANGEL MOVEIS - ASSISTENTE DE USO
echo ===================================================
echo.
echo 1. Instalar / Atualizar o Sistema (Recomendado na 1a vez)
echo 2. Iniciar o Sistema
echo 3. Fazer Backup de Seguranca
echo 4. Sair
echo.
set /p op="Digite a opcao desejada: "

if "%op%"=="1" goto INSTALL
if "%op%"=="2" goto START
if "%op%"=="3" goto BACKUP
if "%op%"=="4" goto EOF

echo Opcao invalida!
pause
goto MENU

:INSTALL
cls
echo ===================================================
echo       INSTALACAO E ATUALIZACAO DO SISTEMA
echo ===================================================
echo.
echo Verificando se o Deno esta instalado...
call deno --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Deno nao encontrado. Instalando automaticamente...
    powershell -Command "irm https://deno.land/install.ps1 | iex"
    if %errorlevel% neq 0 (
        color 0C
        echo [ERRO] Falha ao instalar o Deno. Verifique sua conexao com a internet.
        pause
        color 0F
        goto MENU
    )
    echo Feche esta janela e abra o assistente novamente para que as configuracoes entrem em vigor.
    pause
    exit
) else (
    echo [OK] Deno ja esta instalado.
)

echo.
echo [1/2] Compilando o sistema...
call deno task build
if %errorlevel% neq 0 (
    color 0C
    echo [ERRO] Falha ao compilar o sistema.
    pause
    color 0F
    goto MENU
)

echo.
echo [2/2] Atualizando o Banco de Dados...
call deno task db:migrate
if %errorlevel% neq 0 (
    color 0C
    echo [ERRO] Falha ao atualizar o banco de dados.
    pause
    color 0F
    goto MENU
)


color 0A
echo.
echo [SUCESSO] Sistema instalado e atualizado com sucesso!
pause
color 0F
goto MENU

:START
cls
echo ===================================================
echo                 INICIANDO O SISTEMA
echo ===================================================
echo.
echo Iniciando o servidor... A tela do navegador vai abrir automaticamente.
echo Mantenha esta janela preta aberta para que o sistema continue funcionando!
echo Para parar o sistema, apenas feche esta janela.
echo.
start http://localhost:3000
call deno task start
if %errorlevel% neq 0 (
    color 0C
    echo [ERRO] Falha ao iniciar o servidor. Verifique se a porta 3000 ja esta em uso.
    pause
    color 0F
)
goto MENU

:BACKUP
cls
echo ===================================================
echo               BACKUP DE SEGURANCA
echo ===================================================
echo.
echo [1/2] Gerando backup local...
call deno task db:backup
if %errorlevel% neq 0 (
    color 0C
    echo [ERRO] Falha ao gerar o arquivo de backup.
    pause
    color 0F
    goto MENU
)

echo [2/2] Copiando backup para a area de trabalho...
if not exist "%USERPROFILE%\Desktop\RangelMoveis-Backups" (
    mkdir "%USERPROFILE%\Desktop\RangelMoveis-Backups"
)
xcopy "data\backups\*" "%USERPROFILE%\Desktop\RangelMoveis-Backups\" /D /Y /I /E >nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERRO] Falha ao copiar arquivos para a area de trabalho.
    pause
    color 0F
    goto MENU
)

color 0A
echo.
echo [SUCESSO] Backup realizado e salvo na Area de Trabalho, na pasta "RangelMoveis-Backups".
pause
color 0F
goto MENU
