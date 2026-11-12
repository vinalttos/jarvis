import "dotenv/config";
import { createServer } from "node:http";
import { createHmac, randomBytes, randomInt, randomUUID, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import nodemailer from "nodemailer";
import pg from "pg";

const port = Number(process.env.PORT) || 3001;
const geminiModel = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const bodyLimit = 20_000;
const sessionLifetime = 7 * 24 * 60 * 60;
const resetCodeLifetime = 10 * 60 * 1000;
const dataDirectory = process.env.DATA_DIR
  ? resolve(process.env.DATA_DIR)
  : fileURLToPath(new URL("./data/", import.meta.url));
const accountsFile = join(dataDirectory, "accounts.json");
const { Pool } = pg;
const database = process.env.DATABASE_URL
  ? new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: true },
    max: 5,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
  })
  : null;
const countryCodes = new Set("AW AF AO AI AX AL AD AE AR AM AS AQ TF AG AU AT AZ BI BE BJ BQ BF BD BG BH BS BA BL BY BZ BM BO BR BB BN BT BV BW CF CA CC CH CM CL CN CI CD CG CK CO KM CV CR CU CW CX KY CY CZ DE DJ DM DK DO DZ EC EG ER EH ES EE ET FI FJ FK FR FO FM GA GB GE GG GH GI GN GP GM GW GQ GR GT GD GL GF GU GY HK HM HN HR HT HU ID IM IN IO IE IR IQ IS IL IT JM JE JO JP KZ KE KG KH KI KN KR KW LA LB LR LY LC LI LK LS LT LU LV MO MF MA MC MD MG MV MX MH MK ML MT MM ME MN MP MZ MR MS MQ MU MW MY YT NA NC NE NF NG NI NU NL NO NP NR NZ OM PK PA PN PE PH PW PG PL PR KP PT PY PS PF QA RE RO RU RW SA SD SN SG GS SH SJ SB SL SV SM SO PM RS SS SE ST SR SK SI SZ SX SC SY TC TD TG TH TJ TK TM TL TO TT TN TR TV TW TZ UG UA UM UY US UZ VA VC VE VG VI VN VU WF WS YE ZA ZM ZW".split(" "));
const portugueseCountries = new Set("AO BR CV GW MO MZ PT ST TL".split(" "));
const spanishCountries = new Set("AR BO CL CO CR CU DO EC ES GQ GT HN MX NI PA PE PR PY SV UY VE".split(" "));
const scrypt = promisify(scryptCallback);
const sessions = new Map();
const authAttempts = new Map();
const passwordResets = new Map();
const resetAttempts = new Map();
const resetCodeSecret = randomBytes(32);
const mailTransport = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
  ? nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 8000,
  })
  : null;
const mailFrom = process.env.SMTP_FROM || process.env.SMTP_USER;
let accounts = database ? [] : await loadAccounts();
let accountWrite = Promise.resolve();

if (process.env.NODE_ENV === "production" && !database) {
  throw new Error("DATABASE_URL é obrigatório em produção para não perder as contas ao reiniciar.");
}

