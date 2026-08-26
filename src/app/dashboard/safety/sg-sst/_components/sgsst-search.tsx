
interface SGSSTSearchProps {
    defaultValue?: string;
}

export function SGSSTSearch({ defaultValue }: SGSSTSearchProps) {
    return (
        <form>
            <span>[SEARCH]</span>
            <input
                name="q"
                type="text"
                defaultValue={defaultValue}
                placeholder="Buscar por nombre o documento..."
                
            />
        </form>
    );
}
