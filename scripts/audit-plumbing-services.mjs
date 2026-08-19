import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";

const inputPath =
  process.argv[2] ??
  path.resolve(process.cwd(), "data", "plumbing-services.csv");

const outputDir = path.resolve(process.cwd(), "data", "audit");

if (!fs.existsSync(inputPath)) {
  console.error(`CSV not found: ${inputPath}`);
  console.error(
    "Run: node scripts/audit-plumbing-services.mjs /path/to/plumbing-services.csv",
  );
  process.exit(1);
}

fs.mkdirSync(outputDir, { recursive: true });

const raw = fs.readFileSync(inputPath, "utf8").replace(/^\uFEFF/, "");

const rows = parse(raw, {
  bom: true,
  columns: true,
  skip_empty_lines: true,
  relax_column_count: true,
  relax_quotes: true,
  trim: true,
});

const normalize = (value = "") =>
  String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const cleanText = (value = "") =>
  String(value)
    .replace(/\s+/g, " ")
    .trim();

const cleanWebsite = (value = "") => {
  const rawValue = cleanText(value);

  if (!rawValue) return "";

  try {
    const url = new URL(rawValue);
    return `${url.protocol}//${url.hostname}${url.pathname}`.replace(/\/$/, "");
  } catch {
    return "";
  }
};

const cleanPhone = (value = "") => {
  const digits = String(value).replace(/\D/g, "");

  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;

  return "";
};

const isOpen24Hours = (value = "") => {
  const text = normalize(value);

  return (
    text.includes("open 24 hours") ||
    text.includes("24 7") ||
    text.includes("24 hour") ||
    text.includes("24hr")
  );
};

const hasEmergencyEvidence = (row) => {
  const searchable = normalize(
    [
      row.name,
      row.subtypes,
      row.category,
      row.type,
      row.description,
      row.about,
      row.working_hours,
      row.working_hours_csv_compatible,
    ].join(" "),
  );

  return (
    isOpen24Hours(row.working_hours) ||
    isOpen24Hours(row.working_hours_csv_compatible) ||
    searchable.includes("emergency") ||
    searchable.includes("24 7") ||
    searchable.includes("24 hour") ||
    searchable.includes("24hr")
  );
};

const isPlumber = (row) => {
  const category = normalize(row.category);
  const type = normalize(row.type);
  const subtypes = normalize(row.subtypes);
  const name = normalize(row.name);

  const plumbingTerms = [
    "plumber",
    "plumbing",
    "rooter",
    "drainage service",
    "drain cleaning",
    "sewer",
    "water heater",
    "gasfitter",
    "gas installation",
  ];

  const excludedOnlyCategories = [
    "plumbing supply store",
    "hardware store",
    "bathroom supply store",
    "water softening equipment supplier",
    "water treatment supplier",
    "pool cleaning service",
    "swimming pool repair service",
    "appliance repair service",
    "handyman",
    "marketing agency",
    "training center",
    "trade school",
    "property management",
    "auto repair",
    "construction company",
    "home improvement store",
  ];

  const searchable = `${category} ${type} ${subtypes} ${name}`;

  const hasPlumbingSignal = plumbingTerms.some((term) =>
    searchable.includes(term),
  );

  const isClearlyNonPlumber =
    excludedOnlyCategories.includes(category) &&
    !category.includes("plumber") &&
    !type.includes("plumber");

  return hasPlumbingSignal && !isClearlyNonPlumber;
};

const buildDuplicateKey = (row) => {
  const placeId = cleanText(row.place_id);
  if (placeId) return `place:${placeId}`;

  const phone = cleanPhone(row.phone);
  if (phone) return `phone:${phone}`;

  return `name-address:${normalize(row.name)}|${normalize(row.address)}`;
};

const sanitizeRow = (row, classification, reason, duplicateOf = "") => ({
  name: cleanText(row.name),
  city: cleanText(row.city),
  state: cleanText(row.state),
  state_code: cleanText(row.state_code),
  postal_code: cleanText(row.postal_code),
  category: cleanText(row.category),
  type: cleanText(row.type),
  subtypes: cleanText(row.subtypes),
  business_status: cleanText(row.business_status),
  phone: cleanPhone(row.phone),
  website: cleanWebsite(row.website),
  address: cleanText(row.address),
  has_address: Boolean(cleanText(row.address)),
  has_phone: Boolean(cleanPhone(row.phone)),
  has_website: Boolean(cleanWebsite(row.website)),
  open_24_hours: isOpen24Hours(row.working_hours),
  emergency_evidence: hasEmergencyEvidence(row),
  classification,
  reason,
  duplicate_of: duplicateOf,
  source_record_id: cleanText(row.place_id || row.google_id || row.cid),
});

const priority = [];
const manualReview = [];
const excluded = [];
const allCandidates = [];
const seen = new Map();

