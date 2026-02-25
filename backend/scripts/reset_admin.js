const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Database URI from .env
const MONGODB_URI = 'mongodb+srv://admin:desighee123@cluster0.6ico8sf.mongodb.net/rizwans-desi-ghee?retryWrites=true&w=majority&appName=Cluster0';

const AdminSchema = new mongoose.Schema({
    email: String,
    password: String,
    role: String,
    isActive: Boolean
});

const Admin = mongoose.model('Admin', AdminSchema);

async function resetAdmin() {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const email = 'admin@rizwansdesighee.com';
        const newPassword = 'rizwanadmin123';

        console.log(`🔍 Searching for admin: ${email}`);
        let admin = await Admin.findOne({ email: email.toLowerCase() });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        if (admin) {
            console.log('📝 Updating existing admin password...');
            admin.password = hashedPassword;
            admin.role = 'superadmin'; // Ensure it has superadmin access
            admin.isActive = true;
            await admin.save();
            console.log('✅ Admin password updated successfully');
        } else {
            console.log('📝 Creating new admin user...');
            admin = new Admin({
                email: email.toLowerCase(),
                password: hashedPassword,
                role: 'superadmin',
                isActive: true
            });
            await admin.save();
            console.log('✅ Admin user created successfully');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

resetAdmin();
