import { Skeleton } from "@/components/ui/skeleton";

export default function HojaVidaLoading() {
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
                    <div>
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                    </div>
                </div>
                <div>
                    <div>
                        <div>
                            <Skeleton />
                            <div>
                                <Skeleton />
                                <Skeleton />
                                <Skeleton />
                            </div>
                        </div>
                        <div>
                            <Skeleton />
                            <Skeleton />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
