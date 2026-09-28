import ts from 'typescript'
import path from 'node:path'
import fs from 'node:fs'

interface DeprecatedUsage {
  file: string
  line: number
  character: number
  symbolName: string
  jsDocComment: string
  declarationSource: string
}

export function scanDeprecations(projectRoot: string): DeprecatedUsage[] {
  const configPath = path.resolve(projectRoot, 'tsconfig.app.json')
  
  if (!fs.existsSync(configPath)) {
    throw new Error(`tsconfig.app.json not found at ${configPath}`)
  }

  const configFile = ts.readConfigFile(configPath, ts.sys.readFile)
  if (configFile.error) {
    throw new Error(ts.flattenDiagnosticMessageText(configFile.error.messageText, '\n'))
  }

  const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    projectRoot
  )

  const program = ts.createProgram({
    rootNames: parsedConfig.fileNames,
    options: parsedConfig.options,
  })

  const checker = program.getTypeChecker()
  const results: DeprecatedUsage[] = []
  const seenLocations = new Set<string>()

  for (const sourceFile of program.getSourceFiles()) {
    // Only analyze files inside the project's src directory
    if (sourceFile.isDeclarationFile || sourceFile.fileName.includes('node_modules')) {
      continue
    }

    const relativePath = path.relative(projectRoot, sourceFile.fileName)
    if (!relativePath.startsWith('src')) {
      continue
    }

    function checkNode(node: ts.Node) {
      if (ts.isIdentifier(node)) {
        let symbol = checker.getSymbolAtLocation(node)

        if (symbol) {
          // If it's an alias (e.g., imported identifier), resolve it
          if (symbol.flags & ts.SymbolFlags.Alias) {
            try {
              const aliased = checker.getAliasedSymbol(symbol)
              if (aliased) {
                checkSymbol(aliased, node, sourceFile)
              }
            } catch {
              // Ignore alias resolution errors
            }
          }
          checkSymbol(symbol, node, sourceFile)
        }
      }

      ts.forEachChild(node, checkNode)
    }

    function checkSymbol(symbol: ts.Symbol, node: ts.Node, file: ts.SourceFile) {
      const tags = symbol.getJsDocTags(checker)
      const deprecatedTag = tags.find((t) => t.name === 'deprecated')

      if (deprecatedTag) {
        const { line, character } = file.getLineAndCharacterOfPosition(node.getStart())
        const locKey = `${file.fileName}:${line}:${character}:${symbol.name}`

        if (!seenLocations.has(locKey)) {
          seenLocations.add(locKey)

          let comment = ''
          if (deprecatedTag.text && Array.isArray(deprecatedTag.text)) {
            comment = deprecatedTag.text.map((t) => t.text).join('')
          } else if (typeof deprecatedTag.text === 'string') {
            comment = deprecatedTag.text
          }

          let declarationSource = 'unknown'
          const declarations = symbol.getDeclarations()
          if (declarations && declarations.length > 0) {
            const declFile = declarations[0].getSourceFile().fileName
            const nmMatch = declFile.match(/node_modules\/(?:[.]pnpm\/[^/]+\/node_modules\/)?((?:@[^/]+\/)?[^/]+)/)
            if (nmMatch) {
              declarationSource = nmMatch[1]
            } else {
              declarationSource = path.relative(projectRoot, declFile)
            }
          }

          results.push({
            file: path.relative(projectRoot, file.fileName),
            line: line + 1,
            character: character + 1,
            symbolName: symbol.name,
            jsDocComment: comment.trim() || 'No specific replacement message provided.',
            declarationSource,
          })
        }
      }
    }

    ts.forEachChild(sourceFile, checkNode)
  }

  return results
}

// CLI Execution
const projectRoot = process.cwd()
console.log('\n🔍 [Deprecation Scanner] Analyzing source files for deprecated symbols...')

try {
  const issues = scanDeprecations(projectRoot)

  if (issues.length === 0) {
    console.log('✅ [Deprecation Scanner] PASSED: 0 deprecated symbols found in source code.\n')
    process.exit(0)
  } else {
    console.error(`\n❌ [Deprecation Scanner] FAILED: Found ${issues.length} deprecated symbol usage(s):\n`)
    
    issues.forEach((issue, index) => {
      console.error(`  ${index + 1}. ${issue.file}:${issue.line}:${issue.character}`)
      console.error(`     Symbol:  \x1b[31m${issue.symbolName}\x1b[0m (from package: \x1b[33m${issue.declarationSource}\x1b[0m)`)
      console.error(`     Notice:  ${issue.jsDocComment}`)
      console.error(`     Action:  Search official docs for "${issue.declarationSource}" and replace with active API.\n`)
    })

    console.error('👉 Please replace all deprecated symbols before proceeding.\n')
    process.exit(1)
  }
} catch (err: unknown) {
  console.error('Scanner error:', (err as Error).message)
  process.exit(1)
}
