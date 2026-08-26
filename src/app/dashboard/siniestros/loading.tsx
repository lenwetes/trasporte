import { StatsSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function SiniestrosLoading() {
    return (
        <div>
            <div>
                <div>
                    <Skeleton />
                    <Skeleton />
                </div>
                <div>
                    <Skeleton />
                    <Skeleton />
                </div>
            </div>

            <StatsSkeleton />

            <div>
                <div>
                    <Skeleton />
                    <Skeleton />
                </div>

                <div>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}>
 <Skeleton />
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
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
