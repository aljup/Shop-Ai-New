
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fbthbfqaaciwaxnfrvgp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZidGhiZnFhYWNpd2F4bmZydmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5ODEzNjUsImV4cCI6MjA1NTU1NzM2NX0.HXxV6VGwrsGTSky1qipx2Owm8ITcF6IqIOBYolrT9pk'

export const supabase = createClient(supabaseUrl, supabaseKey)
