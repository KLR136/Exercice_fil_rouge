// test.js
const sequelize = require('./config/database');
const { User, Video, Comment, Playlist, PlaylistVideo } = require('./models/associations');

async function testDatabase() {
  try {
    // 1. Test de connexion
    console.log('🔌 Test de connexion à la base de données...');
    await sequelize.authenticate();
    console.log('✅ Connexion à MySQL réussie !');

    // 2. Synchronisation des tables
    console.log('🗃️  Synchronisation des tables...');
    await sequelize.sync({ force: true }); // force: true recrée les tables
    console.log('✅ Tables synchronisées !');

    // 3. Création d'un utilisateur
    console.log('👤 Création d\'un utilisateur...');
    const user = await User.create({
      pseudo: 'test_user',
      email: 'test@example.com',
      registrationDate: new Date()
    });
    console.log('✅ Utilisateur créé:', user.toJSON());

    // 4. Création d'une vidéo
    console.log('🎥 Création d\'une vidéo...');
    const video = await Video.create({
      title: 'Tutoriel Sequelize Test',
      duration: 10,
      releaseDate: new Date('2024-01-15'),
      category: 'tutoriel'
    });
    console.log('✅ Vidéo créée:', video.toJSON());

    // 5. Création d'un commentaire
    console.log('💬 Création d\'un commentaire...');
    const comment = await Comment.create({
      text: 'Super tutoriel de test !',
      rating: 5,
      publicationDate: new Date(),
      userId: user.id,
      videoId: video.id
    });
    console.log('✅ Commentaire créé:', comment.toJSON());

    // 6. Création d'une playlist
    console.log('📝 Création d\'une playlist...');
    const playlist = await Playlist.create({
      name: 'Playlist de test',
      description: 'Ma playlist de test',
      userId: user.id
    });
    console.log('✅ Playlist créée:', playlist.toJSON());

    // 7. Ajout de la vidéo à la playlist
    console.log('➕ Ajout de la vidéo à la playlist...');
    const playlistVideo = await PlaylistVideo.create({
      playlistId: playlist.id,
      videoId: video.id,
      position: 1
    });
    console.log('✅ Vidéo ajoutée à la playlist:', playlistVideo.toJSON());

    // 8. Test des relations
    console.log('🔗 Test des relations...');
    
    // Récupérer l'utilisateur avec ses relations
    const userWithRelations = await User.findByPk(user.id, {
      include: [
        {
          model: Comment,
          as: 'comments',
          include: [{ model: Video, as: 'video' }]
        },
        {
          model: Playlist,
          as: 'playlists',
          include: [{
            model: Video,
            as: 'videos',
            through: { attributes: ['position'] }
          }]
        }
      ]
    });

    console.log('✅ Utilisateur avec relations:');
    console.log('- Pseudo:', userWithRelations.pseudo);
    console.log('- Nombre de commentaires:', userWithRelations.comments.length);
    console.log('- Nombre de playlists:', userWithRelations.playlists.length);
    
    if (userWithRelations.playlists.length > 0) {
      console.log('- Première playlist:', userWithRelations.playlists[0].name);
      console.log('- Nombre de vidéos dans la playlist:', userWithRelations.playlists[0].videos.length);
    }

    console.log('🎉 Tous les tests sont passés avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  } finally {
    // Fermer la connexion
    await sequelize.close();
    console.log('🔚 Connexion fermée.');
  }
}

// Lancer les tests
testDatabase();