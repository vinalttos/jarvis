const countryCodes = "AW AF AO AI AX AL AD AE AR AM AS AQ TF AG AU AT AZ BI BE BJ BQ BF BD BG BH BS BA BL BY BZ BM BO BR BB BN BT BV BW CF CA CC CH CM CL CN CI CD CG CK CO KM CV CR CU CW CX KY CY CZ DE DJ DM DK DO DZ EC EG ER EH ES EE ET FI FJ FK FR FO FM GA GB GE GG GH GI GN GP GM GW GQ GR GT GD GL GF GU GY HK HM HN HR HT HU ID IM IN IO IE IR IQ IS IL IT JM JE JO JP KZ KE KG KH KI KN KR KW LA LB LR LY LC LI LK LS LT LU LV MO MF MA MC MD MG MV MX MH MK ML MT MM ME MN MP MZ MR MS MQ MU MW MY YT NA NC NE NF NG NI NU NL NO NP NR NZ OM PK PA PN PE PH PW PG PL PR KP PT PY PS PF QA RE RO RU RW SA SD SN SG GS SH SJ SB SL SV SM SO PM RS SS SE ST SR SK SI SZ SX SC SY TC TD TG TH TJ TK TM TL TO TT TN TR TV TW TZ UG UA UM UY US UZ VA VC VE VG VI VN VU WF WS YE ZA ZM ZW".split(" ");
const portugueseCountries = new Set("AO BR CV GW MO MZ PT ST TL".split(" "));
const spanishCountries = new Set("AR BO CL CO CR CU DO EC ES GQ GT HN MX NI PA PE PR PY SV UY VE".split(" "));
const locales = { pt: "pt-BR", en: "en-US", es: "es-ES" };
const translations = {
  pt: {
    personalAssistant: "ASSISTENTE PESSOAL", ready: "SISTEMA PRONTO", newChat: "NOVA CONVERSA", history: "HISTÓRICO", customize: "PERSONALIZAR", account: "CONTA", logout: "SAIR",
    commandCenter: "CENTRAL DE COMANDO · 01", goodMorning: "Bom dia.", goodAfternoon: "Boa tarde.", goodEvening: "Boa noite.", voiceInterface: "INTERFACE DE VOZ", localReady: "LOCAL · PRONTO", assistantCore: "NÚCLEO DE ASSISTÊNCIA", waiting: "EM ESPERA", initialMessage: "Olá. Estou pronto para ajudar. Posso responder com personalidade, buscar informações atualizadas e manter seu histórico de conversa.",
    voiceRecognition: "Ativar reconhecimento de voz", speakToAssistant: "Falar com o assistente", messagePlaceholder: "Diga ou escreva um comando...", messageForAssistant: "Mensagem para o assistente", send: "ENVIAR", localTime: "HORA LOCAL", syncingClock: "Sincronizando relógio", reminders: "LEMBRETES", addReminder: "Adicionar lembrete...", newReminder: "Novo lembrete", shortcuts: "ATALHOS", whatTime: "Que horas são?", calculate: "Calcular", myReminders: "Meus lembretes", localStorageNote: "SEUS LEMBRETES E HISTÓRICO FICAM SALVOS NESTE NAVEGADOR",
    delete: "APAGAR", close: "FECHAR", customizeJarvis: "PERSONALIZAR JARVIS", accentColor: "COR DE DESTAQUE", assistantName: "NOME DO ASSISTENTE", howToAddress: "COMO O ASSISTENTE CHAMA VOCÊ", optional: "Opcional", savePreferences: "SALVAR PREFERÊNCIAS",
    username: "NOME DE USUÁRIO", email: "E-MAIL", password: "SENHA", newPassword: "NOVA SENHA", resetCode: "CÓDIGO DE VERIFICAÇÃO", country: "PAÍS", accountName: "NOME DE USUÁRIO", language: "IDIOMA",
    loginTitle: "Entre na sua conta", loginDescription: "Acesse seu assistente pessoal ou crie uma conta para começar.", registerTitle: "Crie sua conta", registerDescription: "Escolha seu país para configurar o idioma do Jarvis.", loginButton: "ENTRAR", registerButton: "CRIAR CONTA", noAccount: "Não tem uma conta?", hasAccount: "Já tem uma conta?", registerLink: "Criar conta", loginLink: "Entrar na conta", selectCountry: "Selecione seu país", countryLanguage: "Português", languageName: "Português",
    forgotPassword: "Esqueceu a senha?", resetTitle: "Recuperar senha", resetRequestButton: "ENVIAR CÓDIGO", resetSubmitButton: "CRIAR NOVA SENHA", resetRequestDescription: "Informe o e-mail usado no cadastro para receber um código de recuperação.", resetCodeDescription: "Digite o código enviado para seu e-mail e escolha uma nova senha.", resetSent: "Se o e-mail estiver cadastrado, enviaremos um código de recuperação.", resetSuccess: "Senha alterada. Entre com sua nova senha.", resetUnavailable: "Não foi possível enviar o código agora. Tente novamente mais tarde.", backToLogin: "Voltar para entrar",
    noHistory: "Nenhuma conversa salva", confirmDeleteHistory: "Apagar todo o histórico de conversas desta conta?", historyDeleted: "Histórico apagado.", noReminders: "Nenhum lembrete por enquanto.", taskCount: (count) => `${count} ATIVO${count === 1 ? "" : "S"}`,
    accountSignedOut: "Você saiu da sua conta.", accountNetworkError: "Não foi possível sair agora. Tente novamente.", waitingForAI: "CONSULTANDO IA", processingAI: "IA EM PROCESSAMENTO", listening: "OUVINDO", microphoneActive: "MICROFONE ATIVO", voiceUnavailable: "Reconhecimento de voz não disponível neste navegador",
    timeAnswer: (time) => `Agora são ${time}.`, dateAnswer: (date) => `Hoje é ${date}.`, remindersAnswer: (count, items) => count ? `Você tem ${count} lembrete${count === 1 ? "" : "s"}: ${items}.` : "Você não tem lembretes ativos.",
    reminderAdded: "Lembrete adicionado.", noted: (text) => `Anotado: ${text}.`, whatToNote: "O que você gostaria que eu anotasse?", help: "Posso informar as horas e a data, fazer contas, guardar lembretes e responder às suas perguntas.", result: (value) => `O resultado é ${value}.`, newChatStarted: (name) => name ? `Nova conversa iniciada, ${name}. Como posso ajudar?` : "Nova conversa iniciada. Como posso ajudar?",
    confirmDelete: "Apagar", invalidAssistantName: "Informe um nome para o assistente.", cannotConnect: "Não foi possível conectar à IA.", microphoneError: "Não consegui acessar o microfone. Confira a permissão do navegador ou digite sua mensagem.", emptyResponse: "Não foi possível consultar a IA.", storageUnavailable: "ARMAZENAMENTO INDISPONÍVEL"
  },
  en: {
    personalAssistant: "PERSONAL ASSISTANT", ready: "SYSTEM READY", newChat: "NEW CHAT", history: "HISTORY", customize: "CUSTOMIZE", account: "ACCOUNT", logout: "LOG OUT",
    commandCenter: "COMMAND CENTER · 01", goodMorning: "Good morning.", goodAfternoon: "Good afternoon.", goodEvening: "Good evening.", voiceInterface: "VOICE INTERFACE", localReady: "LOCAL · READY", assistantCore: "ASSISTANT CORE", waiting: "STANDBY", initialMessage: "Hello. I'm ready to help. I can answer questions, find up-to-date information, and keep your conversation history.",
    voiceRecognition: "Enable voice recognition", speakToAssistant: "Speak to the assistant", messagePlaceholder: "Say or type a command...", messageForAssistant: "Message for the assistant", send: "SEND", localTime: "LOCAL TIME", syncingClock: "Syncing clock", reminders: "REMINDERS", addReminder: "Add a reminder...", newReminder: "New reminder", shortcuts: "SHORTCUTS", whatTime: "What time is it?", calculate: "Calculate", myReminders: "My reminders", localStorageNote: "YOUR REMINDERS AND HISTORY ARE SAVED IN THIS BROWSER",
    delete: "DELETE", close: "CLOSE", customizeJarvis: "CUSTOMIZE JARVIS", accentColor: "ACCENT COLOR", assistantName: "ASSISTANT NAME", howToAddress: "HOW THE ASSISTANT ADDRESSES YOU", optional: "Optional", savePreferences: "SAVE PREFERENCES",
    username: "USERNAME", email: "EMAIL", password: "PASSWORD", newPassword: "NEW PASSWORD", resetCode: "VERIFICATION CODE", country: "COUNTRY", accountName: "USERNAME", language: "LANGUAGE",
    loginTitle: "Sign in to your account", loginDescription: "Access your personal assistant or create an account to get started.", registerTitle: "Create your account", registerDescription: "Choose your country to set Jarvis's language.", loginButton: "SIGN IN", registerButton: "CREATE ACCOUNT", noAccount: "Don't have an account?", hasAccount: "Already have an account?", registerLink: "Create account", loginLink: "Sign in", selectCountry: "Select your country", countryLanguage: "English", languageName: "English",
    forgotPassword: "Forgot password?", resetTitle: "Reset password", resetRequestButton: "SEND CODE", resetSubmitButton: "SET NEW PASSWORD", resetRequestDescription: "Enter the email address used to create your account to receive a recovery code.", resetCodeDescription: "Enter the code sent to your email and choose a new password.", resetSent: "If the email is registered, we will send a recovery code.", resetSuccess: "Password changed. Sign in with your new password.", resetUnavailable: "Couldn't send the code right now. Please try again later.", backToLogin: "Back to sign in",
    noHistory: "No saved conversations", confirmDeleteHistory: "Delete all conversation history for this account?", historyDeleted: "History deleted.", noReminders: "No reminders yet.", taskCount: (count) => `${count} ACTIVE${count === 1 ? "" : "S"}`,
    accountSignedOut: "You have signed out.", accountNetworkError: "Couldn't sign out. Please try again.", waitingForAI: "CONSULTING AI", processingAI: "AI PROCESSING", listening: "LISTENING", microphoneActive: "MICROPHONE ACTIVE", voiceUnavailable: "Voice recognition is not available in this browser",
    timeAnswer: (time) => `It's ${time}.`, dateAnswer: (date) => `Today is ${date}.`, remindersAnswer: (count, items) => count ? `You have ${count} reminder${count === 1 ? "" : "s"}: ${items}.` : "You have no active reminders.",
    reminderAdded: "Reminder added.", noted: (text) => `Noted: ${text}.`, whatToNote: "What would you like me to note?", help: "I can tell you the time and date, calculate, save reminders, and answer your questions.", result: (value) => `The result is ${value}.`, newChatStarted: (name) => name ? `New chat started, ${name}. How can I help?` : "New chat started. How can I help?",
    confirmDelete: "Delete", invalidAssistantName: "Enter an assistant name.", cannotConnect: "Couldn't connect to the AI.", microphoneError: "Couldn't access the microphone. Check browser permissions or type your message.", emptyResponse: "Couldn't consult the AI.", storageUnavailable: "STORAGE UNAVAILABLE"
  },
  es: {
    personalAssistant: "ASISTENTE PERSONAL", ready: "SISTEMA LISTO", newChat: "NUEVA CONVERSACIÓN", history: "HISTORIAL", customize: "PERSONALIZAR", account: "CUENTA", logout: "SALIR",
    commandCenter: "CENTRAL DE MANDO · 01", goodMorning: "Buenos días.", goodAfternoon: "Buenas tardes.", goodEvening: "Buenas noches.", voiceInterface: "INTERFAZ DE VOZ", localReady: "LOCAL · LISTO", assistantCore: "NÚCLEO DE ASISTENCIA", waiting: "EN ESPERA", initialMessage: "Hola. Estoy listo para ayudar. Puedo responder preguntas, buscar información actualizada y guardar el historial de conversación.",
    voiceRecognition: "Activar reconocimiento de voz", speakToAssistant: "Hablar con el asistente", messagePlaceholder: "Di o escribe un comando...", messageForAssistant: "Mensaje para el asistente", send: "ENVIAR", localTime: "HORA LOCAL", syncingClock: "Sincronizando reloj", reminders: "RECORDATORIOS", addReminder: "Añadir recordatorio...", newReminder: "Nuevo recordatorio", shortcuts: "ATAJOS", whatTime: "¿Qué hora es?", calculate: "Calcular", myReminders: "Mis recordatorios", localStorageNote: "TUS RECORDATORIOS E HISTORIAL SE GUARDAN EN ESTE NAVEGADOR",
    delete: "BORRAR", close: "CERRAR", customizeJarvis: "PERSONALIZAR JARVIS", accentColor: "COLOR DE ACENTO", assistantName: "NOMBRE DEL ASISTENTE", howToAddress: "CÓMO TE LLAMA EL ASISTENTE", optional: "Opcional", savePreferences: "GUARDAR PREFERENCIAS",
    username: "NOMBRE DE USUARIO", email: "CORREO", password: "CONTRASEÑA", newPassword: "NUEVA CONTRASEÑA", resetCode: "CÓDIGO DE VERIFICACIÓN", country: "PAÍS", accountName: "NOMBRE DE USUARIO", language: "IDIOMA",
    loginTitle: "Inicia sesión", loginDescription: "Accede a tu asistente personal o crea una cuenta para empezar.", registerTitle: "Crea tu cuenta", registerDescription: "Elige tu país para configurar el idioma de Jarvis.", loginButton: "ENTRAR", registerButton: "CREAR CUENTA", noAccount: "¿No tienes una cuenta?", hasAccount: "¿Ya tienes una cuenta?", registerLink: "Crear cuenta", loginLink: "Iniciar sesión", selectCountry: "Selecciona tu país", countryLanguage: "Español", languageName: "Español",
    forgotPassword: "¿Olvidaste tu contraseña?", resetTitle: "Recuperar contraseña", resetRequestButton: "ENVIAR CÓDIGO", resetSubmitButton: "CREAR NUEVA CONTRASEÑA", resetRequestDescription: "Escribe el correo usado al crear la cuenta para recibir un código de recuperación.", resetCodeDescription: "Escribe el código enviado a tu correo y elige una nueva contraseña.", resetSent: "Si el correo está registrado, enviaremos un código de recuperación.", resetSuccess: "Contraseña cambiada. Inicia sesión con tu nueva contraseña.", resetUnavailable: "No se pudo enviar el código. Inténtalo más tarde.", backToLogin: "Volver al inicio de sesión",
    noHistory: "No hay conversaciones guardadas", confirmDeleteHistory: "¿Borrar todo el historial de conversaciones de esta cuenta?", historyDeleted: "Historial borrado.", noReminders: "Aún no hay recordatorios.", taskCount: (count) => `${count} ACTIVO${count === 1 ? "" : "S"}`,
    accountSignedOut: "Has cerrado sesión.", accountNetworkError: "No se pudo cerrar sesión. Inténtalo de nuevo.", waitingForAI: "CONSULTANDO IA", processingAI: "IA EN PROCESO", listening: "ESCUCHANDO", microphoneActive: "MICRÓFONO ACTIVO", voiceUnavailable: "El reconocimiento de voz no está disponible en este navegador",
    timeAnswer: (time) => `Ahora son las ${time}.`, dateAnswer: (date) => `Hoy es ${date}.`, remindersAnswer: (count, items) => count ? `Tienes ${count} recordatorio${count === 1 ? "" : "s"}: ${items}.` : "No tienes recordatorios activos.",
    reminderAdded: "Recordatorio añadido.", noted: (text) => `Anotado: ${text}.`, whatToNote: "¿Qué quieres que anote?", help: "Puedo decirte la hora y la fecha, hacer cálculos, guardar recordatorios y responder tus preguntas.", result: (value) => `El resultado es ${value}.`, newChatStarted: (name) => name ? `Nueva conversación iniciada, ${name}. ¿Cómo puedo ayudarte?` : "Nueva conversación iniciada. ¿Cómo puedo ayudarte?",
    confirmDelete: "Borrar", invalidAssistantName: "Escribe un nombre para el asistente.", cannotConnect: "No se pudo conectar con la IA.", microphoneError: "No pude acceder al micrófono. Revisa los permisos del navegador o escribe tu mensaje.", emptyResponse: "No se pudo consultar la IA.", storageUnavailable: "ALMACENAMIENTO NO DISPONIBLE"
  }
};

