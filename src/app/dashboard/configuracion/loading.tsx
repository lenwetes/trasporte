import { Skeleton } from "@/components/ui/skeleton";

export default function ConfiguracionLoading() {
    return (
        <div>
            <div>
                <Skeleton />
                <Skeleton />
            </div>

            <div>
                <div>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i}  />
                    ))}
                </div>

                <div>
                    <div>
                        <Skeleton />
                        <Skeleton />
                    </div>

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

                    <div>
                        <Skeleton />
                    </div>
                </div>
            </div>
        </div>
    );
}