if (database) {
  await database.query(`
    CREATE TABLE IF NOT EXISTS jarvis_accounts (
      id UUID PRIMARY KEY,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      country CHAR(2) NOT NULL,
      language TEXT NOT NULL,
      salt TEXT NOT NULL,
      password_hash TEXT NOT NULL
    )
  `);
  await database.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS jarvis_accounts_username_unique
    ON jarvis_accounts (LOWER(username))
  `);
  accounts = await loadAccounts();
}

const systemPrompt = "Você é um assistente pessoal original, prestativo e confiável. Use um tom sereno, formal, preciso e cortês, com frases naturais e bem articuladas; não imite personagens existentes, vozes ou bordões conhecidos. Responda à pergunta do usuário com clareza; não diga que não sabe sem antes tentar ajudar. Não invente fatos: se a resposta depender de informação atual ou você não tiver certeza, informe isso brevemente. Nunca ultrapasse 20 linhas. Respeite as políticas de segurança e não afirme que executa ações reais no mundo físico.";

function languageForCountry(country) {
  if (portugueseCountries.has(country)) return "pt";
  if (spanishCountries.has(country)) return "es";
  return "en";
}

function localized(language, messages) {
  return messages[language] || messages.en;
}

async function loadAccounts() {
  if (database) {
    const result = await database.query(`
      SELECT id, username, email, country, language, salt, password_hash
      FROM jarvis_accounts
      ORDER BY email
    `);
    return result.rows.map((row) => ({
      id: row.id,
      name: row.username,
      username: row.username,
      email: row.email,
      country: row.country.trim(),
      language: row.language,
      salt: row.salt,
      passwordHash: row.password_hash,
    }));
  }
  try {
    const saved = JSON.parse(await readFile(accountsFile, "utf8"));
    if (!Array.isArray(saved)) throw new Error("O arquivo de contas está inválido.");
    return saved.filter((account) => account && typeof account.email === "string" && typeof account.passwordHash === "string");
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw new Error(`Não foi possível carregar as contas de ${accountsFile}: ${error.message}`, { cause: error });
  }
}

function saveAccounts() {
  const write = async () => {
    if (database) {
      const client = await database.connect();
      try {
        await client.query("BEGIN");
        for (const account of accounts) {
          await client.query(`
            INSERT INTO jarvis_accounts (id, username, email, country, language, salt, password_hash)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (id) DO UPDATE SET
              username = EXCLUDED.username,
              email = EXCLUDED.email,
              country = EXCLUDED.country,
              language = EXCLUDED.language,
              salt = EXCLUDED.salt,
              password_hash = EXCLUDED.password_hash
          `, [account.id, account.username || account.name, account.email, account.country, account.language, account.salt, account.passwordHash]);
        }
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
      return;
    }
    await mkdir(dataDirectory, { recursive: true, mode: 0o700 });
    const temporaryFile = join(dirname(accountsFile), `accounts-${randomUUID()}.tmp`);
    await writeFile(temporaryFile, JSON.stringify(accounts), { encoding: "utf8", mode: 0o600 });
    await rename(temporaryFile, accountsFile);
  };
  accountWrite = accountWrite.then(write, write);
  return accountWrite;
}

function sendJson(response, status, data, headers = {}) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...headers,
  });
  response.end(JSON.stringify(data));
}

function accountView(account) {
  return {
    id: account.id,
    name: account.username || account.name,
    email: account.email,
    country: account.country,
    language: account.language,
  };
}

function cookieOptions(request, maxAge) {
  const secure = request.socket.encrypted || request.headers["x-forwarded-proto"] === "https";
  return `HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${secure ? "; Secure" : ""}`;
}

function getSession(request) {
  const token = request.headers.cookie?.match(/(?:^|;\s*)jarvis_session=([a-f\d]+)/i)?.[1];
  if (!token) return null;
  const session = sessions.get(token);
  if (!session || session.expiresAt <= Date.now()) {
    sessions.delete(token);
    return null;
  }
  const account = accounts.find((item) => item.id === session.accountId);
  return account ? { token, account } : null;
}

function createSession(request, response, account) {
  const token = randomBytes(32).toString("hex");
  sessions.set(token, { accountId: account.id, expiresAt: Date.now() + sessionLifetime * 1000 });
  response.setHeader("Set-Cookie", `jarvis_session=${token}; ${cookieOptions(request, sessionLifetime)}`);
}

function allowAuthAttempt(request, response) {
  const ip = request.socket.remoteAddress || "unknown";
  const now = Date.now();
  const previous = authAttempts.get(ip);
  const attempt = previous && previous.expiresAt > now ? previous : { count: 0, expiresAt: now + 15 * 60 * 1000 };
  attempt.count += 1;
  authAttempts.set(ip, attempt);
  if (attempt.count <= 20) return true;
  sendJson(response, 429, { error: "Muitas tentativas. Aguarde alguns minutos e tente novamente." }, {
    "Retry-After": String(Math.ceil((attempt.expiresAt - now) / 1000)),
  });
  return false;
}

async function readJsonBody(request, response) {
  let rawBody = "";
  for await (const chunk of request) {
    rawBody += chunk;
    if (Buffer.byteLength(rawBody) > bodyLimit) {
      sendJson(response, 413, { error: "Mensagem muito longa." });
      return null;
    }
  }
  try {
    const body = JSON.parse(rawBody);
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error();
    return body;
  } catch {
    sendJson(response, 400, { error: "Corpo da requisição inválido." });
    return null;
  }
}

async function handleRegister(request, response) {
  if (!allowAuthAttempt(request, response)) return;
  const body = await readJsonBody(request, response);
  if (!body) return;
  const username = typeof body.username === "string" ? body.username.trim() : typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const country = typeof body.country === "string" ? body.country.toUpperCase() : "";
  if (!username || username.length > 60 || /[\u0000-\u001f\u007f]/.test(username)) {
    sendJson(response, 400, { error: "Informe um nome de usuário válido de até 60 caracteres." });
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    sendJson(response, 400, { error: "Informe um e-mail válido." });
    return;
  }
  if (password.length < 8 || password.length > 128) {
    sendJson(response, 400, { error: "A senha deve ter entre 8 e 128 caracteres." });
    return;
  }
  if (!countryCodes.has(country)) {
    sendJson(response, 400, { error: "Selecione um país válido." });
    return;
  }
  if (accounts.some((account) => account.email === email)) {
    sendJson(response, 409, { error: "Já existe uma conta com este e-mail." });
    return;
  }
  const normalizedUsername = username.toLocaleLowerCase();
  if (accounts.some((account) => (account.username || account.name || "").trim().toLocaleLowerCase() === normalizedUsername)) {
    sendJson(response, 409, { error: "Já existe uma conta com este nome de usuário." });
    return;
  }

  const salt = randomBytes(16);
  const passwordHash = (await scrypt(password, salt, 64)).toString("hex");
  if (accounts.some((existing) => existing.email === email)) {
    sendJson(response, 409, { error: "Já existe uma conta com este e-mail." });
    return;
  }
  if (accounts.some((existing) => (existing.username || existing.name || "").trim().toLocaleLowerCase() === normalizedUsername)) {
    sendJson(response, 409, { error: "Já existe uma conta com este nome de usuário." });
    return;
  }
  const account = {
    id: randomUUID(),
    name: username,
    username,
    email,
    country,
    language: languageForCountry(country),
    salt: salt.toString("hex"),
    passwordHash,
  };
  accounts.push(account);
  try {
    await saveAccounts();
  } catch (error) {
    accounts = accounts.filter((item) => item.id !== account.id);
    throw error;
  }
  createSession(request, response, account);
  sendJson(response, 201, { account: accountView(account) });
}

async function handleLogin(request, response) {
  if (!allowAuthAttempt(request, response)) return;
  const body = await readJsonBody(request, response);
  if (!body) return;
  const username = typeof body.username === "string" ? body.username.trim().toLocaleLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const account = accounts.find((item) =>
    (item.username || item.name || "").trim().toLocaleLowerCase() === username ||
    (!item.username && item.email === username)
  );
  if (!account || password.length > 128) {
    await scrypt(password.slice(0, 128), Buffer.alloc(16), 64);
    sendJson(response, 401, { error: "Nome de usuário ou senha incorretos." });
    return;
  }
  const actualHash = await scrypt(password, Buffer.from(account.salt, "hex"), 64);
  const expectedHash = Buffer.from(account.passwordHash, "hex");
  if (actualHash.length !== expectedHash.length || !timingSafeEqual(actualHash, expectedHash)) {
    sendJson(response, 401, { error: "Nome de usuário ou senha incorretos." });
    return;
  }
  createSession(request, response, account);
  sendJson(response, 200, { account: accountView(account) });
}

function hashResetCode(email, code) {
  return createHmac("sha256", resetCodeSecret).update(`${email}:${code}`).digest();
}

function allowResetAttempt(request, response) {
  const ip = request.socket.remoteAddress || "unknown";
  const now = Date.now();
  const previous = resetAttempts.get(ip);
  const attempt = previous && attemptWindowActive(previous, now)
    ? previous
    : { count: 0, expiresAt: now + 15 * 60 * 1000, lastRequestAt: 0 };
  if (attempt.count >= 5 || now - attempt.lastRequestAt < 30_000) {
    sendJson(response, 429, { error: "Aguarde antes de solicitar outro código." }, { "Retry-After": "30" });
    return false;
  }
  attempt.count += 1;
  attempt.lastRequestAt = now;
  resetAttempts.set(ip, attempt);
  return true;
}

function attemptWindowActive(attempt, now) {
  return attempt.expiresAt > now;
}

async function handlePasswordResetRequest(request, response) {
  if (!allowResetAttempt(request, response)) return;
  const body = await readJsonBody(request, response);
  if (!body) return;
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    sendJson(response, 400, { error: "Informe um e-mail válido." });
    return;
  }
  if (!mailTransport || !mailFrom) {
    sendJson(response, 503, { error: "A recuperação de senha por e-mail não está configurada neste servidor." });
    return;
  }
  const account = accounts.find((item) => item.email === email);
  if (account) {
    const code = randomIntCode();
    passwordResets.set(email, {
      accountId: account.id,
      codeHash: hashResetCode(email, code),
      expiresAt: Date.now() + resetCodeLifetime,
      attempts: 0,
      processing: false,
    });
    const language = account.language;
    const mailText = localized(language, {
      pt: `Seu código para criar uma nova senha do JARVIS é: ${code}\n\nEle expira em 10 minutos. Se você não solicitou esta alteração, ignore este e-mail.`,
      en: `Your JARVIS password reset code is: ${code}\n\nIt expires in 10 minutes. If you did not request this change, you can ignore this email.`,
      es: `Tu código para cambiar la contraseña de JARVIS es: ${code}\n\nCaduca en 10 minutos. Si no solicitaste este cambio, ignora este correo.`,
    });
    try {
      await mailTransport.sendMail({
        from: mailFrom,
        to: account.email,
        subject: localized(language, { pt: "Código para redefinir sua senha do JARVIS", en: "Your JARVIS password reset code", es: "Código para restablecer tu contraseña de JARVIS" }),
        text: mailText,
      });
    } catch (error) {
      passwordResets.delete(email);
      console.error("Falha ao enviar e-mail de recuperação:", error.message);
      sendJson(response, 503, { error: "Não foi possível enviar o código agora. Tente novamente mais tarde." });
      return;
    }
  }
  sendJson(response, 200, {
    message: "Se o e-mail estiver cadastrado, enviaremos um código de recuperação.",
  });
}

function randomIntCode() {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

async function handlePasswordResetConfirm(request, response) {
  const body = await readJsonBody(request, response);
  if (!body) return;
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const code = typeof body.code === "string" ? body.code.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^\d{6}$/.test(code)) {
    sendJson(response, 400, { error: "Código ou e-mail inválido." });
    return;
  }
  if (password.length < 8 || password.length > 128) {
    sendJson(response, 400, { error: "A senha deve ter entre 8 e 128 caracteres." });
    return;
  }
  const reset = passwordResets.get(email);
  if (!reset || reset.expiresAt <= Date.now() || reset.processing) {
    if (reset?.expiresAt <= Date.now()) passwordResets.delete(email);
    sendJson(response, 400, { error: "Código inválido ou expirado. Solicite outro código." });
    return;
  }
  reset.attempts += 1;
  if (reset.attempts > 5) {
    passwordResets.delete(email);
    sendJson(response, 400, { error: "Limite de tentativas atingido. Solicite outro código." });
    return;
  }
  const submittedHash = hashResetCode(email, code);
  if (!timingSafeEqual(reset.codeHash, submittedHash)) {
    sendJson(response, 400, { error: "Código inválido ou expirado. Solicite outro código." });
    return;
  }
  const account = accounts.find((item) => item.id === reset.accountId && item.email === email);
  if (!account) {
    passwordResets.delete(email);
    sendJson(response, 400, { error: "Código inválido ou expirado. Solicite outro código." });
    return;
  }
  reset.processing = true;
  const previousSalt = account.salt;
  const previousHash = account.passwordHash;
  const salt = randomBytes(16);
  account.salt = salt.toString("hex");
  account.passwordHash = (await scrypt(password, salt, 64)).toString("hex");
  try {
    await saveAccounts();
  } catch (error) {
    account.salt = previousSalt;
    account.passwordHash = previousHash;
    reset.processing = false;
    throw error;
  }
  passwordResets.delete(email);
  for (const [token, session] of sessions) {
    if (session.accountId === account.id) sessions.delete(token);
  }
  sendJson(response, 200, { message: "Senha alterada. Entre com sua nova senha." });
}

function decodeHtml(text) {
  return text.replace(/&(?:amp|lt|gt|quot|#39|nbsp);|&#(\d+);|&#x([\da-f]+);/gi, (entity, decimal, hex) => {
    if (decimal) return String.fromCodePoint(Number(decimal));
    if (hex) return String.fromCodePoint(parseInt(hex, 16));
    return { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": "\"", "&#39;": "'", "&nbsp;": " " }[entity.toLowerCase()] || entity;
  });
}

function stripHtml(text) {
  return decodeHtml(text.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim());
}

function extractSearchResults(html) {
  const results = [];
  const pattern = /<a[^>]*class="[^"]*result__a[^"]*"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<(?:a|div)[^>]*class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/(?:a|div)>/gi;
  for (const match of html.matchAll(pattern)) {
    const title = stripHtml(match[2]);
    const snippet = stripHtml(match[3]);
    let url = decodeHtml(match[1]);
    try {
      const parsed = new URL(url, "https://duckduckgo.com");
      url = parsed.searchParams.get("uddg") ? decodeURIComponent(parsed.searchParams.get("uddg")) : parsed.href;
    } catch {
      continue;
    }
    if (title && snippet && /^https?:\/\//i.test(url)) results.push({ title, snippet, url });
    if (results.length === 5) break;
  }
  return results;
}

async function searchOnce(query, language) {
  try {
    const url = new URL("https://html.duckduckgo.com/html/");
    url.searchParams.set("q", query);
    url.searchParams.set("kl", { pt: "br-pt", en: "us-en", es: "es-es" }[language] || "wt-wt");
    const response = await fetch(url, {
      headers: { "User-Agent": "JarvisAssistant/1.0" },
      signal: AbortSignal.timeout(2500),
    });
    if (!response.ok) {
      console.error(`Busca web respondeu HTTP ${response.status}.`);
      return { results: [], failed: true };
    }
    return { results: extractSearchResults(await response.text()), failed: false };
  } catch (error) {
    console.error("Falha na busca web:", error.message);
    return { results: [], failed: true };
  }
}

function searchReply(search, language) {
  if (search.failed) {
    return localized(language, {
      pt: "O Gemini está indisponível e não consegui acessar a busca na web. Tente novamente em instantes.",
      en: "Gemini is unavailable and I couldn't access web search. Please try again shortly.",
      es: "Gemini no está disponible y no pude acceder a la búsqueda web. Inténtalo de nuevo en unos instantes.",
    });
  }
  if (!search.results.length) {
    return localized(language, {
      pt: "Pesquisei na web, mas não encontrei resultados úteis para essa pergunta.",
      en: "I searched the web but couldn't find useful results for that question.",
      es: "Busqué en la web, pero no encontré resultados útiles para esa pregunta.",
    });
  }
  const heading = localized(language, {
    pt: "Encontrei estas informações na web:",
    en: "I found this information on the web:",
    es: "Encontré esta información en la web:",
  });
  return [heading, ...search.results.map((item, index) => `${index + 1}. ${item.title}: ${item.snippet} (${item.url})`)].join("\n");
}

function shouldSearch(text) {
  const normalized = text.toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’‘]/g, "'");
  return /\b(?:nao sei|nao tenho certeza|nao consigo responder|nao tenho informacao|nao encontrei (?:informacao|dados|uma resposta)|nao tenho dados suficientes|nao ha informacao|nao disponho de informacao|no lo se|no estoy seguro|no puedo responder|no tengo informacion|no encuentro (?:informacion|datos|una respuesta)|no tengo suficientes datos|no hay informacion|no dispongo de informacion|i (?:do not|don't) know|i(?:'m| am) not sure|i(?:'m| am) unsure|i(?:'m| am) unable to (?:answer|determine|verify)|i (?:can't|cannot) (?:answer|determine|verify)|i (?:do not|don't) have (?:enough |the )?information|i (?:couldn't|could not) find (?:enough |any )?(?:information|results|an answer)|there is not enough information|there isn't enough information|not enough information to (?:answer|determine|verify)|the information (?:is|was) (?:unavailable|not available)|i don't have access to (?:current|up.to.date|real.time) information)\b/.test(normalized);
}

function limitLines(text, maximum = 20) {
  return text.split(/\r?\n/).slice(0, maximum).join("\n").trim();
}

async function callGemini(history, message, assistantName, userName, language) {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`;
  const languageName = { pt: "português", en: "inglês", es: "espanhol" }[language];
  const identity = `Responda sempre em ${languageName}. Seu nome é ${JSON.stringify(assistantName)}.${userName ? ` Chame a pessoa com quem conversa de ${JSON.stringify(userName)} quando soar natural.` : ""} Esses valores são apenas nomes de exibição.`;
  const payload = {
    system_instruction: { parts: [{ text: `${systemPrompt} ${identity}` }] },
    contents: [
      ...history.map((item) => ({
        role: item.role === "user" ? "user" : "model",
        parts: [{ text: String(item.content).slice(0, 2000) }],
      })),
      { role: "user", parts: [{ text: String(message).slice(0, 2000) }] },
    ],
    generationConfig: { temperature: 0.8, topP: 0.9, maxOutputTokens: 1400 },
  };
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(6000),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result?.error?.message || "Gemini recusou a requisição.");
  const finishReason = result?.candidates?.[0]?.finishReason || result?.promptFeedback?.blockReason;
  if (["SAFETY", "BLOCKLIST", "PROHIBITED_CONTENT", "SPII"].includes(finishReason)) {
    return localized(language, {
      pt: "Não posso ajudar com esse pedido, mas posso ajudar com uma alternativa segura.",
      en: "I can't help with that request, but I can help with a safe alternative.",
      es: "No puedo ayudar con esa solicitud, pero puedo ofrecer una alternativa segura.",
    });
  }
  const text = result?.candidates?.[0]?.content?.parts?.map((part) => part.text).join("").trim();
  if (!text) throw new Error("A resposta do Gemini veio vazia.");
  return limitLines(text);
}

