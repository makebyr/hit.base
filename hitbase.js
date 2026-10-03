(function (window) {
    let isInitialized = false;
    let chatRef = null;

    // Cargar librerías necesarias de forma invisible
    function injectScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    window.Hitbase = {
        initializeApp: async function (config) {
            if (!config || !config.apiKey) {
                console.error("[Hitbase Error] Debes proporcionar una apiKey.");
                return;
            }

            // Descarga Firebase en silencio
            await injectScript("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
            await injectScript("https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js");

            const firebaseConfig = {
                apiKey: "AIzaSyCKvNViTMiARSW5sa5BoIZmF9cm7XL9bQY",
                authDomain: "raty-studios-servers.firebaseapp.com",
                databaseURL: "https://raty-studios-servers-default-rtdb.firebaseio.com",
                projectId: "raty-studios-servers"
            };

            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }

            chatRef = firebase.database().ref('hitbase_chats/' + config.apiKey + '/mensajes');
            isInitialized = true;
            console.log("%c[Hitbase Loaded] Conectado a través de hitbase.github.io", "color: #3b82f6; font-weight: bold;");
        },

        chat: {
            send: function (data) {
                if (!isInitialized) return console.error("[Hitbase Error] Inicializa la app primero.");
                return chatRef.push({
                    usuario: data.usuario || "Anónimo",
                    texto: data.texto,
                    timestamp: Date.now()
                });
            },

            onMessage: function (callback) {
                const interval = setInterval(() => {
                    if (isInitialized) {
                        clearInterval(interval);
                        chatRef.limitToLast(50).on('child_added', (snapshot) => {
                            callback(snapshot.val());
                        });
                    }
                }, 50);
            }
        }
    };
})(window);
