import { CardGridSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function ConductoresLoading() {
    return (
        <div>
            <div>
                <div>
                    <Skeleton />
                    <Skeleton />
                </div>
            </div>

            <div>
                <Skeleton />
                <Skeleton />
            </div>

            <CardGridSkeleton count={6} />
        </div>
    );
}
