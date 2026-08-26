import { StatsSkeleton, TableSkeleton } from "@/components/skeletons";

export default function DashboardLoading() {
    return (
        <div>
            {/* Header Skeleton */}
            <div>
                <div />
                <div />
            </div>

            {/* Stats Grid */}
            <StatsSkeleton />

            {/* Content Area */}
            <div>
                <div>
                    <TableSkeleton rows={8} cols={4} />
                </div>
                <div>
                    <div>
                        <div />
                        <div>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i}> <div />
                                    <div>
                                        <div />
                                        <div />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
