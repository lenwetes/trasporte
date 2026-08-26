import { TableSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function NovedadesLoading() {
    return (
        <div>
            <div>
                <div>
                    <Skeleton />
                    <Skeleton />
                </div>
                <Skeleton />
            </div>

            <div>
                {/* Sidebar Skeleton */}
                <div>
                    <div>
                        <Skeleton />
                        <Skeleton />
                    </div>
                    <div>
                        <Skeleton />
                        <div>
                            <Skeleton />
                            <Skeleton />
                            <Skeleton />
                            <Skeleton />
                        </div>
                    </div>
                </div>

                {/* Main Content Skeleton */}
                <div>
                    <TableSkeleton rows={10} cols={4} />
                </div>
            </div>
        </div>
    );
}
