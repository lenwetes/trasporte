import { Skeleton } from "@/components/ui/skeleton";

export default function EditarPerfilLoading() {
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

            <div>
                <div>
                    <Skeleton />
                </div>
                <div>
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i}> <Skeleton />
                            <Skeleton />
                        </div>
                    ))}
                </div>
                <div>
                    <Skeleton />
                </div>
            </div>
        </div>
    );
}
