import { CardGridSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function VehiculosLoading() {
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
                <Skeleton />
                <Skeleton />
                <Skeleton />
            </div>

            <CardGridSkeleton count={6} />
        </div>
    );
}
