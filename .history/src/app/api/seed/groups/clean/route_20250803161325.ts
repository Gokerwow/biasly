import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

async function cleanupDuplicateGroups() {
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
            throw duplicateError;
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
            return {
                duplicatesFound: 0,
                duplicatesProcessed: 0,
                details: []
            };
        }
        
        const processedDetails = [];
        
        // 3. For each duplicate, update relationships to point to the first occurrence
        for (const duplicate of duplicateGroups) {
            const originalGroup = groupMap.get(duplicate.name);
            
            console.log(`Cleaning up duplicate: ${duplicate.name} (ID: ${duplicate.id} -> ${originalGroup.id})`);
            
            try {
                // Update idols_groups relationships
                const { error: updateError } = await supabase
                    .from('idols_groups')
                    .update({ group_id: originalGroup.id })
                    .eq('group_id', duplicate.id);
                    
                if (updateError) {
                    console.error(`Error updating relationships for ${duplicate.name}:`, updateError.message);
                    processedDetails.push({
                        name: duplicate.name,
                        duplicateId: duplicate.id,
                        originalId: originalGroup.id,
                        status: 'failed_update',
                        error: updateError.message
                    });
                    continue;
                }
                
                // Delete the duplicate group
                const { error: deleteError } = await supabase
                    .from('groups')
                    .delete()
                    .eq('id', duplicate.id);
                    
                if (deleteError) {
                    console.error(`Error deleting duplicate ${duplicate.name}:`, deleteError.message);
                    processedDetails.push({
                        name: duplicate.name,
                        duplicateId: duplicate.id,
                        originalId: originalGroup.id,
                        status: 'failed_delete',
                        error: deleteError.message
                    });
                } else {
                    console.log(`Successfully cleaned up duplicate: ${duplicate.name}`);
                    processedDetails.push({
                        name: duplicate.name,
                        duplicateId: duplicate.id,
                        originalId: originalGroup.id,
                        status: 'success'
                    });
                }
            } catch (error) {
                console.error(`Unexpected error processing ${duplicate.name}:`, error);
                processedDetails.push({
                    name: duplicate.name,
                    duplicateId: duplicate.id,
                    originalId: originalGroup.id,
                    status: 'error',
                    error: error.message
                });
            }
        }
        
        console.log("Cleanup completed!");
        return {
            duplicatesFound: duplicateGroups.length,
            duplicatesProcessed: processedDetails.filter(d => d.status === 'success').length,
            details: processedDetails
        };
        
    } catch (error) {
        console.error("Error during cleanup:", error);
        throw error;
    }
}

export async function POST() {
    try {
        const result = await cleanupDuplicateGroups();
        return NextResponse.json({
            message: "Cleanup completed successfully",
            ...result
        });
    } catch (error) {
        console.error("Cleanup failed:", error);
        return NextResponse.json({
            message: "Cleanup failed",
            error: error.message
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        const supabase = await createClient();
        
        // Just check for duplicates without cleaning
        const { data: groups, error } = await supabase
            .from('groups')
            .select('name, id')
            .order('name, id');
            
        if (error) {
            throw error;
        }
        
        const groupCounts = new Map();
        groups.forEach(group => {
            groupCounts.set(group.name, (groupCounts.get(group.name) || 0) + 1);
        });
        
        const duplicates = Array.from(groupCounts.entries())
            .filter(([name, count]) => count > 1)
            .map(([name, count]) => ({ name, count }));
            
        return NextResponse.json({
            message: "Duplicate check completed",
            totalGroups: groups.length,
            duplicateNames: duplicates.length,
            duplicates: duplicates
        });
    } catch (error) {
        return NextResponse.json({
            message: "Check failed",
            error: error.message
        }, { status: 500 });
    }
}