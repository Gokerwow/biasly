import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Debug version to see what's actually happening
export async function GET() {
    try {
        const supabase = await createClient();
        
        console.log("=== DEBUGGING GROUPS TABLE ===");
        
        // 1. Get total groups count
        const { data: allGroups, error: allError } = await supabase
            .from('groups')
            .select('id, name')
            .order('name, id');
            
        if (allError) {
            throw allError;
        }
        
        console.log(`Total groups in database: ${allGroups.length}`);
        
        // 2. Find duplicates with detailed info
        const groupMap = new Map();
        const duplicateDetails = [];
        
        allGroups.forEach(group => {
            if (groupMap.has(group.name)) {
                // This is a duplicate
                const existing = groupMap.get(group.name);
                duplicateDetails.push({
                    name: group.name,
                    originalId: existing.id,
                    duplicateId: group.id,
                    ids: [existing.id, group.id]
                });
                // Update the map to include both IDs
                groupMap.set(group.name, {
                    ...existing,
                    allIds: [...(existing.allIds || [existing.id]), group.id]
                });
            } else {
                groupMap.set(group.name, { ...group, allIds: [group.id] });
            }
        });
        
        console.log(`Duplicate groups found: ${duplicateDetails.length}`);
        
        // 3. Check relationships for these duplicates
        const relationshipCheck = [];
        for (const duplicate of duplicateDetails.slice(0, 5)) { // Check first 5 for debug
            const { data: relations, error: relError } = await supabase
                .from('idols_groups')
                .select('idol_id, group_id')
                .eq('group_id', duplicate.duplicateId);
                
            if (!relError && relations) {
                relationshipCheck.push({
                    groupName: duplicate.name,
                    duplicateId: duplicate.duplicateId,
                    relationshipsCount: relations.length,
                    relationships: relations
                });
            }
        }
        
        // 4. Sample of duplicate names
        const duplicateNames = [...new Set(duplicateDetails.map(d => d.name))].slice(0, 10);
        
        return NextResponse.json({
            message: "Debug information",
            totalGroups: allGroups.length,
            uniqueGroupNames: groupMap.size,
            duplicatesFound: duplicateDetails.length,
            sampleDuplicateNames: duplicateNames,
            relationshipCheck: relationshipCheck,
            firstFewDuplicates: duplicateDetails.slice(0, 5)
        });
        
    } catch (error) {
        console.error("Debug failed:", error);
        return NextResponse.json({
            message: "Debug failed",
            error: error.message
        }, { status: 500 });
    }
}