const authScreen = document.querySelector("#auth-screen");
const authForm = document.querySelector("#auth-form");
const authNameInput = document.querySelector("#auth-name");
const authEmailInput = document.querySelector("#auth-email");
const authPasswordInput = document.querySelector("#auth-password");
const authCountrySelect = document.querySelector("#auth-country");
const authError = document.querySelector("#auth-error");
const authSubmit = document.querySelector("#auth-submit");
const shell = document.querySelector(".shell");
const accountPanel = document.querySelector("#account-panel");
const historyPanel = document.querySelector("#history-panel");
const historyList = document.querySelector("#history-list");
const conversation = document.querySelector("#conversation");
const chatForm = document.querySelector("#chat-form");
const chatInput = document.querySelector("#chat-input");
const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const stage = document.querySelector("#assistant-stage");
const stageReadout = document.querySelector("#stage-readout");
const micButton = document.querySelector("#mic-button");
const settingsPanel = document.querySelector("#settings-panel");
const settingsBtn = document.querySelector("#settings-btn");
const settingsForm = document.querySelector("#settings-form");
const colorInput = document.querySelector("#theme-color-input");
const assistantNameInput = document.querySelector("#assistant-name-input");
const userNameInput = document.querySelector("#user-name-input");

let account = null;
let currentLanguage = "pt";
let authMode = "login";
let reminders = [];
let conversations = [];
let currentConversation = null;
let aiHistory = [];
let preferences = { color: "#a7f2c5", assistantName: "JARVIS", userName: "" };
let recognition = null;
let recognitionActive = false;
let isThinking = false;
let speechTimer = null;
const maxSpeechDurationMs = 20_000;
const maxSpokenWords = 35;

