import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.CRM_ADMIN_EMAIL;
const adminPassword = process.env.CRM_ADMIN_PASSWORD;
const adminName = process.env.CRM_ADMIN_NAME || 'Super Administrator';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Configuration Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
  console.error('Usage: NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... CRM_ADMIN_EMAIL=... CRM_ADMIN_PASSWORD=... node scripts/setup-admin.mjs');
  process.exit(1);
}

if (!adminEmail || !adminPassword) {
  console.error('❌ Security Error: CRM_ADMIN_EMAIL and CRM_ADMIN_PASSWORD environment variables must be provided.');
  console.error('Never hard-code administrative credentials in source files.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function setupAdmin() {
  console.log(`🔐 Initiating secure Super Admin provisioning for: ${adminEmail}...`);

  try {
    // 1. Check if user already exists
    const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.error('❌ Failed to query users via Supabase Admin API:', listError.message);
      process.exit(1);
    }

    let existingUser = usersData.users.find(
      (u) => u.email?.toLowerCase() === adminEmail.toLowerCase()
    );

    let userId;

    if (existingUser) {
      console.log(`✓ Existing user record found (ID: ${existingUser.id}). Updating credentials...`);
      userId = existingUser.id;
      const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
        password: adminPassword,
        email_confirm: true,
        user_metadata: { full_name: adminName },
      });
      if (updateError) {
        console.error('❌ Error updating user authentication record:', updateError.message);
        process.exit(1);
      }
      console.log('✓ User password updated and email verified.');
    } else {
      console.log('✓ Creating new user in Supabase Auth...');
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: { full_name: adminName },
      });

      if (createError) {
        console.error('❌ Error creating user:', createError.message);
        process.exit(1);
      }
      userId = newUser.user.id;
      console.log(`✓ User created successfully with ID: ${userId}`);
    }

    // 2. Upsert into public.profiles
    console.log('✓ Syncing profile to public.profiles...');
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: adminEmail,
        full_name: adminName,
        status: 'active',
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      console.warn('⚠️ Profile upsert warning (verify schema migration is applied):', profileError.message);
    } else {
      console.log('✓ Profile active in public.profiles.');
    }

    // 3. Assign super_admin role in public.user_roles
    console.log('✓ Assigning super_admin role in public.user_roles...');
    const { error: roleError } = await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        role_id: 'super_admin',
      });

    if (roleError) {
      console.warn('⚠️ Role assign warning:', roleError.message);
    } else {
      console.log('✓ Role super_admin granted.');
    }

    // 4. Assign lifetime subscription in public.subscriptions
    console.log('✓ Granting lifetime administrative license...');
    const { error: subError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        plan: 'lifetime',
        status: 'active',
        start_date: new Date().toISOString(),
        expire_date: null,
        lifetime: true,
        auto_renew: false,
        payment_provider: 'manual',
        amount: 0,
      });

    if (subError) {
      console.warn('⚠️ Subscription assignment warning:', subError.message);
    } else {
      console.log('✓ Lifetime administrative license active.');
    }

    console.log('\n======================================================');
    console.log('✅ Super Admin setup successfully completed!');
    console.log(`Target Email: ${adminEmail}`);
    console.log('Password has been securely applied and is not logged.');
    console.log('======================================================\n');
  } catch (err) {
    console.error('❌ Fatal error during admin setup:', err);
    process.exit(1);
  }
}

setupAdmin();
