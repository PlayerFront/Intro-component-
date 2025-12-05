import { createClient } from '@supabase/supabase-js';
import { success } from 'zod';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase keys not found in .env file');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const realAuthService = {
  async login (credentials) {
    try {
      const {data, error} = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
        emailRedirectTo: `${window.location.origin}?language=en`,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }
      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          firstName: data.user.user_metadata?.firstName || 'User',
        },
        message: 'Login Successful',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Network error',
      };
    }
  },

  async register(userData) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            firstName: userData.firstName,
            lastName: userData.lastName,
          },
          emailRedirectTo: `${window.location.origin}?language=en`,
        },
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
        },
        message: 'Registration successful!',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Network error',
      };
    }
  },
};