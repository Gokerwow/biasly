import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
    try {
        const supabase = await createClient();
        
        console.log("=== CHECKING EMPTY/INVALID GROUP NAMES ===");
        
        // Check for various types of invalid group names
        const { data: allGroups, error } = await supabase
            .from('groups')
            .select('id, name')
            .order('id');
            
        if (error) throw error;
        
        const analysis = {
            total: allGroups.length,
            empty: 0,
            whitespaceOnly: 0,
            null: 0,
            valid: 0,
            samples: {
                empty: [],
                whitespaceOnly: [],
                null: [],
                valid: []
            }
        };
        
        allGroups.forEach(group => {
            if (group.name === null) {
                analysis.null++;
                if (analysis.samples.null.length < 5) {
                    analysis.samples.null.push(group);
                }
            } else if (group.name === '') {
                analysis.empty++;
                if (analysis.samples.empty.length < 5) {
                    analysis.samples.empty.push(group);
                }
            } else if (group.name.trim() === '') {
                analysis.whitespaceOnly++;
                if (analysis.samples.whitespaceOnly.length < 5) {
                    analysis.samples.whitespaceOnly.push(group);
                }
            } else {
                analysis.valid++;
                if (analysis.samples.valid.length < 5) {
                    analysis.samples.valid.push(group);
                }
            }
        });
        
        return NextResponse.json({
            message: "Group analysis completed",
            analysis: analysis
        });
        
    } catch (error) {
        return NextResponse.json({
            message: "Analysis failed",
            error: error.message
        }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        const supabase = await createClient();
        
        console.log("=== CLEANING UP EMPTY GROUP NAMES ===");
        
        // Step 1: Get all relationships that point to empty groups
        const { data: emptyGroups, error: emptyError } = await supabase
            .from('groups')
            .select('id, name')
            .or('name.is.null,name.eq.');
            
        if (emptyError) throw emptyError;
        
        console.log(`Found ${emptyGroups.length} empty/null group names`);
        
        if (emptyGroups.length === 0) {
            return NextResponse.json({
                message: "No empty groups found",
                deleted: 0
            });
        }
        
        const emptyGroupIds = emptyGroups.map(g => g.id);
        
        // Step 2: Delete relationships that point to empty groups
        const { error: deleteRelationsError, data: deletedRelations } = await supabase
            .from('idols_groups')
            .delete()
            .in('group_id', emptyGroupIds)
            .select();
            
        if (deleteRelationsError) {
            console.error('Error deleting relations:', deleteRelationsError.message);
        }
        
        console.log(`Deleted ${deletedRelations?.length || 0} relationships pointing to empty groups`);
        
        // Step 3: Delete empty groups
        const { error: deleteGroupsError, data: deletedGroups } = await supabase
            .from('groups')
            .delete()
            .or('name.is.null,name.eq.')
            .select();
            
        if (deleteGroupsError) {
            throw deleteGroupsError;
        }
        
        console.log(`Deleted ${deletedGroups?.length || 0} empty groups`);
        
        // Step 4: Final verification
        const { data: finalGroups, error: finalError } = await supabase
            .from('groups')
            .select('id, name')
            .order('name');
            
        const finalStats = {
            totalGroups: finalGroups?.length || 0,
            uniqueNames: finalGroups ? new Set(finalGroups.map(g => g.name)).size : 0
        };
        
        return NextResponse.json({
            message: "Empty groups cleanup completed",
            before: {
                emptyGroups: emptyGroups.length,
                emptyGroupIds: emptyGroupIds
            },
            deleted: {
                relationships: deletedRelations?.length || 0,
                groups: deletedGroups?.length || 0
            },
            after: finalStats
        });
        
    } catch (error) {
        console.error("Cleanup failed:", error);
        return NextResponse.json({
            message: "Cleanup failed",
            error: error.message
        }, { status: 500 });
    }
}

export async function POST() {
    try {
        const supabase = await createClient();
        
        console.log("=== FIXING GROUP PARSING ISSUE ===");
        
        // This endpoint helps identify which idols created empty groups
        // so we can fix the parsing logic
        
        const { data: recentIdols, error } = await supabase
            .from('idols')
            .select('id, name, stage_name')
            .order('id', { ascending: false })
            .limit(100); // Check recent 100 idols
            
        if (error) throw error;
        
        const problemIdols = [];
        
        // Check which idols have relationships with empty groups
        for (const idol of recentIdols) {
            const { data: relations, error: relError } = await supabase
                .from('idols_groups')
                .select(`
                    group_id,
                    groups!inner(id, name)
                `)
                .eq('idol_id', idol.id);
                
            if (!relError && relations) {
                const emptyGroupRelations = relations.filter(r => 
                    !r.groups.name || r.groups.name.trim() === ''
                );
                
                if (emptyGroupRelations.length > 0) {
                    problemIdols.push({
                        idol: idol,
                        emptyGroups: emptyGroupRelations.length,
                        totalGroups: relations.length
                    });
                }
            }
        }
        
        return NextResponse.json({
            message: "Problem idol analysis completed",
            recentIdolsChecked: recentIdols.length,
            problemIdols: problemIdols,
            suggestion: "These idols might have caused empty group creation. Check their source pages for parsing issues."
        });
        
    } catch (error) {
        return NextResponse.json({
            message: "Analysis failed",
            error: error.message
        }, { status: 500 });
    }
}