

export const EnvConfiguration = () => ({
    environment: process.env.NODE_ENV || 'dev',
    mongo_db: process.env.MONGO_DB,
    prot: process.env.PORT || 3001,
    defaultLimit: +process.env.DEFAULT_LIMIT || 15,
})