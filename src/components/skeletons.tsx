import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton({
    rows = 5,
    cols = 4,
}: {
    rows?: number;
    cols?: number;
}) {
    return (
        <div>
            <div>
                <Skeleton />
                <Skeleton />
            </div>
            <div>
                <div>
                    {Array.from({ length: cols }).map((_, i) => (
                        <Skeleton key={i}  />
                    ))}
                </div>
                <div>
                    {Array.from({ length: rows }).map((_, i) => (
                        <div key={i}>{Array.from({ length: cols }).map((_, j) => (
                                <Skeleton
                                    key={j}
                                    
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}>
 <div>
                        <Skeleton />
                        <div>
                            <Skeleton />
                            <Skeleton />
                        </div>
                    </div>
                    <div>
                        <Skeleton />
                        <div>
                            <Skeleton />
                            <Skeleton />
                        </div>
                    </div>
                    <Skeleton />
                </div>
            ))}
        </div>
    );
}

export function StatsSkeleton() {
    return (
        <div>
            {Array.from({ length: 4 }).map((_, i) => (
                <div
                    key={i}>
 <div>
                        <Skeleton />
                        <Skeleton />
                    </div>
                    <div>
                        <Skeleton />
                        <Skeleton />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function ReportGridSkeleton() {
    return (
        <div>
            {Array.from({ length: 5 }).map((_, i) => (
                <div
                    key={i}>
 <Skeleton />
                    <div>
                        <Skeleton />
                        <Skeleton />
                    </div>
                    <Skeleton />
                </div>
            ))}
        </div>
    );
}