function t(key, ...args) {
  const value = translations[currentLanguage][key] ?? translations.en[key] ?? key;
  return typeof value === "function" ? value(...args) : value;
}

function languageForCountry(country) {
  if (portugueseCountries.has(country)) return "pt";
  if (spanishCountries.has(country)) return "es";
  return "en";
}

function countryName(code, language = currentLanguage) {
  try {
    return new Intl.DisplayNames([locales[language]], { type: "region" }).of(code) || code;
  } catch {
    return code;
  }
}

function populateCountries(selected = authCountrySelect.value) {
  const displayNames = new Intl.DisplayNames([locales[currentLanguage]], { type: "region" });
  const countries = countryCodes.map((code) => [code, displayNames.of(code) || code])
    .sort((left, right) => left[1].localeCompare(right[1], locales[currentLanguage]));
  authCountrySelect.replaceChildren(new Option(t("selectCountry"), ""));
  countries.forEach(([code, name]) => authCountrySelect.add(new Option(name, code)));
  if (countryCodes.includes(selected)) authCountrySelect.value = selected;
}

function applyLanguage(language) {
  currentLanguage = translations[language] ? language : "pt";
  document.documentElement.lang = locales[currentLanguage];
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAria));
  });
  document.querySelectorAll("[data-i18n-title]").forEach((element) => {
    element.title = t(element.dataset.i18nTitle);
  });
  populateCountries();
  renderAuthMode();
  if (account) {
    renderReminders();
    renderHistory();
    renderConversation();
    updateClock();
    renderAccount();
  }
}

