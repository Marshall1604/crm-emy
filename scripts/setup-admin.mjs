import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://drdvovguidtnotaiuvmz.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const ADMIN_EMAIL = 'www.junky3@yahoo.com';
const ADMIN_PASSWORD = 'Phanhong0407';

async function setupAdmin() {
  console.log(`Setting up Super Admin for: ${ADMIN_EMAIL}...`);

  try {
    // 1. Check if user already exists
    const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.error('Failed to list users:', listError);
      return;
    }

    let existingUser = usersData.users.find(
      (u) => u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
    );

    let userId;

    if (existingUser) {
      console.log(`User found (ID: ${existingUser.id}). Updating password and confirming email...`);
      userId = existingUser.id;
      const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
        password: ADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: 'Administrator' },
      });
      if (updateError) {
        console.error('Error updating user:', updateError);
      } else {
        console.log('User password updated and email confirmed.');
      }
    } else {
      console.log('Creating new user in Supabase Auth...');
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: 'Administrator' },
      });

      if (createError) {
        console.error('Error creating user:', createError);
        return;
      }
      userId = newUser.user.id;
      console.log(`User created successfully with ID: ${userId}`);
    }

    // 2. Upsert into public.profiles
    console.log('Ensuring profile in public.profiles...');
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: ADMIN_EMAIL,
        full_name: 'Administrator',
        status: 'active',
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      console.warn('Profile upsert note (table might not exist if SQL not run yet):', profileError.message);
    } else {
      console.log('Profile active in public.profiles.');
    }

    // 3. Assign super_admin role in public.user_roles
    console.log('Assigning super_admin role...');
    const { error: roleError } = await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        role_id: 'super_admin',
      });

    if (roleError) {
      console.warn('Role assign note:', roleError.message);
    } else {
      console.log('Role super_admin assigned.');
    }

    // 4. Assign lifetime subscription in public.subscriptions
    console.log('Assigning lifetime subscription...');
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
      console.warn('Subscription assign note:', subError.message);
    } else {
      console.log('Lifetime subscription granted.');
    }

    console.log('\n========================================');
    console.log('Super Admin setup successfully completed!');
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log('========================================\n');
  } catch (err) {
    console.error('Fatal error during setup:', err);
  }
}

setupAdmin();
