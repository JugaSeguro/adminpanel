/**
 * Panel de Administración - Casino Sites
 * JavaScript para manejar la interfaz y comunicación con Netlify Functions
 */

class CasinoAdmin {
    constructor() {
        this.apiEndpoint = '/.netlify/functions';
        this.config = null;
        this.deployStatus = new Map();
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.setupTabs();
        await this.loadConfiguration();
        this.checkConnectionStatus();
        
        // Auto-actualizar estado cada 30 segundos
        setInterval(() => this.checkSitesStatus(), 30000);
    }

    setupEventListeners() {
        // Navegación
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Configuración
        document.getElementById('load-config').addEventListener('click', () => this.loadConfiguration());
        document.getElementById('save-config').addEventListener('click', () => this.saveConfiguration());
        document.getElementById('save-texts').addEventListener('click', () => this.saveTexts());

        // Estado de sitios
        document.getElementById('check-status').addEventListener('click', () => this.checkSitesStatus());

        // Despliegues
        document.querySelectorAll('.deploy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.deploySite(e.target.dataset.site));
        });
        document.getElementById('deploy-all').addEventListener('click', () => this.deployAllSites());
    }

    setupTabs() {
        const urlParams = new URLSearchParams(window.location.search);
        const activeTab = urlParams.get('tab') || 'config';
        this.switchTab(activeTab);
    }

    switchTab(tabName) {
        // Actualizar botones de navegación
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Mostrar contenido de la pestaña
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-tab`);
        });

        // Actualizar URL
        const url = new URL(window.location);
        url.searchParams.set('tab', tabName);
        window.history.replaceState({}, '', url);
    }

    async loadConfiguration() {
        try {
            this.showLoading('Cargando configuración...');
            
            const response = await fetch(`${this.apiEndpoint}/get-config`);
            if (!response.ok) throw new Error('Error al cargar configuración');
            
            this.config = await response.json();
            this.populateConfigForm();
            this.populateTextsForm();
            
            this.showToast('Configuración cargada correctamente', 'success');
            this.updateConnectionStatus(true);
        } catch (error) {
            console.error('Error loading config:', error);
            this.showToast('Error al cargar la configuración', 'error');
            this.updateConnectionStatus(false);
            this.loadFallbackConfig();
        } finally {
            this.hideLoading();
        }
    }

    loadFallbackConfig() {
        // Configuración de respaldo si no se puede cargar del servidor
        this.config = {
            globalLinks: {
                whatsappUrl: "https://wa.link/oy1xno",
                telegramUrl: "https://t.me/jugadirecto",
                // URLs principales fijas
                xclubUrl: "https://1xclub.bet",
                envivoUrl: "https://24envivo.com"
            },
            sites: {
                "1xclub-links-casinos": {
                    brandName: "1XCLUB.BET",
                    siteName: "1xclub-links-casinos",
                    brandType: "1xclub"
                },
                "1xclub-links-wsp": {
                    brandName: "1XCLUB.BET",
                    siteName: "1xclub-links-wsp",
                    brandType: "1xclub"
                },
                "24envivo-links-casinos": {
                    brandName: "24ENVIVO.COM",
                    siteName: "24envivo-links-casinos",
                    brandType: "24envivo"
                },
                "24envivo-links-wsp": {
                    brandName: "24ENVIVO.COM",
                    siteName: "24envivo-links-wsp",
                    brandType: "24envivo"
                }
            },
            texts: {
                mainTitle: "Registrate gratis y pedi 2000 fichas para probar",
                subtitle: "Crea tu cuenta rápido y seguro ✨",
                description: "Regístrate totalmente gratis en la plataforma más segura de Argentina. Contamos con más de 12000 Slots, la mejor deportiva y el mejor casino en vivo.",
                buttons: {
                    bonus: "🔥 ¡OBTENÉ TU MEGABONUS CON TU PRIMER RECARGA 🔥",
                    register: "¡REGISTRATE AHORA!",
                    access: "🎯 ACCEDER A {BRAND} 🎯",
                    chat: "Chatear con nosotros"
                },
                telegram: "📱 SEGUINOS EN TELEGRAM Y GANÁ PREMIOS DIARIOS 📱"
            }
        };
        
        this.populateConfigForm();
        this.populateTextsForm();
    }

    populateConfigForm() {
        if (!this.config) return;

        // Poblar enlaces globales (solo WhatsApp y Telegram)
        if (this.config.globalLinks) {
            const globalWhatsapp = document.getElementById('global-whatsapp');
            const globalTelegram = document.getElementById('global-telegram');
            
            if (globalWhatsapp) globalWhatsapp.value = this.config.globalLinks.whatsappUrl || '';
            if (globalTelegram) globalTelegram.value = this.config.globalLinks.telegramUrl || '';
        }

        // La configuración específica de sitios ya no se edita desde el panel
        // Los sitios se configuran automáticamente basándose en los enlaces globales
    }

    populateTextsForm() {
        if (!this.config?.texts) return;

        const textElements = {
            'mainTitle': this.config.texts.mainTitle,
            'subtitle': this.config.texts.subtitle,
            'description': this.config.texts.description,
            'bonusButton': this.config.texts.buttons?.bonus,
            'registerButton': this.config.texts.buttons?.register,
            'accessButton': this.config.texts.buttons?.access,
            'chatButton': this.config.texts.buttons?.chat,
            'telegramText': this.config.texts.telegram
        };

        Object.entries(textElements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element && value) element.value = value;
        });
    }

    async saveConfiguration() {
        try {
            this.showLoading('Guardando configuración...');

            const updatedConfig = this.collectConfigData();
            
            const response = await fetch(`${this.apiEndpoint}/update-config`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedConfig)
            });

            if (!response.ok) throw new Error('Error al guardar configuración');

            const result = await response.json();
            this.config = result.config;
            
            this.showToast('Configuración guardada correctamente', 'success');
            this.addDeployLog('Configuración actualizada en el servidor');
            
            // Ofrecer redespliegue automático
            if (confirm('¿Deseas redesplegar todos los sitios ahora para aplicar los cambios?')) {
                await this.deployAllSites();
            }
            
        } catch (error) {
            console.error('Error saving config:', error);
            this.showToast('Error al guardar la configuración', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async saveTexts() {
        try {
            this.showLoading('Guardando textos...');

            const textsData = this.collectTextsData();
            
            const response = await fetch(`${this.apiEndpoint}/update-texts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ texts: textsData })
            });

            if (!response.ok) throw new Error('Error al guardar textos');

            this.showToast('Textos guardados correctamente', 'success');
            
        } catch (error) {
            console.error('Error saving texts:', error);
            this.showToast('Error al guardar los textos', 'error');
        } finally {
            this.hideLoading();
        }
    }

    collectConfigData() {
        // Recoger enlaces globales (solo los editables)
        const globalLinks = {
            whatsappUrl: document.getElementById('global-whatsapp')?.value || '',
            telegramUrl: document.getElementById('global-telegram')?.value || '',
            // URLs principales son fijas
            xclubUrl: "https://1xclub.bet",
            envivoUrl: "https://24envivo.com"
        };

        // La configuración de sitios es fija, no se modifica desde el panel
        const sites = {
            "1xclub-links-casinos": {
                brandName: "1XCLUB.BET",
                siteName: "1xclub-links-casinos",
                brandType: "1xclub"
            },
            "1xclub-links-wsp": {
                brandName: "1XCLUB.BET",
                siteName: "1xclub-links-wsp",
                brandType: "1xclub"
            },
            "24envivo-links-casinos": {
                brandName: "24ENVIVO.COM",
                siteName: "24envivo-links-casinos",
                brandType: "24envivo"
            },
            "24envivo-links-wsp": {
                brandName: "24ENVIVO.COM",
                siteName: "24envivo-links-wsp",
                brandType: "24envivo"
            }
        };

        return { 
            globalLinks,
            sites 
        };
    }

    collectTextsData() {
        return {
            mainTitle: document.getElementById('mainTitle').value,
            subtitle: document.getElementById('subtitle').value,
            description: document.getElementById('description').value,
            buttons: {
                bonus: document.getElementById('bonusButton').value,
                register: document.getElementById('registerButton').value,
                access: document.getElementById('accessButton').value,
                chat: document.getElementById('chatButton').value
            },
            telegram: document.getElementById('telegramText').value
        };
    }

    async checkSitesStatus() {
        const siteNames = ['1xclub-links-casinos', '1xclub-links-wsp', '24envivo-links-casinos', '24envivo-links-wsp'];
        
        for (const siteName of siteNames) {
            this.updateSiteStatus(siteName, 'pending', 'Verificando...');
        }

        try {
            const response = await fetch(`${this.apiEndpoint}/check-sites-status`);
            if (!response.ok) throw new Error('Error al verificar estado');
            
            const statusData = await response.json();
            
            Object.entries(statusData.sites).forEach(([siteName, status]) => {
                this.updateSiteStatus(
                    siteName,
                    status.online ? 'online' : 'offline',
                    status.lastDeploy || 'Nunca'
                );
                
                // Actualizar enlace del sitio
                const card = document.querySelector(`[data-site="${siteName}"]`);
                if (card && this.config?.sites?.[siteName]) {
                    const link = card.querySelector('.site-link');
                    if (link) link.href = this.config.sites[siteName].mainUrl;
                }
            });
            
        } catch (error) {
            console.error('Error checking sites status:', error);
            siteNames.forEach(siteName => {
                this.updateSiteStatus(siteName, 'offline', 'Error de conexión');
            });
        }
    }

    updateSiteStatus(siteName, status, lastDeploy) {
        const card = document.querySelector(`[data-site="${siteName}"] .status-info`);
        if (!card) return;

        const badge = card.querySelector('.status-badge');
        const deployText = card.querySelector('.last-deploy');

        if (badge) {
            badge.className = `status-badge ${status}`;
            badge.textContent = status === 'online' ? 'En línea' : 
                              status === 'pending' ? 'Verificando...' : 'Fuera de línea';
        }

        if (deployText) {
            deployText.textContent = `Último deploy: ${lastDeploy}`;
        }
    }

    async deploySite(siteName) {
        try {
            const button = document.querySelector(`[data-site="${siteName}"]`);
            if (button) {
                button.disabled = true;
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Desplegando...';
            }

            this.addDeployLog(`Iniciando despliegue de ${siteName}...`);

            const response = await fetch(`${this.apiEndpoint}/deploy-site`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ siteName })
            });

            if (!response.ok) throw new Error('Error en el despliegue');

            const result = await response.json();
            this.addDeployLog(`✅ ${siteName} desplegado correctamente`);
            this.showToast(`Sitio ${siteName} desplegado correctamente`, 'success');

        } catch (error) {
            console.error('Deploy error:', error);
            this.addDeployLog(`❌ Error desplegando ${siteName}: ${error.message}`);
            this.showToast(`Error desplegando ${siteName}`, 'error');
        } finally {
            const button = document.querySelector(`[data-site="${siteName}"]`);
            if (button) {
                button.disabled = false;
                button.innerHTML = `<i class="fas fa-rocket"></i> ${siteName.replace('-', ' ')}`;
            }
        }
    }

    async deployAllSites() {
        try {
            this.showLoading('Desplegando todos los sitios...');
            this.addDeployLog('🚀 Iniciando despliegue masivo...');

            const response = await fetch(`${this.apiEndpoint}/deploy-all-sites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Error en el despliegue masivo');

            const result = await response.json();
            
            this.addDeployLog('✅ Todos los sitios han sido desplegados correctamente');
            this.showToast('Todos los sitios desplegados correctamente', 'success');

            // Actualizar estado después de un momento
            setTimeout(() => this.checkSitesStatus(), 5000);

        } catch (error) {
            console.error('Mass deploy error:', error);
            this.addDeployLog(`❌ Error en despliegue masivo: ${error.message}`);
            this.showToast('Error en el despliegue masivo', 'error');
        } finally {
            this.hideLoading();
        }
    }

    addDeployLog(message) {
        const logContent = document.getElementById('deploy-log-content');
        if (!logContent) return;

        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.innerHTML = `<span class="log-time">[${timestamp}]</span> ${message}`;

        // Remover mensaje vacío si existe
        const emptyMessage = logContent.querySelector('.log-empty');
        if (emptyMessage) emptyMessage.remove();

        logContent.appendChild(logEntry);
        logContent.scrollTop = logContent.scrollHeight;

        // Mantener solo los últimos 50 logs
        const entries = logContent.querySelectorAll('.log-entry');
        if (entries.length > 50) {
            entries[0].remove();
        }
    }

    checkConnectionStatus() {
        // Verificar conexión cada 10 segundos
        setInterval(async () => {
            try {
                const response = await fetch(`${this.apiEndpoint}/ping`, {
                    method: 'GET',
                    cache: 'no-cache'
                });
                this.updateConnectionStatus(response.ok);
            } catch (error) {
                this.updateConnectionStatus(false);
            }
        }, 10000);
    }

    updateConnectionStatus(isOnline) {
        const statusElement = document.getElementById('connection-status');
        if (!statusElement) return;

        statusElement.className = isOnline ? 'status-online' : 'status-offline';
        statusElement.textContent = isOnline ? 'Conectado' : 'Desconectado';
    }

    showLoading(text = 'Procesando...') {
        const overlay = document.getElementById('loading-overlay');
        const loadingText = document.getElementById('loading-text');
        
        if (loadingText) loadingText.textContent = text;
        if (overlay) overlay.classList.remove('hidden');
    }

    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) overlay.classList.add('hidden');
    }

    showToast(message, type = 'info', title = '') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const titleElement = title ? `<div class="toast-title">${title}</div>` : '';
        toast.innerHTML = `
            ${titleElement}
            <div class="toast-message">${message}</div>
        `;

        container.appendChild(toast);

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);

        // Permitir cierre manual
        toast.addEventListener('click', () => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        });
    }
}

// CSS adicional para animación de salida
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .log-entry {
        margin-bottom: 0.25rem;
        font-family: monospace;
    }
    
    .log-time {
        color: #64748b;
        margin-right: 0.5rem;
    }
`;
document.head.appendChild(style);

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.casinoAdmin = new CasinoAdmin();
});