function renderAuthMode() {
  const isRegister = authMode === "register";
  const isForgot = authMode === "forgot";
  const isReset = authMode === "reset";
  const isRecovery = isForgot || isReset;
  document.querySelector("#auth-title").textContent = t(isRecovery ? "resetTitle" : isRegister ? "registerTitle" : "loginTitle");
  document.querySelector("#auth-description").textContent = isReset ? t("resetCodeDescription") : isForgot ? t("resetRequestDescription") : t(isRegister ? "registerDescription" : "loginDescription");
  document.querySelector("#auth-name-label").hidden = isRecovery;
  document.querySelector("#auth-email-label").hidden = !isRegister && !isRecovery;
  document.querySelector("#auth-country-label").hidden = !isRegister;
  document.querySelector("#auth-reset-code-label").hidden = !isReset;
  document.querySelector("#auth-new-password-label").hidden = !isReset;
  document.querySelector("#auth-password").closest("label").hidden = isRecovery;
  document.querySelector("#auth-email").readOnly = isReset;
  authNameInput.required = !isRecovery;
  document.querySelector("#auth-email").required = isRegister || isRecovery;
  authCountrySelect.required = isRegister;
  authNameInput.autocomplete = "username";
  authPasswordInput.autocomplete = isRegister ? "new-password" : "current-password";
  authPasswordInput.required = !isRecovery;
  document.querySelector("#auth-reset-code").required = isReset;
  document.querySelector("#auth-new-password").required = isReset;
  authSubmit.textContent = t(isForgot ? "resetRequestButton" : isReset ? "resetSubmitButton" : isRegister ? "registerButton" : "loginButton");
  document.querySelector("#auth-switch-text").textContent = isRecovery ? "" : t(isRegister ? "hasAccount" : "noAccount");
  document.querySelector("#auth-switch-btn").textContent = isRecovery ? t("backToLogin") : t(isRegister ? "loginLink" : "registerLink");
  document.querySelector(".auth-switch").hidden = false;
  document.querySelector("#auth-forgot").hidden = authMode !== "login";
}

function localizedAuthError(message) {
  const known = {
    "Informe um nome de usuário válido de até 60 caracteres.": { en: "Enter a valid username of up to 60 characters.", es: "Escribe un nombre de usuario válido de hasta 60 caracteres." },
    "Já existe uma conta com este nome de usuário.": { en: "That username is already taken.", es: "Ese nombre de usuario ya está en uso." },
    "Informe um e-mail válido.": { en: "Enter a valid email address.", es: "Escribe un correo electrónico válido." },
    "A senha deve ter entre 8 e 128 caracteres.": { en: "The password must be 8–128 characters long.", es: "La contraseña debe tener entre 8 y 128 caracteres." },
    "Selecione um país válido.": { en: "Select a valid country.", es: "Selecciona un país válido." },
    "Já existe uma conta com este e-mail.": { en: "An account with this email already exists.", es: "Ya existe una cuenta con este correo." },
    "Muitas tentativas. Aguarde alguns minutos e tente novamente.": { en: "Too many attempts. Wait a few minutes and try again.", es: "Demasiados intentos. Espera unos minutos e inténtalo de nuevo." },
    "Aguarde antes de solicitar outro código.": { en: "Please wait before requesting another code.", es: "Espera antes de solicitar otro código." },
    "A recuperação de senha por e-mail não está configurada neste servidor.": { en: "Email password recovery is not configured on this server.", es: "La recuperación de contraseña por correo no está configurada en este servidor." },
    "Não foi possível enviar o código agora. Tente novamente mais tarde.": { en: "Couldn't send the code right now. Please try again later.", es: "No se pudo enviar el código. Inténtalo más tarde." },
    "Código ou e-mail inválido.": { en: "Invalid code or email.", es: "Código o correo no válido." },
    "Código inválido ou expirado. Solicite outro código.": { en: "Invalid or expired code. Request another code.", es: "El código no es válido o ha caducado. Solicita otro." },
    "Limite de tentativas atingido. Solicite outro código.": { en: "Too many attempts. Request another code.", es: "Demasiados intentos. Solicita otro código." },
    "Nome de usuário ou senha incorretos.": { en: "Incorrect username or password.", es: "Nombre de usuario o contraseña incorrectos." },
    "Corpo da requisição inválido.": { en: "The request was invalid.", es: "La solicitud no es válida." }
  };
  return known[message]?.[currentLanguage] || message;
}