for (const row of rows) {
  const name = cleanText(row.name);
  const city = cleanText(row.city);
  const stateCode = cleanText(row.state_code);
  const status = normalize(row.business_status);
  const duplicateKey = buildDuplicateKey(row);

  const isDuplicate = seen.has(duplicateKey);
  const originalName = seen.get(duplicateKey) ?? "";

  if (!isDuplicate) {
    seen.set(duplicateKey, name);
  }

  const baseMissing = [];
  if (!name) baseMissing.push("missing name");
  if (!city || !stateCode) baseMissing.push("missing city or state");
  if (!cleanText(row.address)) baseMissing.push("missing address");
  if (!cleanPhone(row.phone)) baseMissing.push("missing phone");

  if (isDuplicate) {
    excluded.push(
      sanitizeRow(row, "excluded", "duplicate record", originalName),
    );
    continue;
  }

  if (status && status !== "operational") {
    excluded.push(
      sanitizeRow(
        row,
        "excluded",
        `business status: ${cleanText(row.business_status)}`,
      ),
    );
    continue;
  }

  if (!isPlumber(row)) {
    excluded.push(
      sanitizeRow(row, "excluded", "not a plumbing service candidate"),
    );
    continue;
  }

  if (baseMissing.length > 0) {
    excluded.push(
      sanitizeRow(row, "excluded", baseMissing.join("; ")),
    );
    continue;
  }

  if (hasEmergencyEvidence(row)) {
    const result = sanitizeRow(
      row,
      "priority_24_7_review",
      "operational plumbing candidate with emergency or 24/7 evidence",
    );
    priority.push(result);
    allCandidates.push(result);
  } else {
    const result = sanitizeRow(
      row,
      "manual_review",
      "operational plumbing candidate without explicit emergency or 24/7 evidence",
    );
    manualReview.push(result);
    allCandidates.push(result);
  }
}

const sortByLocationAndName = (items) =>
  [...items].sort((a, b) =>
    `${a.state_code}-${a.city}-${a.name}`.localeCompare(
      `${b.state_code}-${b.city}-${b.name}`,
    ),
  );

const csvEscape = (value) => {
  const stringValue =
    typeof value === "boolean" ? String(value) : String(value ?? "");

  if (/[,"\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

const writeCsv = (filename, records) => {
  const sorted = sortByLocationAndName(records);
  const headers = sorted.length ? Object.keys(sorted[0]) : [];

  const content = [
    headers.join(","),
    ...sorted.map((record) =>
      headers.map((header) => csvEscape(record[header])).join(","),
    ),
  ].join("\n");

  fs.writeFileSync(path.join(outputDir, filename), content, "utf8");
};

const groupBy = (items, getKey) => {
  const result = new Map();

  for (const item of items) {
    const key = getKey(item);
    result.set(key, (result.get(key) ?? 0) + 1);
  }

  return [...result.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
};

const citySummary = groupBy(
  allCandidates,
  (item) => `${item.city}, ${item.state_code}`,
);

const categorySummary = groupBy(
  allCandidates,
  (item) => item.category || "Uncategorized",
);

const summary = {
  generated_at: new Date().toISOString(),
  input_file: inputPath,
  total_rows: rows.length,
  priority_24_7_review: priority.length,
  manual_review: manualReview.length,
  excluded: excluded.length,
  candidate_total: allCandidates.length,
  candidates_by_city: citySummary,
  candidates_by_category: categorySummary,
};

writeCsv("priority-24-7-candidates.csv", priority);
writeCsv("manual-review-operating-plumbers.csv", manualReview);
writeCsv("excluded-records.csv", excluded);
writeCsv("all-candidates.csv", allCandidates);

fs.writeFileSync(
  path.join(outputDir, "summary.json"),
  JSON.stringify(summary, null, 2),
  "utf8",
);

const markdown = `# Plumbing Services Audit

## Totals

- Source rows: ${summary.total_rows}
- Priority 24/7 candidates: ${summary.priority_24_7_review}
- Operating plumbers for manual review: ${summary.manual_review}
- Excluded records: ${summary.excluded}
- Total candidates: ${summary.candidate_total}

## Candidates by city

${citySummary.map((item) => `- ${item.key}: ${item.count}`).join("\n")}

## Candidates by category

${categorySummary.map((item) => `- ${item.key}: ${item.count}`).join("\n")}

## Output files

- \`priority-24-7-candidates.csv\`
- \`manual-review-operating-plumbers.csv\`
- \`excluded-records.csv\`
- \`all-candidates.csv\`
- \`summary.json\`

These files intentionally exclude Google Maps links, review URLs, booking URLs, tracking parameters, tokens, images, and raw identifiers not needed for manual review.
`;

fs.writeFileSync(path.join(outputDir, "summary.md"), markdown, "utf8");

console.log(`Audit complete. Output written to: ${outputDir}`);
console.table({
  totalRows: summary.total_rows,
  priority24x7: summary.priority_24_7_review,
  manualReview: summary.manual_review,
  excluded: summary.excluded,
});