// Improved cleanup with better logging and error handling
export async function POST() {
    try {
        const supabase = await createClient();
        
        console.log("=== STARTING IMPROVED CLEANUP ===");
        
        // 1. Get all groups with detailed info
        const { data: allGroups, error: allError } = await supabase
            .from('groups')
            .select('id, name, created_at')
            .order('name, created_at, id'); // Order by creation time, then ID
            
        if (allError) {
            throw allError;
        }
        
        console.log(`Total groups before cleanup: ${allGroups.length}`);
        
        // 2. Group by name and identify duplicates (keep the oldest one)
        const groupsByName = new Map();
        const duplicatesToDelete = [];
        
        allGroups.forEach(group => {
            if (groupsByName.has(group.name)) {
                // This is a duplicate, mark for deletion
                duplicatesToDelete.push(group);
            } else {
                // This is the first (oldest) occurrence, keep it
                groupsByName.set(group.name, group);
            }
        });
        
        console.log(`Duplicates to process: ${duplicatesToDelete.length}`);
        
        if (duplicatesToDelete.length === 0) {
            return NextResponse.json({
                message: "No duplicates found",
                totalGroups: allGroups.length,
                duplicatesProcessed: 0
            });
        }
        
        const processResults = [];
        let successCount = 0;
        
        // 3. Process each duplicate individually with detailed logging
        for (let i = 0; i < duplicatesToDelete.length; i++) {
            const duplicate = duplicatesToDelete[i];
            const original = groupsByName.get(duplicate.name);
            
            console.log(`Processing ${i + 1}/${duplicatesToDelete.length}: ${duplicate.name} (${duplicate.id} -> ${original.id})`);
            
            try {
                // Step 1: Check if there are any relationships to update
                const { data: existingRelations, error: checkError } = await supabase
                    .from('idols_groups')
                    .select('idol_id')
                    .eq('group_id', duplicate.id);
                
                if (checkError) {
                    throw new Error(`Check relations failed: ${checkError.message}`);
                }
                
                console.log(`  - Found ${existingRelations?.length || 0} relationships to update`);
                
                // Step 2: Update relationships if any exist
                if (existingRelations && existingRelations.length > 0) {
                    const { error: updateError } = await supabase
                        .from('idols_groups')
                        .update({ group_id: original.id })
                        .eq('group_id', duplicate.id);
                    
                    if (updateError) {
                        throw new Error(`Update relations failed: ${updateError.message}`);
                    }
                    
                    console.log(`  - Updated ${existingRelations.length} relationships`);
                }
                
                // Step 3: Delete the duplicate group
                const { error: deleteError, data: deletedData } = await supabase
                    .from('groups')
                    .delete()
                    .eq('id', duplicate.id)
                    .select();
                
                if (deleteError) {
                    throw new Error(`Delete failed: ${deleteError.message}`);
                }
                
                if (!deletedData || deletedData.length === 0) {
                    throw new Error('Delete returned no data - group might not exist');
                }
                
                console.log(`  - Successfully deleted group ${duplicate.id}`);
                successCount++;
                
                processResults.push({
                    name: duplicate.name,
                    duplicateId: duplicate.id,
                    originalId: original.id,
                    relationshipsUpdated: existingRelations?.length || 0,
                    status: 'success'
                });
                
            } catch (error) {
                console.error(`  - Error processing ${duplicate.name}:`, error.message);
                processResults.push({
                    name: duplicate.name,
                    duplicateId: duplicate.id,
                    originalId: original.id,
                    status: 'failed',
                    error: error.message
                });
            }
            
            // Small delay to prevent overwhelming the database
            if (i % 10 === 0 && i > 0) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        
        // 4. Final verification
        const { data: finalGroups, error: finalError } = await supabase
            .from('groups')
            .select('id, name')
            .order('name');
            
        const finalCount = finalGroups?.length || 0;
        const finalUniqueNames = finalGroups ? new Set(finalGroups.map(g => g.name)).size : 0;
        
        console.log(`=== CLEANUP COMPLETED ===`);
        console.log(`Groups after cleanup: ${finalCount}`);
        console.log(`Unique group names: ${finalUniqueNames}`);
        console.log(`Successfully processed: ${successCount}/${duplicatesToDelete.length}`);
        
        return NextResponse.json({
            message: "Cleanup completed",
            before: {
                totalGroups: allGroups.length,
                uniqueNames: groupsByName.size
            },
            after: {
                totalGroups: finalCount,
                uniqueNames: finalUniqueNames
            },
            processed: {
                duplicatesFound: duplicatesToDelete.length,
                successfullyProcessed: successCount,
                failed: duplicatesToDelete.length - successCount
            },
            details: processResults.slice(0, 20) // Show first 20 for brevity
        });
        
    } catch (error) {
        console.error("Cleanup failed:", error);
        return NextResponse.json({
            message: "Cleanup failed",
            error: error.message
        }, { status: 500 });
    }
}

// New endpoint to add unique constraint
export async function PUT() {
    try {
        const supabase = await createClient();
        
        // Add unique constraint using raw SQL
        const { error } = await supabase.rpc('add_unique_constraint', {
            table_name: 'groups',
            column_name: 'name',
            constraint_name: 'groups_name_unique'
        });
        
        if (error) {
            // Try alternative approach if RPC doesn't work
            const { error: altError } = await supabase
                .from('groups')
                .select('id')
                .limit(1); // This is just to test connection
                
            return NextResponse.json({
                message: "Cannot add constraint via API. Please run this SQL manually in Supabase:",
                sql: "ALTER TABLE groups ADD CONSTRAINT groups_name_unique UNIQUE (name);",
                error: error.message
            });
        }
        
        return NextResponse.json({
            message: "Unique constraint added successfully"
        });
        
    } catch (error) {
        return NextResponse.json({
            message: "Failed to add constraint",
            error: error.message,
            suggestion: "Please run this SQL manually in Supabase: ALTER TABLE groups ADD CONSTRAINT groups_name_unique UNIQUE (name);"
        }, { status: 500 });
    }
}