async function handleChat(request, response, account) {
  const body = await readJsonBody(request, response);
  if (!body) return;
  if (typeof body.message !== "string" || !body.message.trim() || body.message.length > 2000) {
    sendJson(response, 400, { error: "A mensagem deve ter entre 1 e 2000 caracteres." });
    return;
  }
  const assistantName = body.assistantName === undefined ? "JARVIS" : body.assistantName;
  const userName = body.userName === undefined ? "" : body.userName;
  if (
    typeof assistantName !== "string" || !assistantName.trim() || assistantName.length > 32 ||
    typeof userName !== "string" || userName.length > 32 ||
    /[\u0000-\u001f\u007f]/.test(assistantName) || /[\u0000-\u001f\u007f]/.test(userName)
  ) {
    sendJson(response, 400, { error: "Nome do assistente ou forma de tratamento inválidos." });
    return;
  }
  const history = Array.isArray(body.history) ? body.history.slice(-12) : [];
  if (history.some((item) => !item || !["user", "assistant"].includes(item.role) || typeof item.content !== "string" || item.content.length > 2000)) {
    sendJson(response, 400, { error: "Histórico de conversa inválido." });
    return;
  }

  let reply;
  try {
    if (!geminiApiKey) throw new Error("Chave do Gemini não configurada.");
    reply = await callGemini(history, body.message.trim(), assistantName.trim(), userName.trim(), account.language);
  } catch (error) {
    console.error("Falha ao consultar o Gemini:", error.message);
    const search = await searchOnce(body.message.trim(), account.language);
    sendJson(response, 200, { reply: limitLines(searchReply(search, account.language)), source: "web" });
    return;
  }
  if (shouldSearch(reply)) {
    const search = await searchOnce(body.message.trim(), account.language);
    sendJson(response, 200, { reply: limitLines(searchReply(search, account.language)), source: "web" });
    return;
  }
  sendJson(response, 200, { reply, source: "gemini" });
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, "http://localhost");
    if (request.method === "POST" && url.pathname === "/api/auth/register") {
      await handleRegister(request, response);
      return;
    }
    if (request.method === "POST" && url.pathname === "/api/auth/login") {
      await handleLogin(request, response);
      return;
    }
    if (request.method === "POST" && url.pathname === "/api/auth/password-reset/request") {
      await handlePasswordResetRequest(request, response);
      return;
    }
    if (request.method === "POST" && url.pathname === "/api/auth/password-reset/confirm") {
      await handlePasswordResetConfirm(request, response);
      return;
    }
    if (request.method === "POST" && url.pathname === "/api/auth/logout") {
      const session = getSession(request);
      if (session) sessions.delete(session.token);
      response.setHeader("Set-Cookie", `jarvis_session=; ${cookieOptions(request, 0)}`);
      sendJson(response, 200, { ok: true });
      return;
    }
    if (request.method === "GET" && url.pathname === "/healthz") {
      if (database) await database.query("SELECT 1");
      sendJson(response, 200, { ok: true });
      return;
    }
    if (request.method === "GET" && url.pathname === "/api/auth/me") {
      const session = getSession(request);
      if (!session) {
        sendJson(response, 401, { error: "Entre na sua conta para continuar." });
        return;
      }
      sendJson(response, 200, { account: accountView(session.account) });
      return;
    }
    if (request.method === "POST" && url.pathname === "/api/chat") {
      const session = getSession(request);
      if (!session) {
        sendJson(response, 401, { error: "Entre na sua conta para conversar." });
        return;
      }
      await handleChat(request, response, session.account);
      return;
    }
    if (request.method === "GET" && ["/", "/index.html"].includes(url.pathname)) {
      const page = await readFile(new URL("./index.html", import.meta.url));
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
      response.end(page);
      return;
    }
    if (request.method === "GET" && url.pathname === "/app.js") {
      const script = await readFile(new URL("./app.js", import.meta.url));
      response.writeHead(200, { "Content-Type": "text/javascript; charset=utf-8", "Cache-Control": "no-store" });
      response.end(script);
      return;
    }
    sendJson(response, 404, { error: "Rota não encontrada." });
  } catch (error) {
    console.error("Falha ao processar requisição:", error.message);
    if (!response.headersSent) sendJson(response, 500, { error: "Erro interno do servidor." });
    else response.end();
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`JARVIS disponível em http://localhost:${port}`);
});
