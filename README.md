# 🎓 JobEtudiant

Plateforme emploi dédiée aux étudiants malgaches — connecte étudiants et entreprises pour des stages, CDD et missions freelance.

**Stack : Next.js 16 · React 19 · PostgreSQL (Neon) · Prisma 7 · JWT · Tailwind CSS v4**

---

## 📋 Fonctionnalités

### Public

- **Landing page** — vitrine publique, inscription étudiant ou entreprise (`?role=`)
- **Thème clair / sombre** — toggle global (navbar, auth, landing)

### Espace Étudiant

- Inscription / Connexion / Mot de passe oublié
- **Accueil** — liens rapides vers les sections
- **Offres** — liste, recherche, filtre par domaine, photo entreprise sur chaque carte, postuler avec CV par défaut ou fichier personnalisé
- **Mes demandes** — historique des candidatures, statuts, **visionneuse PDF en modale**
- **Profil** — informations personnelles, **photo de profil** (upload + recadrage), **CV par défaut**, domaine, LinkedIn, portfolio
- **Notifications** — réponses aux candidatures, nouvelles offres par domaine, polling temps réel, toasts

### Espace Entreprise

- Inscription / Connexion / Mot de passe oublié
- **Dashboard** — statistiques (offres publiées, candidatures par statut)
- **Mes offres** — CRUD, activation/désactivation, **date de fin**, photo entreprise sur chaque carte
- **Boîte de réception** — candidatures avec **photo étudiant**, **CV en modale**, accepter / refuser
- **Profil entreprise** — informations, secteur, coordonnées, site web, **photo de profil**
- **Notifications** — nouvelles candidatures, polling temps réel

### Recommandation par domaine

Lorsqu'une entreprise publie une offre, les étudiants dont le **domaine** correspond reçoivent automatiquement une notification.

---

## 🚀 Installation

### Prérequis

- Node.js 18+
- Un compte **Neon.tech** (PostgreSQL gratuit en ligne)

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer la base de données (Neon)

1. Aller sur **https://neon.tech** → Sign up avec Google
2. **New Project** → nom `jobetudiants` → Create
3. Copier la **Connection string** affichée

### 3. Configurer le fichier `.env`

Créer un fichier `.env` à la racine (copier `.env.example`) :

```env
DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/jobetudiants"
JWT_SECRET="une-cle-secrete-longue-et-aleatoire"
NEXTAUTH_URL="http://localhost:3000"

# Email (optionnel - pour mot de passe oublié)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="votre-email@gmail.com"
SMTP_PASS="votre-app-password"
SMTP_FROM="JobEtudiant <no-reply@jobetudiants.mg>"
```

### 4. Synchroniser la base de données

```bash
npm run db:sync
```

Applique le schéma Prisma, régénère le client et remplit les dates de fin manquantes sur les offres existantes.

Alternative manuelle :

```bash
npx prisma db push
npx prisma generate
```

### 5. (Optionnel) Données de test

```bash
npm run seed
```

Crée deux comptes de test et 4 offres d'exemple :

- 📧 `etudiant@test.mg` / `password123`
- 📧 `entreprise@test.mg` / `password123`

### 6. Lancer l'application

```bash
npm run dev
# → http://localhost:3000
```

---

## 📁 Structure du projet

