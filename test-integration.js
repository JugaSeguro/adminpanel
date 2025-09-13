/**
 * Script de Testing para Verificar Integración Completa
 * Ejecuta tests básicos de todas las funcionalidades
 */

class IntegrationTester {
    constructor() {
        this.baseUrl = window.location.origin;
        this.results = {
            passed: 0,
            failed: 0,
            tests: []
        };
    }

    async runAllTests() {
        console.log('🧪 Iniciando tests de integración...');
        
        await this.testHealthCheck();
        await this.testConfigLoad();
        await this.testConfigUpdate();
        await this.testSitesStatus();
        await this.testAdminInterface();
        
        this.showResults();
    }

    async test(name, testFunction) {
        try {
            console.log(`▶️ Testing: ${name}`);
            await testFunction();
            this.results.passed++;
            this.results.tests.push({ name, status: 'PASS', error: null });
            console.log(`✅ ${name} - PASSED`);
        } catch (error) {
            this.results.failed++;
            this.results.tests.push({ name, status: 'FAIL', error: error.message });
            console.error(`❌ ${name} - FAILED:`, error.message);
        }
    }

    async testHealthCheck() {
        await this.test('Health Check API', async () => {
            const response = await fetch(`${this.baseUrl}/.netlify/functions/ping`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const data = await response.json();
            if (!data.success) {
                throw new Error('Ping unsuccessful');
            }
        });
    }

    async testConfigLoad() {
        await this.test('Cargar Configuración', async () => {
            const response = await fetch(`${this.baseUrl}/.netlify/functions/get-config`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const data = await response.json();
            if (!data.config || !data.config.sites) {
                throw new Error('Configuración inválida');
            }
            
            // Verificar sitios requeridos
            const requiredSites = [
                '1xclub-links-casinos',
                '1xclub-links-wsp', 
                '24envivo-links-casinos',
                '24envivo-links-wsp'
            ];
            
            for (const siteName of requiredSites) {
                if (!data.config.sites[siteName]) {
                    throw new Error(`Sitio ${siteName} no encontrado en configuración`);
                }
            }
        });
    }

    async testConfigUpdate() {
        await this.test('Actualizar Configuración', async () => {
            const testConfig = {
                sites: {
                    '1xclub-links-casinos': {
                        mainUrl: 'https://1xclub.bet',
                        whatsappUrl: 'https://wa.link/oy1xno',
                        telegramUrl: 'https://t.me/jugadirecto',
                        brandName: '1XCLUB.BET'
                    }
                }
            };

            const response = await fetch(`${this.baseUrl}/.netlify/functions/update-config`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(testConfig)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            if (!data.success) {
                throw new Error('Update unsuccessful');
            }
        });
    }

    async testSitesStatus() {
        await this.test('Verificar Estado de Sitios', async () => {
            const response = await fetch(`${this.baseUrl}/.netlify/functions/check-sites-status`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const data = await response.json();
            if (!data.sites || typeof data.sites !== 'object') {
                throw new Error('Respuesta de estado inválida');
            }
        });
    }

    async testAdminInterface() {
        await this.test('Interfaz de Administración', async () => {
            // Verificar elementos clave del DOM
            const requiredElements = [
                '#connection-status',
                '.nav-btn',
                '.sites-grid',
                '#save-config',
                '#deploy-all'
            ];

            for (const selector of requiredElements) {
                const element = document.querySelector(selector);
                if (!element) {
                    throw new Error(`Elemento ${selector} no encontrado`);
                }
            }

            // Verificar navegación entre tabs
            const tabs = document.querySelectorAll('.nav-btn');
            if (tabs.length < 4) {
                throw new Error('No se encontraron suficientes tabs de navegación');
            }

            // Verificar cards de sitios
            const siteCards = document.querySelectorAll('.site-card');
            if (siteCards.length < 4) {
                throw new Error('No se encontraron todas las cards de sitios');
            }
        });
    }

    showResults() {
        const total = this.results.passed + this.results.failed;
        const percentage = Math.round((this.results.passed / total) * 100);
        
        console.log('\n📊 RESULTADOS DE TESTS:');
        console.log(`Total: ${total}`);
        console.log(`✅ Passed: ${this.results.passed}`);
        console.log(`❌ Failed: ${this.results.failed}`);
        console.log(`📈 Success Rate: ${percentage}%`);

        // Mostrar detalles de tests fallidos
        const failedTests = this.results.tests.filter(t => t.status === 'FAIL');
        if (failedTests.length > 0) {
            console.log('\n🔍 TESTS FALLIDOS:');
            failedTests.forEach(test => {
                console.log(`❌ ${test.name}: ${test.error}`);
            });
        }

        // Mostrar en la interfaz si está disponible
        this.updateUIResults(percentage, failedTests);
        
        return percentage >= 80; // Considerar exitoso si > 80%
    }

    updateUIResults(percentage, failedTests) {
        // Crear o actualizar elemento de resultados en la UI
        let resultsElement = document.getElementById('test-results');
        if (!resultsElement) {
            resultsElement = document.createElement('div');
            resultsElement.id = 'test-results';
            resultsElement.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border: 2px solid ${percentage >= 80 ? '#10b981' : '#ef4444'};
                border-radius: 8px;
                padding: 16px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                z-index: 1000;
                min-width: 300px;
            `;
            document.body.appendChild(resultsElement);
        }

        resultsElement.innerHTML = `
            <h3 style="margin: 0 0 10px 0; color: ${percentage >= 80 ? '#10b981' : '#ef4444'}">
                Tests ${percentage >= 80 ? 'Exitosos' : 'Con Errores'} (${percentage}%)
            </h3>
            <p>✅ Passed: ${this.results.passed}</p>
            <p>❌ Failed: ${this.results.failed}</p>
            ${failedTests.length > 0 ? `
                <details style="margin-top: 10px;">
                    <summary>Ver errores</summary>
                    <ul style="margin: 5px 0; padding-left: 20px; font-size: 12px;">
                        ${failedTests.map(t => `<li>${t.name}: ${t.error}</li>`).join('')}
                    </ul>
                </details>
            ` : ''}
            <button onclick="this.parentNode.remove()" style="
                background: #6b7280;
                color: white;
                border: none;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 10px;
                font-size: 12px;
            ">Cerrar</button>
        `;
    }
}

// Auto-ejecutar tests si es llamado directamente
if (typeof window !== 'undefined') {
    window.IntegrationTester = IntegrationTester;
    
    // Agregar botón de test al DOM cuando esté listo
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('admin-content')) {
            const testButton = document.createElement('button');
            testButton.innerHTML = '🧪 Ejecutar Tests';
            testButton.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #1e40af;
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
                z-index: 999;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            `;
            testButton.onclick = async () => {
                const tester = new IntegrationTester();
                await tester.runAllTests();
            };
            document.body.appendChild(testButton);
        }
    });
}

// Export para uso en Node.js si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IntegrationTester;
}


