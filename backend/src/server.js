const app = require('./app');
const db = require('./database/models');

const PORT = process.env.PORT || 4000;

async function start() {
    try {
        await db.sequelize.authenticate();
        console.log('✅ Database connected.');

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('❌ Unable to start server:', err);
    }
}

start();
