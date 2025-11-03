const { Sequelize, DataTypes, Op } = require('sequelize');

// Configuration de la base de données
const sequelize = new Sequelize('video_platform', 'root', 'AdriNatami08', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

// -------------------- EXERCICE 1 : MODÈLES --------------------

// Modèle User
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  pseudo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  registrationDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'users',
  timestamps: false
});

// Modèle Video
const Video = sequelize.define('Video', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  releaseDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('documentaire', 'fiction', 'tutoriel', 'autre'),
    allowNull: false
  }
}, {
  tableName: 'videos',
  timestamps: false
});

// Modèle Comment
const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  publicationDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'comments',
  timestamps: false
});

// Modèle Playlist
const Playlist = sequelize.define('Playlist', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'playlists',
  timestamps: false
});

// Modèle PlaylistVideo (table de liaison)
const PlaylistVideo = sequelize.define('PlaylistVideo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'playlist_videos',
  timestamps: false
});

// Définition des relations
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Video.hasMany(Comment, { foreignKey: 'videoId', as: 'comments' });
Comment.belongsTo(Video, { foreignKey: 'videoId', as: 'video' });

User.hasMany(Playlist, { foreignKey: 'userId', as: 'playlists' });
Playlist.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Playlist.belongsToMany(Video, { 
  through: PlaylistVideo, 
  foreignKey: 'playlistId', 
  otherKey: 'videoId', 
  as: 'videos' 
});

Video.belongsToMany(Playlist, { 
  through: PlaylistVideo, 
  foreignKey: 'videoId', 
  otherKey: 'playlistId', 
  as: 'playlists' 
});

// -------------------- FONCTIONS DES EXERCICES --------------------

