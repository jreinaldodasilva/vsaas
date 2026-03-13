// migrate-mongo-config.js
const config = {
  mongodb: {
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017/vsaas',
    options: { useNewUrlParser: true, useUnifiedTopology: true },
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
  useFileHash: false,
  moduleSystem: 'commonjs',
};

module.exports = config;