function storageKey(name) {
  return `jarvis-${name}-v1:${account.id}`;
}

function loadStored(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(storageKey(key)) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}

function saveStored(key, value) {
  try {
    localStorage.setItem(storageKey(key), JSON.stringify(value));
    return true;
  } catch {
    setStatus(t("storageUnavailable"));
    return false;
  }
}

function loadPreferences() {
  const saved = loadStored("preferences", null);
  if (!saved || typeof saved !== "object") return { color: "#a7f2c5", assistantName: "JARVIS", userName: "" };
  return {
    color: typeof saved.color === "string" && /^#[\da-f]{6}$/i.test(saved.color) ? saved.color : "#a7f2c5",
    assistantName: typeof saved.assistantName === "string" && saved.assistantName.trim() ? saved.assistantName.trim().slice(0, 32) : "JARVIS",
    userName: typeof saved.userName === "string" ? saved.userName.trim().slice(0, 32) : ""
  };
}

function setStatus(label) {
  document.querySelector("#status-text").textContent = label;
}

function darkenColor(hex) {
  const channels = [1, 3, 5].map((index) => Math.round(parseInt(hex.slice(index, index + 2), 16) * 0.62));
  return `#${channels.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function applyColor(hex) {
  const rgb = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16)).join(", ");
  document.documentElement.style.setProperty("--mint", hex);
  document.documentElement.style.setProperty("--mint-dark", darkenColor(hex));
  document.documentElement.style.setProperty("--accent-rgb", rgb);
}

function applyPreferences() {
  applyColor(preferences.color);
  document.querySelector(".brand-name").textContent = preferences.assistantName;
  document.querySelector(".brand-mark").textContent = preferences.assistantName.trim().charAt(0).toUpperCase() || "J";
  document.querySelector(".core").textContent = preferences.assistantName;
  document.title = `${preferences.assistantName} | ${t("personalAssistant")}`;
  document.querySelectorAll(".message-label").forEach((label) => {
    if (!label.classList.contains("user-label")) label.textContent = preferences.assistantName;
  });
}

function initialGreeting() {
  return preferences.userName
    ? ({ pt: `Olá, ${preferences.userName}. Estou pronto para ajudar.`, en: `Hello, ${preferences.userName}. I'm ready to help.`, es: `Hola, ${preferences.userName}. Estoy listo para ayudarte.` })[currentLanguage]
    : t("initialMessage");
}

