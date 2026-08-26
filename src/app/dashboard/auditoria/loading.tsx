import { TableSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function AuditoriaLoading() {
    return (
        <div>
            <div>
                <div>
                    <Skeleton />
                    <Skeleton />
                </div>
                <Skeleton />
            </div>

            <TableSkeleton rows={15} cols={5} />
        </div>
    );
}
