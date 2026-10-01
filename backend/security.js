const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
];

function parseAllowedOrigins(value) {
  if (!value) return DEFAULT_ALLOWED_ORIGINS;
  return value
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);
}

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

function buildCorsOptions() {
  const allowedOrigins = parseAllowedOrigins(process.env.ALLOWED_ORIGINS);

  return {
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Origen no permitido por CORS.'));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
    maxAge: 600,
  };
}

function securityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
  );
  next();
}

function requireAdminToken(req, res, next) {
  const configuredToken = process.env.ADMIN_API_TOKEN;

  if (!configuredToken && !isProduction()) return next();
  if (!configuredToken) {
    return res.status(503).json({
      success: false,
      error: 'Panel administrativo no configurado.',
    });
  }

  const authorization = req.get('Authorization') || '';
  const expected = `Bearer ${configuredToken}`;
  if (authorization === expected) return next();

  return res.status(401).json({
    success: false,
    error: 'No autorizado.',
  });
}

function publicError(err) {
  if (!isProduction()) return err.message;
  if (err && err.type === 'entity.too.large') return 'Solicitud demasiado grande.';
  return 'No se pudo procesar la solicitud.';
}

function clientError(message) {
  return isProduction() ? 'Solicitud inválida.' : message;
}

module.exports = {
  buildCorsOptions,
  clientError,
  publicError,
  requireAdminToken,
  securityHeaders,
};
