"""
Django settings for SakthiDB (hard-coded values, no .env file).

On Render (RENDER is set automatically by Render) the PROD_* values are used.
On your own computer the local Postgres settings and DEBUG=True are used.
"""
import os
from pathlib import Path

import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

# ---------------------------------------------------------------------------
# 1. FILL THESE IN (production values, used only on Render)
# ---------------------------------------------------------------------------
PROD_DATABASE_URL = 'postgresql://neondb_owner:npg_lwVB9JGIEPh8@ep-nameless-breeze-b3yp8oqa-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
PROD_SECRET_KEY = 'AnkApQuDf4yXC4w5z3ARKi-P5f6Lmu2I3HBaB9nlnW7f6_A_VgAozrEJ2rYXaU_zKlo'
PROD_WEBSITE_URL = 'https://sakthidb-web.onrender.com'   # your website address, https, no "/" at the end
PROD_ADMIN_USERNAME = 'admin'
PROD_ADMIN_PASSWORD = 'admin'   # a long, strong password

# ---------------------------------------------------------------------------
# 2. Local development values (your computer)
# ---------------------------------------------------------------------------
LOCAL_SECRET_KEY = 'dev-only-insecure-key-do-not-use-in-production'
LOCAL_DB = {
    'NAME': 'sakthi_dba',
    'USER': 'postgres',
    'PASSWORD': 'postgres',   # change to your local Postgres password
    'HOST': '127.0.0.1',
    'PORT': '5432',
}

# ---------------------------------------------------------------------------
# Environment switch
# ---------------------------------------------------------------------------
ON_RENDER = bool(os.environ.get('RENDER'))

if ON_RENDER:
    for _name, _value in (
        ('PROD_DATABASE_URL', PROD_DATABASE_URL),
        ('PROD_ADMIN_PASSWORD', PROD_ADMIN_PASSWORD),
    ):
        if not _value or _value == 'CHANGE-ME':
            raise RuntimeError(f'{_name} is still CHANGE-ME in backend/config/settings.py')

DEBUG = not ON_RENDER
SECRET_KEY = PROD_SECRET_KEY if ON_RENDER else LOCAL_SECRET_KEY

ALLOWED_HOSTS = ['localhost', '127.0.0.1', '.onrender.com']

# ---------------------------------------------------------------------------
# Applications
# KEEP YOUR OWN APP NAMES in the "project apps" block if they differ.
# ---------------------------------------------------------------------------
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'accounts',
    'courses',
    'enrollments',
    'videos',
    'home',
    'labs',
    'interviews',
    'blogs',
    'dashboard',
    'technologies',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# ---------------------------------------------------------------------------
# Database
# ---------------------------------------------------------------------------
if ON_RENDER:
    DATABASES = {
        'default': dj_database_url.parse(
            PROD_DATABASE_URL, conn_max_age=600, ssl_require=True
        )
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            **LOCAL_DB,
        }
    }

if ON_RENDER:
    print('Using database host:', DATABASES['default'].get('HOST'))

# ---------------------------------------------------------------------------
# Auth / i18n
# ---------------------------------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_TZ = True

# ---------------------------------------------------------------------------
# Static files (WhiteNoise)
# ---------------------------------------------------------------------------
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STORAGES = {
    'default': {'BACKEND': 'django.core.files.storage.FileSystemStorage'},
    'staticfiles': {'BACKEND': 'whitenoise.storage.CompressedManifestStaticFilesStorage'},
}

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ---------------------------------------------------------------------------
# REST framework: read-only public API
# ---------------------------------------------------------------------------
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': ['rest_framework.permissions.AllowAny'],
}

# ---------------------------------------------------------------------------
# CORS / CSRF
# ---------------------------------------------------------------------------
if ON_RENDER:
    CORS_ALLOWED_ORIGINS = [PROD_WEBSITE_URL]
    CSRF_TRUSTED_ORIGINS = [PROD_WEBSITE_URL, 'https://*.onrender.com']
else:
    CORS_ALLOWED_ORIGINS = [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3000',
    ]
    CSRF_TRUSTED_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173']

# ---------------------------------------------------------------------------
# Production security
# ---------------------------------------------------------------------------
if ON_RENDER:
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True

LOGIN_URL = '/admin/login/'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {'class': 'logging.StreamHandler'},
    },
    'loggers': {
        'django.request': {
            'handlers': ['console'],
            'level': 'ERROR',
            'propagate': False,
        },
    },
}