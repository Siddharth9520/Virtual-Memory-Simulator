import { AlgorithmResult, SimulationResults } from '../types/simulator';
import { formatPercent, formatRatio } from './stats';

export function exportTraceToCSV(result: AlgorithmResult): void {
  const { name, capacity, totalReferences, hits, faults, hitRatio, faultRatio, hitPercentage, faultPercentage, steps } = result;

  const frameHeaders = Array.from({ length: capacity }, (_, i) => `Frame ${i + 1}`);

  const lines: string[] = [];

  // Summary Metadata
  lines.push(`"Algorithm:","${name}"`);
  lines.push(`"Physical Frames:","${capacity}"`);
  lines.push(`"Total References:","${totalReferences}"`);
  lines.push(`"Page Hits:","${hits}"`);
  lines.push(`"Page Faults:","${faults}"`);
  lines.push(`"Hit Ratio:","${formatRatio(hitRatio)}","(${formatPercent(hitPercentage)})"`);
  lines.push(`"Fault Ratio:","${formatRatio(faultRatio)}","(${formatPercent(faultPercentage)})"`);
  lines.push(''); // blank line

  // Trace Table Header
  const headers = ['Step', 'Page', ...frameHeaders, 'Status', 'Explanation'];
  lines.push(headers.map((h) => `"${h}"`).join(','));

  // Trace Steps
  for (const s of steps) {
    const frameValues = s.frames.map((f) => (f !== null ? f.toString() : '-'));
    const row = [
      s.step.toString(),
      s.page.toString(),
      ...frameValues,
      s.status,
      `"${s.explanation.replace(/"/g, '""')}"`,
    ];
    lines.push(row.join(','));
  }

  const csvContent = lines.join('\r\n');
  downloadBlob(csvContent, `${result.algorithm.toLowerCase()}_trace_simulation.csv`, 'text/csv;charset=utf-8;');
}

export function exportComparisonToCSV(results: SimulationResults): void {
  const algorithms = ['FIFO', 'LRU', 'OPTIMAL'] as const;
  const lines: string[] = [];

  lines.push('"VMSIM - Page Replacement Algorithm Comparison Matrix"');
  lines.push('');
  lines.push('"Algorithm","Total References","Frames","Page Faults","Page Hits","Hit Ratio","Fault Ratio","Hit %","Fault %"');

  for (const alg of algorithms) {
    const r = results[alg];
    if (r) {
      lines.push(
        `"${r.name}","${r.totalReferences}","${r.capacity}","${r.faults}","${r.hits}","${formatRatio(r.hitRatio)}","${formatRatio(r.faultRatio)}","${formatPercent(r.hitPercentage)}","${formatPercent(r.faultPercentage)}"`
      );
    }
  }

  const csvContent = lines.join('\r\n');
  downloadBlob(csvContent, 'vmsim_comparison_report.csv', 'text/csv;charset=utf-8;');
}

function downloadBlob(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

