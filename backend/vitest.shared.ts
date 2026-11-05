import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = path.dirname(fileURLToPath(import.meta.url));

// Vite omits design:type. SWC emits string enums as objects, which Mongoose
// then treats as nested schemas. Emit with the TypeScript program so test
// metadata matches `nest build`.
export function decoratorMetadataPlugin() {
  let cache: Map<string, { code: string; map?: string }> | undefined;

  const load = () => {
    if (cache) return cache;

    const configPath = path.join(root, 'tsconfig.json');
    const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
    const parsed = ts.parseJsonConfigFileContent(
      configFile.config,
      ts.sys,
      root,
    );
    const outDir = path.join(root, 'dist');
    const program = ts.createProgram({
      rootNames: parsed.fileNames,
      options: {
        ...parsed.options,
        noEmit: false,
        incremental: false,
        declaration: false,
        declarationMap: false,
        sourceMap: true,
        outDir,
        rootDir: root,
      },
    });

    const next = new Map<string, { code: string; map?: string }>();
    const sourcePath = (fileName: string) => {
      const relative = path.relative(outDir, fileName).replace(/\.js$/, '.ts');
      return path.resolve(root, relative);
    };

    program.emit(undefined, (fileName, text) => {
      if (fileName.endsWith('.js.map')) {
        const source = sourcePath(fileName.slice(0, -4));
        const entry = next.get(source) ?? { code: '' };
        entry.map = text;
        next.set(source, entry);
        return;
      }
      if (!fileName.endsWith('.js')) return;
      const source = sourcePath(fileName);
      const entry = next.get(source) ?? { code: '' };
      entry.code = text.replace(/\n\/\/# sourceMappingURL=.*$/, '');
      next.set(source, entry);
    });

    cache = next;
    return cache;
  };

  return {
    name: 'tsc-decorator-metadata',
    enforce: 'pre' as const,
    buildStart() {
      cache = undefined;
    },
    watchChange() {
      cache = undefined;
    },
    transform(_code: string, id: string) {
      const filename = path.resolve(id.split('?')[0]);
      if (!filename.endsWith('.ts') || filename.includes(`${path.sep}node_modules${path.sep}`)) {
        return null;
      }
      const entry = load().get(filename);
      if (!entry?.code) return null;
      const map = entry.map ? JSON.parse(entry.map) : null;
      if (map) {
        map.sources = [filename];
        map.sourceRoot = '';
      }
      return { code: entry.code, map };
    },
  };
}
