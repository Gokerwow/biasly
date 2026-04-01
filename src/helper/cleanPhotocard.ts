/* eslint-disable @typescript-eslint/no-explicit-any */
import { CleanPhotocard } from "@/types";
import { BrowseRelease } from "@/types/release";

export function mapToCleanPhotocard(rawCard: any): CleanPhotocard {
    // Destructure: pull out the fields you want to RENAME or TRANSFORM
    const {
        groups,
        releases,
        distribution_types,
        photocards_idol,
        photocards_modifiers_global,
        ...rest
    } = rawCard;

    return {
        ...rest,
        // Now add the renamed/transformed fields
        group: groups,
        releases: releases,
        distribution_type: distribution_types,
        idols: photocards_idol
            ?.map((p: any) => p.idol)
            .filter(Boolean) ?? [],
        physical_types_global: photocards_modifiers_global
            ?.map((p: any) => p.global_modifier)
            .filter(Boolean) ?? []
    };
}

export function mapToCleanRelease(rawRelease: any): BrowseRelease {
    const {
        photocards,
        groups,
        ...releaseFields
    } = rawRelease;

    return {
        ...releaseFields,
        group: groups,
        photocards: photocards?.map((card: any) => {
            const {
                photocards_idol,
                distribution_types,
                photocards_modifiers_global,
                ...cardFields
            } = card;

            return {
                ...cardFields,
                distribution_type: distribution_types ?? null,
                idols: photocards_idol
                    ?.map((p: any) => p.idol)
                    .filter(Boolean) ?? [],
                physical_types_global: photocards_modifiers_global
                    ?.map((p: any) => p.global_modifier)
                    .filter(Boolean) ?? []
            };
        }) ?? []
    };
}