function createId() {
  return crypto.randomUUID ? crypto.randomUUID() : `conv-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadReminders() {
  const saved = loadStored("reminders", []);
  return Array.isArray(saved) ? saved.filter((item) => item && typeof item.text === "string") : [];
}

function saveReminders() {
  saveStored("reminders", reminders);
}

function loadConversations() {
  const saved = loadStored("history", []);
  return Array.isArray(saved) ? saved.filter((item) => item && typeof item.id === "string" && Array.isArray(item.messages)) : [];
}

function saveConversations() {
  saveStored("history", conversations.slice(0, 12));
}

function createConversation(title = translations[currentLanguage].newChat) {
  return { id: createId(), title, updatedAt: Date.now(), messages: [] };
}

function renderConversation() {
  conversation.replaceChildren();
  const messages = aiHistory.length ? aiHistory : [{ role: "assistant", content: initialGreeting() }];
  messages.forEach((entry) => {
    if (!entry || typeof entry.content !== "string") return;
    addMessage(entry.role === "user" ? "VOCÊ" : preferences.assistantName, entry.content);
  });
}

function persistCurrentConversation() {
  if (!currentConversation) return;
  currentConversation.messages = aiHistory.slice(-40);
  currentConversation.updatedAt = Date.now();
  currentConversation.title = currentConversation.messages.find((message) => message.role === "user" && typeof message.content === "string")?.content.slice(0, 28) || t("newChat");
  conversations = [currentConversation, ...conversations.filter((item) => item.id !== currentConversation.id)].slice(0, 12);
  saveConversations();
  renderHistory();
}

function renderHistory() {
  historyList.replaceChildren();
  if (!conversations.length) {
    const empty = document.createElement("div");
    empty.className = "empty-history";
    empty.textContent = t("noHistory");
    historyList.append(empty);
    return;
  }
  conversations.forEach((conv) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "history-item";
    const title = document.createElement("strong");
    title.textContent = conv.title || t("newChat");
    const date = document.createElement("small");
    date.textContent = new Date(conv.updatedAt).toLocaleString(locales[currentLanguage], { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
    button.append(title, date);
    button.addEventListener("click", () => {
      currentConversation = conv;
      aiHistory = conv.messages.slice();
      renderConversation();
      historyPanel.classList.remove("open");
      chatInput.focus();
    });
    historyList.append(button);
  });
}

function updateClock() {
  const now = new Date();
  document.querySelector("#clock").textContent = new Intl.DateTimeFormat(locales[currentLanguage], { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(now);
  document.querySelector("#clock-meta").textContent = new Intl.DateTimeFormat(locales[currentLanguage], { weekday: "long", day: "numeric", month: "long" }).format(now);
  document.querySelector("#date-day").textContent = new Intl.DateTimeFormat(locales[currentLanguage], { weekday: "long", day: "2-digit", month: "long" }).format(now);
  document.querySelector("#date-full").textContent = new Intl.DateTimeFormat(locales[currentLanguage], { year: "numeric", timeZoneName: "short" }).format(now);
  const hour = now.getHours();
  document.querySelector("#greeting").textContent = t(hour < 12 ? "goodMorning" : hour < 18 ? "goodAfternoon" : "goodEvening");
}

function renderReminders() {
  taskList.replaceChildren();
  const activeCount = reminders.filter((item) => !item.done).length;
  document.querySelector("#task-count").textContent = t("taskCount", activeCount);
  if (!reminders.length) {
    const empty = document.createElement("p");
    empty.className = "empty-tasks";
    empty.textContent = t("noReminders");
    taskList.append(empty);
    return;
  }
  reminders.forEach((item, index) => {
    const row = document.createElement("label");
    row.className = `task${item.done ? " done" : ""}`;
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = Boolean(item.done);
    checkbox.setAttribute("aria-label", `${t("confirmDelete")} ${item.text}`);
    checkbox.addEventListener("change", () => {
      reminders[index].done = checkbox.checked;
      saveReminders();
      renderReminders();
    });
    const text = document.createElement("span");
    text.textContent = item.text;
    const remove = document.createElement("button");
    remove.className = "delete-task";
    remove.type = "button";
    remove.textContent = "×";
    remove.setAttribute("aria-label", `${t("delete")} ${item.text}`);
    remove.addEventListener("click", (event) => {
      event.preventDefault();
      reminders.splice(index, 1);
      saveReminders();
      renderReminders();
    });
    row.append(checkbox, text, remove);
    taskList.append(row);
  });
}

function addReminder(text) {
  const cleanText = text.trim().replace(/[.!?]+$/, "");
  if (!cleanText) return false;
  reminders.push({ text: cleanText, done: false });
  saveReminders();
  renderReminders();
  return true;
}

function addMessage(who, text) {
  const message = document.createElement("div");
  const isUser = who === "VOCÊ" || who === "YOU" || who === "TÚ";
  message.className = `message${isUser ? " user" : ""}`;
  const label = document.createElement("span");
  label.className = `message-label${isUser ? " user-label" : ""}`;
  label.textContent = isUser ? ({ pt: "VOCÊ", en: "YOU", es: "TÚ" })[currentLanguage] : who;
  const body = document.createElement("p");
  body.textContent = text;
  message.append(label, body);
  conversation.append(message);
  conversation.scrollTop = conversation.scrollHeight;
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  window.clearTimeout(speechTimer);
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = locales[currentLanguage];
  const languagePrefix = utterance.lang.split("-")[0].toLowerCase();
  const voices = window.speechSynthesis.getVoices();
  utterance.voice = voices.find((voice) => voice.lang.toLowerCase() === utterance.lang.toLowerCase())
    || voices.find((voice) => voice.lang.toLowerCase().startsWith(`${languagePrefix}-`))
    || null;
  utterance.rate = 0.92;
  utterance.pitch = 0.96;
  utterance.onstart = () => {
    stage.classList.add("is-speaking");
    stageReadout.textContent = t("waitingForAI");
    speechTimer = window.setTimeout(() => window.speechSynthesis.cancel(), maxSpeechDurationMs);
  };
  utterance.onend = () => {
    window.clearTimeout(speechTimer);
    stage.classList.remove("is-speaking");
    stageReadout.textContent = t("waiting");
  };
  window.speechSynthesis.speak(utterance);
}

function limitSpokenText(text) {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxSpokenWords) return text.trim();
  return `${words.slice(0, maxSpokenWords).join(" ").replace(/[.!?…]+$/, "")}…`;
}

function respond(text, shouldSpeak = false) {
  const reply = limitSpokenText(text);
  addMessage(preferences.assistantName, reply);
  setStatus(t("ready"));
  if (shouldSpeak) speak(reply);
}

async function askAI(message, shouldSpeak) {
  if (isThinking) return;
  isThinking = true;
  stage.classList.add("is-thinking");
  stageReadout.textContent = t("waitingForAI");
  setStatus(t("processingAI"));
  const sendButton = chatForm.querySelector("button[type='submit']");
  sendButton.disabled = true;
  micButton.disabled = true;
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(10_000),
      body: JSON.stringify({ message, history: aiHistory, assistantName: preferences.assistantName, userName: preferences.userName })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || t("emptyResponse"));
    const reply = limitSpokenText(result.reply);
    aiHistory.push({ role: "user", content: message }, { role: "assistant", content: reply });
    aiHistory = aiHistory.slice(-30);
    persistCurrentConversation();
    respond(reply, shouldSpeak);
  } catch (error) {
    respond(error.message || t("cannotConnect"), shouldSpeak);
  } finally {
    isThinking = false;
    stage.classList.remove("is-thinking");
    stageReadout.textContent = t("waiting");
    sendButton.disabled = false;
    micButton.disabled = !recognition;
  }
}

function calculateExpression(raw) {
  const normalized = raw.toLowerCase()
    .replace(/,/g, ".")
    .replace(/\b(mais|somar|plus|add|más|mas|sumar)\b/g, "+")
    .replace(/\b(menos|subtrair|minus|subtract|menos|restar)\b/g, "-")
    .replace(/\b(vezes|multiplicado por|times|multiplied by|por)\b/g, "*")
    .replace(/\b(dividido por|dividir por|divided by|divide by|entre)\b/g, "/")
    .replace(/\b(quanto é|quanto e|calcule|calcular|calcula|a conta|por favor|what is|calculate|cuánto es|cuanto es|calcula)\b/g, "")
    .replace(/x/g, "*").trim();
  if (!normalized || !/^[\d\s.+*/()%-]+$/.test(normalized)) return null;
  try {
    const result = Function(`"use strict"; return (${normalized})`)();
    return Number.isFinite(result) ? new Intl.NumberFormat(locales[currentLanguage], { maximumFractionDigits: 6 }).format(result) : null;
  } catch {
    return null;
  }
}

function getTimeGreeting() {
  const hour = new Date().getHours();
  const period = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  const defaultAddress = { pt: "senhor", en: "sir", es: "señor" }[currentLanguage];
  const address = preferences.userName || defaultAddress;
  const greetings = {
    pt: {
      morning: `Bom dia, ${address}. Como posso ajudar hoje?`,
      afternoon: `Boa tarde, ${address}. Como posso ajudar?`,
      evening: `Boa noite, ${address}. Como posso te ajudar?`
    },
    en: {
      morning: `Good morning, ${address}. How can I help you today?`,
      afternoon: `Good afternoon, ${address}. How can I help?`,
      evening: `Good evening, ${address}. How can I help you?`
    },
    es: {
      morning: `Buenos días, ${address}. ¿Cómo puedo ayudarte hoy?`,
      afternoon: `Buenas tardes, ${address}. ¿Cómo puedo ayudarte?`,
      evening: `Buenas noches, ${address}. ¿Cómo puedo ayudarte?`
    }
  };
  return greetings[currentLanguage][period];
}

function isJarvisGreeting(text) {
  const normalize = (value) => value.toLocaleLowerCase(locales[currentLanguage])
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const normalized = normalize(text);
  const assistantName = normalize(preferences.assistantName);
  const mentionedJarvis = normalized.split(" ").includes("jarvis") ||
    (assistantName && normalized.includes(assistantName));
  const greeting = /\b(opa|oi|ola|acorda|acordar|como voce esta|como esta voce|como vai|e ai|hello|hi|hey|wake up|how are you|hola|despierta|como estas)\b/.test(normalized);
  return mentionedJarvis && greeting;
}

function handleCommand(raw, shouldSpeak = false) {
  const command = raw.trim();
  if (!command) return;
  const normalized = command.toLocaleLowerCase(locales[currentLanguage]);
  const userLabel = { pt: "VOCÊ", en: "YOU", es: "TÚ" }[currentLanguage];
  addMessage(userLabel, command);
  if (isJarvisGreeting(command)) {
    respond(getTimeGreeting(), shouldSpeak);
    return;
  }
  if (/\b(que horas|horas são|hora agora|what time is it|what's the time|current time|qué hora es|que hora es|hora actual)\b/.test(normalized)) {
    respond(t("timeAnswer", new Intl.DateTimeFormat(locales[currentLanguage], { hour: "2-digit", minute: "2-digit" }).format(new Date())), shouldSpeak);
    return;
  }
  if (/\b(data de hoje|que dia é hoje|qual é a data|today's date|what day is it|what is the date|fecha de hoy|qué día es hoy|que dia es hoy)\b/.test(normalized)) {
    respond(t("dateAnswer", new Intl.DateTimeFormat(locales[currentLanguage], { dateStyle: "full" }).format(new Date())), shouldSpeak);
    return;
  }
  if (/\b(meus lembretes|quais são meus lembretes|listar lembretes|my reminders|list reminders|mis recordatorios|listar recordatorios)\b/.test(normalized)) {
    const active = reminders.filter((item) => !item.done);
    respond(t("remindersAnswer", active.length, active.map((item) => item.text).join("; ")), shouldSpeak);
    return;
  }
  if (/\b(lembre-me|me lembre|adicionar lembrete|anote|anotar|remind me|add reminder|note this|recuérdame|recuerdame|añadir recordatorio|agregar recordatorio|anota)\b/.test(normalized)) {
    const text = command.replace(/^.*?\b(?:lembre-me|me lembre|adicionar lembrete|anote|anotar|remind me|add reminder|note this|recuérdame|recuerdame|añadir recordatorio|agregar recordatorio|anota)\b\s*(?:de|para|que|to)?\s*/i, "");
    if (text && addReminder(text)) {
      respond(t("noted", text.replace(/[.!?]+$/, "")), shouldSpeak);
      persistCurrentConversation();
    } else {
      respond(t("whatToNote"), shouldSpeak);
    }
    return;
  }
  if (/\b(ajuda|o que você faz|comandos|help|what can you do|ayuda|qué puedes hacer|que puedes hacer)\b/.test(normalized)) {
    respond(t("help"), shouldSpeak);
    return;
  }
  const result = calculateExpression(command);
  if (result !== null) {
    respond(t("result", result), shouldSpeak);
    return;
  }
  void askAI(command, shouldSpeak);
}

function renderAccount() {
  document.querySelector("#account-name").textContent = account.name;
  document.querySelector("#account-email").textContent = account.email;
  document.querySelector("#account-country").textContent = countryName(account.country);
  document.querySelector("#account-language").textContent = t("languageName");
}

function initializeSpeechRecognition() {
  if (recognition) {
    recognition.lang = locales[currentLanguage];
    micButton.disabled = false;
    return;
  }
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    micButton.disabled = true;
    micButton.title = t("voiceUnavailable");
    micButton.setAttribute("aria-label", t("voiceUnavailable"));
    return;
  }
  recognition = new SpeechRecognition();
  recognition.lang = locales[currentLanguage];
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.onstart = () => {
    recognitionActive = true;
    micButton.setAttribute("aria-pressed", "true");
    stage.classList.add("is-listening");
    stageReadout.textContent = t("listening");
    setStatus(t("microphoneActive"));
  };
  recognition.onresult = (event) => handleCommand(event.results[0][0].transcript, true);
  recognition.onerror = () => respond(t("microphoneError"), false);
  recognition.onend = () => {
    recognitionActive = false;
    micButton.setAttribute("aria-pressed", "false");
    stage.classList.remove("is-listening");
    stageReadout.textContent = t("waiting");
    setStatus(t("ready"));
  };
  micButton.addEventListener("click", () => {
    try {
      recognition.start();
    } catch {
      recognition.stop();
    }
  });
}

function showAuthenticated(user) {
  account = user;
  authError.textContent = "";
  authScreen.classList.add("hidden");
  shell.classList.add("authenticated");
  accountPanel.classList.remove("open");
  applyLanguage(user.language);
  preferences = loadPreferences();
  reminders = loadReminders();
  conversations = loadConversations();
  currentConversation = conversations[0] || createConversation();
  aiHistory = currentConversation.messages.slice();
  if (!conversations.length) conversations = [currentConversation];
  applyPreferences();
  renderReminders();
  renderHistory();
  renderConversation();
  renderAccount();
  updateClock();
  if (!window.clockTimer) window.clockTimer = window.setInterval(updateClock, 1000);
  initializeSpeechRecognition();
}

async function requireLoginOnPageLoad() {
  try {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (!response.ok) throw new Error(t("cannotConnect"));
  } catch (error) {
    authError.textContent = t("cannotConnect");
  }
}

authCountrySelect.addEventListener("change", () => {
  if (!authCountrySelect.value) return;
  const selectedCountry = authCountrySelect.value;
  applyLanguage(languageForCountry(selectedCountry));
  authCountrySelect.value = selectedCountry;
});

document.querySelector("#auth-switch-btn").addEventListener("click", () => {
  authMode = authMode === "register" ? "login" : authMode === "login" ? "register" : "login";
  authError.textContent = "";
  authError.classList.remove("success");
  renderAuthMode();
});

document.querySelector("#auth-forgot-btn").addEventListener("click", () => {
  authMode = "forgot";
  authError.textContent = "";
  authError.classList.remove("success");
  document.querySelector("#auth-email").value = "";
  renderAuthMode();
});

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  authError.textContent = "";
  authError.classList.remove("success");
  authSubmit.disabled = true;
  try {
    if (authMode === "forgot") {
      const response = await fetch("/api/auth/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: document.querySelector("#auth-email").value.trim() })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || t("resetUnavailable"));
      authMode = "reset";
      authError.textContent = t("resetSent");
      authError.classList.add("success");
      renderAuthMode();
      return;
    }
    if (authMode === "reset") {
      const response = await fetch("/api/auth/password-reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: document.querySelector("#auth-email").value.trim(),
          code: document.querySelector("#auth-reset-code").value.trim(),
          password: document.querySelector("#auth-new-password").value
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || t("resetUnavailable"));
      authMode = "login";
      document.querySelector("#auth-password").value = "";
      document.querySelector("#auth-new-password").value = "";
      document.querySelector("#auth-reset-code").value = "";
      authError.textContent = t("resetSuccess");
      authError.classList.add("success");
      renderAuthMode();
      return;
    }
    const registering = authMode === "register";
    const response = await fetch(`/api/auth/${registering ? "register" : "login"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: authNameInput.value.trim(),
        email: authEmailInput.value.trim(),
        password: authPasswordInput.value,
        country: authCountrySelect.value
      })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || t("cannotConnect"));
    authPasswordInput.value = "";
    showAuthenticated(result.account);
  } catch (error) {
    authError.textContent = localizedAuthError(error.message || t("cannotConnect"));
  } finally {
    authSubmit.disabled = false;
  }
});

