export async function cleanupDuplicateGroups() {
    try {
        const supabase = await createClient();
        
        console.log("Starting cleanup of duplicate groups...");
        
        // 1. Find all duplicate group names
        const { data: duplicates, error: duplicateError } = await supabase
            .from('groups')
            .select('name, id')
            .order('name, id');
            
        if (duplicateError) {
            console.error('Error fetching groups:', duplicateError.message);
            return;
        }
        
        // 2. Group by name and identify duplicates
        const groupMap = new Map();
        const duplicateGroups = [];
        
        duplicates.forEach(group => {
            if (groupMap.has(group.name)) {
                // This is a duplicate
                duplicateGroups.push(group);
            } else {
                // This is the first occurrence, keep it
                groupMap.set(group.name, group);
            }
        });
        
        console.log(`Found ${duplicateGroups.length} duplicate groups to clean up`);
        
        if (duplicateGroups.length === 0) {
            console.log("No duplicates found!");
            return;
        }
        
        // 3. For each duplicate, update relationships to point to the first occurrence
        for (const duplicate of duplicateGroups) {
            const originalGroup = groupMap.get(duplicate.name);
            
            console.log(`Cleaning up duplicate: ${duplicate.name} (ID: ${duplicate.id} -> ${originalGroup.id})`);
            
            // Update idols_groups relationships
            const { error: updateError } = await supabase
                .from('idols_groups')
                .update({ group_id: originalGroup.id })
                .eq('group_id', duplicate.id);
                
            if (updateError) {
                console.error(`Error updating relationships for ${duplicate.name}:`, updateError.message);
                continue;
            }
            
            // Delete the duplicate group
            const { error: deleteError } = await supabase
                .from('groups')
                .delete()
                .eq('id', duplicate.id);
                
            if (deleteError) {
                console.error(`Error deleting duplicate ${duplicate.name}:`, deleteError.message);
            } else {
                console.log(`Successfully cleaned up duplicate: ${duplicate.name}`);
            }
        }
        
        console.log("Cleanup completed!");
        return {
            duplicatesFound: duplicateGroups.length,
            duplicatesProcessed: duplicateGroups.length
        };
        
    } catch (error) {
        console.error("Error during cleanup:", error);
        throw error;
    }
}