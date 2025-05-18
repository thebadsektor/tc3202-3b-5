import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://bekuztmggtdqsnhwwdfo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJla3V6dG1nZ3RkcXNuaHd3ZGZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyODMyMzcsImV4cCI6MjA1ODg1OTIzN30.nIC3OEpK4PRVBMZwVvIROpjJ105Zgrf6IRpHDpMc45U";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