document.querySelector("#logout-btn").addEventListener("click", async () => {
  try {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (!response.ok) throw new Error();
    if (recognition && recognitionActive) recognition.stop();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    window.clearTimeout(speechTimer);
    account = null;
    shell.classList.remove("authenticated");
    authScreen.classList.remove("hidden");
    accountPanel.classList.remove("open");
    historyPanel.classList.remove("open");
    settingsPanel.classList.remove("open");
    authMode = "login";
    applyLanguage("pt");
    authError.textContent = t("accountSignedOut");
    authPasswordInput.value = "";
    renderAuthMode();
  } catch {
    authError.textContent = t("accountNetworkError");
  }
});

document.querySelector("#account-btn").addEventListener("click", () => {
  accountPanel.classList.toggle("open");
  historyPanel.classList.remove("open");
  settingsPanel.classList.remove("open");
});
document.querySelector("#close-account-btn").addEventListener("click", () => accountPanel.classList.remove("open"));
document.querySelector("#clear-history-btn").addEventListener("click", () => {
  if (!window.confirm(t("confirmDeleteHistory"))) return;
  conversations = [];
  currentConversation = createConversation();
  aiHistory = [];
  saveConversations();
  renderConversation();
  renderHistory();
});
document.querySelector("#history-btn").addEventListener("click", () => {
  historyPanel.classList.toggle("open");
  accountPanel.classList.remove("open");
  renderHistory();
});
document.querySelector("#close-history-btn").addEventListener("click", () => historyPanel.classList.remove("open"));

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  chatInput.value = "";
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    window.clearTimeout(speechTimer);
    stage.classList.remove("is-speaking");
    stageReadout.textContent = t("waiting");
  }
  handleCommand(text);
});

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = taskInput.value.trim();
  if (!text || !addReminder(text)) return;
  taskInput.value = "";
  respond(t("reminderAdded"), false);
});

