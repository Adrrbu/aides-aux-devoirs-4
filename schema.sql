-- Désactiver temporairement RLS
ALTER TABLE IF EXISTS users DISABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes contraintes et triggers
DROP TRIGGER IF EXISTS validate_role_trigger ON users CASCADE;
DROP FUNCTION IF EXISTS validate_user_role() CASCADE;

-- Supprimer l'ancienne contrainte de rôle
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Mettre à jour les rôles existants de 'user' vers 'student'
UPDATE users SET role = 'student' WHERE role = 'user';

-- Ajouter la nouvelle contrainte de rôle
ALTER TABLE users ADD CONSTRAINT users_role_check 
CHECK (role IN ('student', 'parent'));

-- Créer la fonction de validation
CREATE OR REPLACE FUNCTION validate_user_role()
RETURNS trigger AS $$
BEGIN
  IF NEW.role NOT IN ('student', 'parent') THEN
    RAISE EXCEPTION 'Invalid role. Must be either "student" or "parent"';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger de validation
CREATE TRIGGER validate_role_trigger
  BEFORE INSERT OR UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION validate_user_role();

-- Réactiver RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Mettre à jour les politiques RLS
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);