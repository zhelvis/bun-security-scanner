import { osvGetVulnById, osvQueryAffectedBatch } from './client/sdk.gen';

export const scanner: Bun.Security.Scanner = {
    version: '1',
    async scan({ packages }) {
        const feed = await osvQueryAffectedBatch({
            body: {
                queries: packages.map(pkg => ({
                    version: pkg.version,
                    package: {
                        name: pkg.name,
                        ecosystem: 'npm',
                    }
                }))
            }
        });

        if (!feed.data?.results) {
            return [];
        }

        const vulnIds: string[] = [];

        for (const result of feed.data.results) {
            if (!result?.vulns) {
                continue;
            }

            for (const vuln of result.vulns) {
                if (vuln.id) {
                    vulnIds.push(vuln.id)
                }
            }
        }

        const vulns = await Promise.all(vulnIds.map(vulnId => osvGetVulnById({
            path: { id: vulnId }
        })));

        const results: Bun.Security.Advisory[] = [];

        for (const vuln of vulns) {
            if (!vuln.data) {
                continue;
            }

            results.push({
                level: 'fatal',
                package: vuln.data.affected?.at(0)?.package?.name ?? 'unknown',
                url: `https://osv.dev/vulnerability/${vuln.data.id}`,
                description: vuln.data.summary ?? null,
            })
        }

        return results;
    },
};