document.querySelectorAll("[data-prompt]").forEach((button) => {
  button.addEventListener("click", () => handleCommand(button.dataset.prompt));
});

document.querySelector("#settings-btn").addEventListener("click", () => {
  colorInput.value = preferences.color;
  assistantNameInput.value = preferences.assistantName;
  userNameInput.value = preferences.userName;
  settingsPanel.classList.add("open");
  document.querySelector("#settings-btn").setAttribute("aria-expanded", "true");
  historyPanel.classList.remove("open");
  accountPanel.classList.remove("open");
});

document.querySelector("#close-settings-btn").addEventListener("click", () => {
  settingsPanel.classList.remove("open");
  document.querySelector("#settings-btn").setAttribute("aria-expanded", "false");
  applyColor(preferences.color);
});

colorInput.addEventListener("input", () => applyColor(colorInput.value));
assistantNameInput.addEventListener("input", () => assistantNameInput.setCustomValidity(""));
settingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const nextPreferences = {
    color: colorInput.value,
    assistantName: assistantNameInput.value.trim(),
    userName: userNameInput.value.trim()
  };
  if (!nextPreferences.assistantName) {
    assistantNameInput.setCustomValidity(t("invalidAssistantName"));
    assistantNameInput.reportValidity();
    assistantNameInput.focus();
    return;
  }
  if (!saveStored("preferences", nextPreferences)) return;
  preferences = nextPreferences;
  applyPreferences();
  renderConversation();
  settingsPanel.classList.remove("open");
  document.querySelector("#settings-btn").setAttribute("aria-expanded", "false");
});

document.querySelector("#new-chat-btn").addEventListener("click", () => {
  currentConversation = createConversation();
  aiHistory = [];
  conversations = [currentConversation, ...conversations.filter((item) => item.id !== currentConversation.id)].slice(0, 12);
  saveConversations();
  conversation.replaceChildren();
  addMessage(preferences.assistantName, translations[currentLanguage].newChatStarted(preferences.userName));
  historyPanel.classList.remove("open");
  accountPanel.classList.remove("open");
});

const navigatorLanguage = navigator.language.toLowerCase();
applyLanguage(navigatorLanguage.startsWith("es") ? "es" : navigatorLanguage.startsWith("en") ? "en" : "pt");
populateCountries();
renderAuthMode();
requireLoginOnPageLoad();
