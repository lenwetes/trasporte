import { NextResponse } from 'next/server';
import { FinanceLoansService } from '@/services/finance/finance-loans.service';
import { serializeDecimal } from '@/lib/utils';

export async function GET() {
    try {
        const data = await FinanceLoansService.getLoanDashboard();
        const serialized = serializeDecimal(data);
        return NextResponse.json({ success: true, data: serialized });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: String(e), stack: e?.stack });
    }
}