```
jobetudiants/
├── prisma/
│   ├── schema.prisma          # Modèles de données
│   ├── seed.ts                # Données de test
│   ├── backfill-datefin.ts    # Migration dateFin offres existantes
│   └── migrations/
├── prisma.config.ts           # Config Prisma 7 (datasource url)
├── connaissance.txt           # Documentation technique complète du système
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing ou redirect selon rôle
│   │   ├── layout.tsx         # Layout racine + Providers
│   │   ├── globals.css        # Tokens thème clair/sombre
│   │   ├── auth/              # login, register, forgot/reset password
│   │   ├── etudiant/          # accueil, metier, demandes, profil, notifications
│   │   ├── entreprise/        # dashboard, offres, reception, profil, notifications
│   │   └── api/
│   │       ├── auth/          # register, login, logout, me, forgot/reset
│   │       ├── offres/        # Offres publiques (étudiants)
│   │       ├── etudiant/      # candidatures, profil, avatar, cv
│   │       ├── entreprise/    # offres CRUD, candidatures, profil, avatar
│   │       ├── notifications/
│   │       ├── dashboard/
│   │       ├── avatars/       # Servir les photos de profil
│   │       └── cv/            # Servir les PDF (affichage inline)
│   ├── components/
│   │   ├── landing/           # LandingPage
│   │   ├── layout/            # Navbar, AuthThemeToggle
│   │   ├── profile/           # Avatar, CV, recadrage
│   │   ├── cv/                # PdfViewerModal
│   │   ├── notifications/     # NotificationsContent
│   │   └── ui/                # Button, Input, Alert, Toast, ThemeToggle
│   ├── providers/
│   │   ├── Providers.tsx      # Theme → Auth → Notifications
│   │   ├── AuthProvider.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── NotificationsProvider.tsx
│   ├── hooks/                 # useAuth, useTheme, useNotifications
│   ├── lib/                   # prisma, jwt, auth, avatar, cv, offre, notifications...
│   ├── proxy.ts               # Protection des routes (Next.js 16)
│   └── types/
├── public/
│   └── uploads/
│       ├── avatars/           # Photos de profil
│       └── cv/                # CV (profil + candidatures)
└── package.json
```

---

## 🗄️ Modèle de données

```
User ──────── Etudiant ──── Candidature ──── Offre ──── Entreprise
         └─── Entreprise                              └─── User
         └─── Notification
```

| Table          | Description |
| -------------- | ----------- |
| `User`         | Compte (email, password hashé, role, reset token) |
| `Etudiant`     | Profil étudiant (nom, domaine, avatarUrl, cvUrl, LinkedIn, portfolio…) |
| `Entreprise`   | Profil entreprise (nom, secteur, avatarUrl, adresse, site…) |
| `Offre`        | Offre d'emploi (titre, type, domaine, isActive, **dateFin**) |
| `Candidature`  | Lien étudiant ↔ offre (cvUrl, message, statut) — unique par paire |
| `Notification` | Notifications in-app pour les deux rôles |

**Statuts candidature :** `EN_ATTENTE` · `ACCEPTE` · `REFUSE`

---

## 🔐 Authentification

- JWT stocké en **cookie httpOnly** (sécurisé, non accessible en JS)
- Durée de vie : **7 jours**
- Protection des routes via `src/proxy.ts` (Next.js 16)
- `AuthProvider` côté client — navbar synchronisée après connexion
- Inscription avec rôle depuis la landing (`/auth/register?role=ETUDIANT|ENTREPRISE`)
- Reset password par email avec token cryptographique (1h de validité)

---

## 🛠️ Commandes utiles

```bash
npm run dev                          # Serveur de développement
npm run build                        # Build production
npm run start                        # Serveur production
npm run seed                         # Insérer les données de test
npm run db:sync                      # Schéma + generate + backfill dateFin
npx prisma db push                   # Appliquer le schéma en DB
npx prisma generate                  # Régénérer le client Prisma
npx prisma studio                    # Interface visuelle de la DB
```

---

## ⚠️ Points importants

### Prisma 7

Prisma 7 ne supporte plus `url = env("DATABASE_URL")` dans `schema.prisma`.
La connexion se configure dans `prisma.config.ts` via la propriété `datasource.url`.

### Next.js 16

Le fichier `middleware.ts` est déprécié. Il faut utiliser `proxy.ts` avec une fonction exportée nommée `proxy`.

### Upload fichiers

Les avatars et CV sont stockés localement dans `public/uploads/`.
Ils sont servis via les routes API `/api/avatars/[filename]` et `/api/cv/[filename]` (affichage PDF inline en modale).

En production, remplacer par un stockage cloud (S3, Cloudinary, etc.).

### Email

La fonctionnalité « mot de passe oublié » nécessite une configuration SMTP valide.
Pour Gmail, activer l'authentification à 2 facteurs et créer un **App Password**.

### Documentation technique

Voir **`connaissance.txt`** à la racine pour l'architecture détaillée, les flux métier et l'inventaire complet des fichiers.