// Exercice 2 : Vidéos documentaires > 45 minutes
async function exercice2() {
  console.log('\n🎬 EXERCICE 2');
  console.log('Vidéos "Documentaire" de plus de 45 minutes, triées par durée décroissante');
  console.log('======================================================================\n');

  try {
    const videos = await Video.findAll({
      where: {
        category: 'documentaire',
        duration: { [Op.gt]: 45 }
      },
      attributes: ['title', 'duration'],
      order: [['duration', 'DESC']]
    });

    if (videos.length === 0) {
      console.log('Aucune vidéo trouvée.');
    } else {
      videos.forEach((video, index) => {
        console.log(`${index + 1}. "${video.title}" - ${video.duration} minutes`);
      });
    }
    
    return videos;
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Exercice 3 : Utilisateurs inscrits depuis moins de 6 mois
async function exercice3() {
  console.log('\n👤 EXERCICE 3');
  console.log('Utilisateurs inscrits depuis moins de 6 mois');
  console.log('===========================================\n');

  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const users = await User.findAll({
      where: {
        registrationDate: { [Op.gte]: sixMonthsAgo }
      },
      attributes: ['pseudo', 'registrationDate'],
      order: [['registrationDate', 'DESC']]
    });

    if (users.length === 0) {
      console.log('Aucun utilisateur trouvé.');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.pseudo} - Inscrit le ${user.registrationDate.toLocaleDateString()}`);
      });
    }
    
    return users;
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Exercice 4 : Commentaires de la vidéo ID 1
async function exercice4() {
  console.log('\n💬 EXERCICE 4');
  console.log('Commentaires de la vidéo ID 1 triés par note décroissante');
  console.log('========================================================\n');

  try {
    const comments = await Comment.findAll({
      where: { videoId: 1 },
      include: [{
        model: User,
        as: 'user',
        attributes: ['pseudo']
      }],
      attributes: ['rating', 'text', 'publicationDate'],
      order: [['rating', 'DESC']]
    });

    if (comments.length === 0) {
      console.log('Aucun commentaire trouvé pour cette vidéo.');
    } else {
      comments.forEach((comment, index) => {
        console.log(`${index + 1}. ${comment.user.pseudo} - ${comment.rating}★`);
        console.log(`   "${comment.text}"`);
        console.log(`   Publié le ${comment.publicationDate.toLocaleDateString()}\n`);
      });
    }
    
    return comments;
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Exercice 5 : Playlists de l'utilisateur ID 1
async function exercice5() {
  console.log('\n📝 EXERCICE 5');
  console.log("Playlists de l\\'utilisateur ID 1 avec statistiques");
  console.log('================================================\n');

  try {
    const playlists = await Playlist.findAll({
      where: { userId: 1 },
      include: [{
        model: Video,
        as: 'videos',
        attributes: ['duration'],
        through: { attributes: [] } // Ne pas inclure les attributs de la table de liaison
      }],
      attributes: ['id', 'name', 'description']
    });

    if (playlists.length === 0) {
      console.log('Aucune playlist trouvée pour cet utilisateur.');
    } else {
      for (const playlist of playlists) {
        const videoCount = playlist.videos.length;
        const totalDuration = playlist.videos.reduce((sum, video) => sum + video.duration, 0);
        
        console.log(`🎵 "${playlist.name}"`);
        console.log(`   📝 Description: ${playlist.description || 'Aucune description'}`);
        console.log(`   📊 Nombre de vidéos: ${videoCount}`);
        console.log(`   ⏱️  Durée totale: ${totalDuration} minutes`);
        console.log(`   📺 Vidéos: ${playlist.videos.map(v => v.duration + 'min').join(', ')}`);
        console.log('   ──────────────────────────────────────────');
      }
    }
    
    return playlists;
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// -------------------- DONNÉES DE TEST --------------------

async function createTestData() {
  console.log('📝 Création des données de test...\n');
  
  // Utilisateurs
  await User.bulkCreate([
    { pseudo: 'john_doe', email: 'john@example.com', registrationDate: new Date('2024-01-15') },
    { pseudo: 'marie_dupont', email: 'marie@example.com', registrationDate: new Date('2023-06-01') }, // Inscrite il y a plus de 6 mois
    { pseudo: 'pierre_martin', email: 'pierre@example.com', registrationDate: new Date('2024-02-01') },
    { pseudo: 'sophie_leroy', email: 'sophie@example.com', registrationDate: new Date('2023-12-10') }
  ]);

  // Vidéos
  await Video.bulkCreate([
    { title: 'Les Mystères de l\'Océan', duration: 120, releaseDate: new Date('2023-05-15'), category: 'documentaire' },
    { title: 'Introduction à la Programmation', duration: 45, releaseDate: new Date('2024-01-10'), category: 'tutoriel' },
    { title: 'Les Civilisations Anciennes', duration: 90, releaseDate: new Date('2023-11-20'), category: 'documentaire' },
    { title: 'La Vie Sauvage en Afrique', duration: 50, releaseDate: new Date('2024-02-01'), category: 'documentaire' },
    { title: 'Court Métrage Expérimental', duration: 25, releaseDate: new Date('2023-12-05'), category: 'fiction' },
    { title: 'Les Secrets de l\'Univers', duration: 180, releaseDate: new Date('2023-08-30'), category: 'documentaire' }
  ]);

  // Commentaires
  await Comment.bulkCreate([
    { text: 'Super documentaire !', rating: 5, videoId: 1, userId: 1 },
    { text: 'Très instructif', rating: 4, videoId: 1, userId: 2 },
    { text: 'Un peu long mais intéressant', rating: 3, videoId: 1, userId: 3 },
    { text: 'Excellent tutoriel', rating: 5, videoId: 2, userId: 1 }
  ]);

  // Playlists
  await Playlist.bulkCreate([
    { name: 'Mes documentaires préférés', description: 'Une sélection de mes documentaires favoris', userId: 1 },
    { name: 'Tutoriels à regarder', description: 'Liste des tutoriels que je veux apprendre', userId: 1 },
    { name: 'Films du weekend', description: null, userId: 2 }
  ]);

  // Vidéos dans les playlists
  await PlaylistVideo.bulkCreate([
    { playlistId: 1, videoId: 1, position: 1 },
    { playlistId: 1, videoId: 3, position: 2 },
    { playlistId: 1, videoId: 6, position: 3 },
    { playlistId: 2, videoId: 2, position: 1 },
    { playlistId: 3, videoId: 5, position: 1 }
  ]);

  console.log('✅ Données de test créées !');
}

// -------------------- EXÉCUTION PRINCIPALE --------------------

async function main() {
  try {
    // Connexion à la base de données
    await sequelize.authenticate();
    console.log('🔌 Connexion à la base de données réussie !');

    // Synchronisation des tables
    await sequelize.sync({ force: true });
    console.log('🗃️  Tables synchronisées !');

    // Création des données de test
    await createTestData();

    // Exécution des exercices
    await exercice2();
    await exercice3();
    await exercice4();
    await exercice5();

    console.log('\n🎉 TOUS LES EXERCICES SONT TERMINÉS !');

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  } finally {
    await sequelize.close();
    console.log('\n🔚 Connexion fermée.');
  }
}

// Lancer l'application
main();