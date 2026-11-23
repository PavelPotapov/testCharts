// Inspect the public JSX props from the version installed by the lockfile.
import ts from 'typescript';
import path from 'node:path';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const filename = path.join(root, '__chart_api__.tsx');
const components =
  'LineChart Line AreaChart Area BarChart Bar BarStack ComposedChart ScatterChart Scatter RadarChart Radar PieChart Pie RadialBarChart RadialBar FunnelChart Funnel Treemap CartesianGrid XAxis YAxis ZAxis ReferenceLine ReferenceArea ReferenceDot Brush ErrorBar PolarGrid PolarAngleAxis PolarRadiusAxis Tooltip Legend Label LabelList'.split(
    ' '
  );
const source =
  "import type {ComponentProps} from 'react'; import * as R from 'recharts';\n" +
  components
    .map((n) => 'type ' + n + ' = ComponentProps<typeof R.' + n + '>;')
    .join('\n');
const options = {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  skipLibCheck: true,
  strict: true,
};
const host = ts.createCompilerHost(options);
const original = host.getSourceFile.bind(host);
host.getSourceFile = (f, ...rest) =>
  path.resolve(f) === filename
    ? ts.createSourceFile(f, source, options.target, true)
    : original(f, ...rest);
const program = ts.createProgram([filename], options, host);
const file = program.getSourceFile(filename);
const diagnostics = program.getSemanticDiagnostics(file);
if (diagnostics.length)
  throw Error(
    ts.flattenDiagnosticMessageText(diagnostics[0].messageText, '\n')
  );
const checker = program.getTypeChecker();
const inventory = {};
for (const statement of file.statements) {
  if (!ts.isTypeAliasDeclaration(statement)) continue;
  const props = checker.getPropertiesOfType(
    checker.getTypeFromTypeNode(statement.type)
  );
  if (!props.length) throw Error('Missing props: ' + statement.name.text);
  const own = [],
    platform = [];
  for (const prop of props) {
    if (
      prop.name === 'ref' ||
      prop.name === 'key' ||
      prop.name.startsWith('__')
    )
      continue;
    const declaredByRecharts = prop.declarations?.some((d) =>
      d.getSourceFile().fileName.replaceAll('\\', '/').includes('/recharts/')
    );
    (declaredByRecharts &&
    !prop.name.startsWith('on') &&
    prop.name !== 'dangerouslySetInnerHTML'
      ? own
      : platform
    ).push(prop.name);
  }
  inventory[statement.name.text] = {
    props: own.sort(),
    platform: platform.sort(),
  };
}
// Shared platform lists are interned so the reference stays small.
const lists = [],
  result = {};
for (const [name, entry] of Object.entries(inventory)) {
  const list = entry.platform.join(' ');
  let i = lists.indexOf(list);
  if (i < 0) i = lists.push(list) - 1;
  result[name] = { props: entry.props.join(' '), platform: i };
}
writeFileSync(
  new URL('../src/recharts-api.json', import.meta.url),
  JSON.stringify({ components: result, platform: lists }, null, 2) + '\n'
);
console.log('Audited ' + components.length + ' component contracts.');
