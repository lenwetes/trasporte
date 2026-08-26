import React from 'react';

export async function GET() {
    // @ts-ignore
    const internals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    return new Response(JSON.stringify({
        keys: Object.keys(internals || {}),
        hasS: internals && 'S' in internals,
        version: React.version
    }), {
        headers: { 'content-type': 'application/json' }
    });
}
