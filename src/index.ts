import path from "node:path";
import * as v from "valibot";
import { osvGetVulnById, osvQueryAffectedBatch } from "./client/sdk.gen";

const packageSchema = v.object({
  name: v.string(),
  version: v.string(),
});

const configSchema = v.object({
  excludes: v.optional(v.array(packageSchema), new Array<v.InferOutput<typeof packageSchema>>()),
});

async function getConfig(
  source = "./bun-security-scanner.json",
): Promise<v.InferOutput<typeof configSchema>> {
  const config = Bun.file(path.resolve(process.cwd(), source));

  if (!(await config.exists())) {
    return v.getDefaults(configSchema);
  }

  const json = await config.json();

  return v.parse(configSchema, json);
}

export const scanner: Bun.Security.Scanner = {
  version: "1",
  async scan({ packages }) {
    const config = await getConfig(process.env.BSS_CONFIG_PATH);

    const feed = await osvQueryAffectedBatch({
      body: {
        queries: packages
          .filter(
            (pkg) =>
              !config.excludes.some(
                (exclusion) => exclusion.name === pkg.name && exclusion.version === pkg.version,
              ),
          )
          .map((pkg) => ({
            version: pkg.version,
            package: {
              name: pkg.name,
              ecosystem: "npm",
            },
          })),
      },
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
          vulnIds.push(vuln.id);
        }
      }
    }

    const vulns = await Promise.all(
      vulnIds.map((vulnId) =>
        osvGetVulnById({
          path: { id: vulnId },
        }),
      ),
    );

    const results: Bun.Security.Advisory[] = [];

    for (const vuln of vulns) {
      if (!vuln.data) {
        continue;
      }

      results.push({
        level: "fatal",
        package: vuln.data.affected?.at(0)?.package?.name ?? "unknown",
        url: `https://osv.dev/vulnerability/${vuln.data.id}`,
        description: vuln.data.summary ?? null,
      });
    }

    return results;
  },
};
