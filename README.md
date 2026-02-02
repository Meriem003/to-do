# 📝 Todo App - Application de Gestion de Tâches

Une application moderne et puissante de gestion de tâches construite avec **Next.js 14**, **TypeScript**, et **Tailwind CSS**.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)

---

## 🚀 Fonctionnalités

### ✅ Gestion des Tâches
- **Créer, modifier, supprimer** des tâches
- **Sous-tâches** pour décomposer les tâches complexes
- **Priorités** : Basse, Moyenne, Haute, Urgente
- **Statuts** : À faire, En cours, Terminé
- **Tags** et **catégories** personnalisables
- **Dates d'échéance** avec alertes visuelles

### 📊 Vues Multiples
| Vue | Description |
|-----|-------------|
| **Dashboard** | Vue d'ensemble avec statistiques |
| **Aujourd'hui** | Tâches du jour + en retard |
| **À venir** | Tâches futures planifiées |
| **Toutes** | Liste complète des tâches |
| **Kanban** | Organisation par colonnes de statut |
| **Calendrier** | Vue mensuelle des tâches |
| **Statistiques** | Graphiques de productivité |

### 🎨 Interface Utilisateur
- **Thème sombre/clair** avec mode système
- **Design responsive** (mobile, tablette, desktop)
- **Sidebar** rétractable
- **Animations** fluides

---

## 📁 Structure du Projet

```
to-do/
├── app/                    # Routes Next.js (App Router)
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Page d'accueil (redirection)
│   ├── dashboard/         # Tableau de bord
│   ├── today/             # Tâches du jour
│   ├── upcoming/          # Tâches à venir
│   ├── all/               # Toutes les tâches
│   ├── completed/         # Tâches terminées
│   ├── kanban/            # Vue Kanban
│   ├── calendar/          # Vue Calendrier
│   ├── statistics/        # Statistiques
│   └── settings/          # Paramètres
│
├── components/            # Composants React
│   ├── ui/               # Composants UI réutilisables (shadcn/ui)
│   ├── app-layout.tsx    # Layout de l'application
│   ├── app-sidebar.tsx   # Barre latérale
│   ├── task-card.tsx     # Carte de tâche
│   ├── task-list.tsx     # Liste de tâches
│   ├── task-dialog.tsx   # Modal d'édition de tâche
│   ├── quick-add-task.tsx # Ajout rapide de tâche
│   ├── kanban-column.tsx # Colonne Kanban
│   └── calendar-view.tsx # Vue calendrier
│
├── lib/                   # Utilitaires et logique métier
│   ├── store.ts          # Store Zustand (état global)
│   ├── types.ts          # Types TypeScript
│   ├── utils.ts          # Utilitaires généraux
│   └── utils/
│       └── task-utils.ts # Utilitaires pour les tâches
│
├── hooks/                 # Hooks personnalisés
│   ├── use-mobile.ts     # Détection mobile
│   └── use-toast.ts      # Notifications toast
│
└── styles/               # Styles globaux
    └── globals.css       # CSS global avec Tailwind
```

---

## 🛠️ Technologies Utilisées

### Frontend
- **[Next.js 14](https://nextjs.org/)** - Framework React avec App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Typage statique
- **[Tailwind CSS](https://tailwindcss.com/)** - Styles utilitaires
- **[shadcn/ui](https://ui.shadcn.com/)** - Composants UI

### État & Données
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Gestion d'état simple et performante
- **LocalStorage** - Persistance des données

### UI/UX
- **[Lucide React](https://lucide.dev/)** - Icônes
- **[Radix UI](https://www.radix-ui.com/)** - Composants accessibles
- **[Recharts](https://recharts.org/)** - Graphiques
- **[date-fns](https://date-fns.org/)** - Manipulation de dates

---

## ⚡ Installation

### Prérequis
- Node.js 18+ 
- pnpm (recommandé) ou npm

### Étapes

```bash
# 1. Cloner le projet
git clone <url-du-repo>
cd to-do

# 2. Installer les dépendances
pnpm install

# 3. Lancer en mode développement
pnpm dev

# 4. Ouvrir dans le navigateur
# http://localhost:3000
```

---

## 📜 Scripts Disponibles

| Commande | Description |
|----------|-------------|
| `pnpm dev` | Lance le serveur de développement |
| `pnpm build` | Compile l'application pour la production |
| `pnpm start` | Lance le serveur de production |
| `pnpm lint` | Vérifie le code avec ESLint |

---

## 🗂️ Modèles de Données

### Task (Tâche)
```typescript
interface Task {
  id: string              // Identifiant unique
  title: string           // Titre de la tâche
  description?: string    // Description optionnelle
  status: TaskStatus      // 'todo' | 'in-progress' | 'completed'
  priority: Priority      // 'low' | 'medium' | 'high' | 'urgent'
  dueDate?: Date         // Date d'échéance
  categoryId?: string    // Catégorie associée
  tags: string[]         // Liste de tags
  subTasks: SubTask[]    // Sous-tâches
  archived: boolean      // Archivée ou non
  createdAt: Date        // Date de création
  updatedAt: Date        // Date de modification
  completedAt?: Date     // Date de complétion
}
```

### Category (Catégorie)
```typescript
interface Category {
  id: string      // Identifiant unique
  name: string    // Nom de la catégorie
  color: string   // Couleur (hex)
  icon?: string   // Emoji optionnel
}
```

---

## 🎯 Fonctionnement du Store

L'application utilise **Zustand** pour la gestion d'état avec persistance automatique dans le localStorage.

### Actions principales :
- `addTask()` - Ajouter une tâche
- `updateTask()` - Modifier une tâche
- `deleteTask()` - Supprimer une tâche
- `toggleTaskComplete()` - Basculer le statut terminé
- `duplicateTask()` - Dupliquer une tâche
- `archiveTask()` - Archiver une tâche

---

## 🎨 Personnalisation

### Thème
Le thème peut être modifié dans **Paramètres** :
- 🌞 Mode clair
- 🌙 Mode sombre  
- 💻 Mode système (automatique)

### Catégories par défaut
- 💼 Work (Travail) - Bleu
- 🏠 Personal (Personnel) - Vert
- 🛒 Shopping (Courses) - Orange
- ❤️ Health (Santé) - Rouge

---

## 📱 Responsive Design

L'application s'adapte à tous les écrans :
- **Mobile** : Sidebar en mode overlay
- **Tablette** : Sidebar rétractable
- **Desktop** : Sidebar visible en permanence

---

## 🔮 Améliorations Futures

- [ ] Authentification utilisateur
- [ ] Synchronisation cloud
- [ ] Mode Pomodoro intégré
- [ ] Notifications push
- [ ] Export PDF/CSV
- [ ] Drag & Drop Kanban
- [ ] Récurrence des tâches
- [ ] Collaboration en équipe

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

## 👨‍💻 Auteur

Développé avec ❤️ pour la gestion efficace des tâches quotidiennes.

---

<p align="center">
  <strong>⭐ N'hésitez pas à mettre une étoile si ce projet vous a été utile !</strong>
</p>
