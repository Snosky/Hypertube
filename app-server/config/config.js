module.exports = {
    // MongoDB settings
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost/hypertube',
    TOKEN_SECRET: process.env.TOKEN_SECRET || 'SUPER_SECRET',

    // OAuth
    FACEBOOK_SECRET: process.env.FACEBOOK_SECRET || 'b37c1a7ceeff5d5e71509a61201fbbb7',
    FORTYTWO_SECRET: process.env.FORTYTWO_SECRET || 'b3cd4e03ddae7999e8824ab168854c13a4f435ed98d16ee09c4b43945b15a0ef',

    // File download folder
    FOLDER_SAVE: '/tmp/hypertube/'
};
