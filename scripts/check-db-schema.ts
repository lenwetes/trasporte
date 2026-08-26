import pg from "pg";

const connectionString = "postgresql://admin:admin@localhost:5432/coopetraes";

async function main() {
    const pool = new pg.Pool({ connectionString });
    try {
        console.log("Checking columns for table 'usuarios'...");
        const res = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'usuarios'
        `);
        console.log("Columns found:");
        res.rows.forEach((row) => {
            console.log(`- ${row.column_name}: ${row.data_type}`);
        });

        const licenseCols = res.rows.filter((r) =>
            r.column_name.includes("licencia"),
        );
        console.log("\nLicense related columns:", licenseCols);
    } catch (error) {
        console.error("Query failed!");
        console.error(error);
    } finally {
        await pool.end();
    }
}

main();
