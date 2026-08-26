import { ReportGridSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportesLoading() {
    return (
        <div>
            <div>
                <div>
                    <Skeleton />
                    <div>
                        <Skeleton />
                        <Skeleton />
                    </div>
                </div>
            </div>

            <ReportGridSkeleton />

            <div>
                <Skeleton />
            </div>
        </div>
    );
}
