-- Check for all triggers in the database
SELECT 
    t.tgname as trigger_name,
    n.nspname as schema_name,
    c.relname as table_name,
    p.proname as function_name,
    pg_get_triggerdef(t.oid) as trigger_definition
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE n.nspname IN ('auth', 'public')
AND t.tgname NOT LIKE 'pg_%'
ORDER BY n.nspname, c.relname, t.tgname;

-- Check for all functions that might be related to user creation
SELECT 
    p.proname as function_name,
    n.nspname as schema_name,
    pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE (p.proname LIKE '%user%' OR p.proname LIKE '%wallet%')
AND n.nspname IN ('auth', 'public');
